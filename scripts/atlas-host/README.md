# The Atlas host

The Atlas host is used to

* process data files used by the Census Map front end application
* transfer large or sensitive files to and from S3

A specific host is used for this work because some of the processing is too heavyweight for our laptops, and because it allows us to do all processing within the AWS environment.
No data needs to be downloaded to our laptops.

The Atlas host mainly runs Docker, and most of the processing is done from within containers.

The container image includes all the tools needed, and users shell in to do their work.
Persistent data is held on an EFS mount or in a local docker volume.
User homes are on EFS and a container's `/local` is on a docker volume.

(`/local` survives container resizes, and EFS homes survive host rebuilds.
`/local` will also survive container resizes; if you change the container to a `t2.micro`, `/local` will be preserved.
But don't change the size of `/local` or destroy and rebuild the instance.
That *will* blow it away.)

Although all users shell into the Atlas host as `ubuntu`, there is a notion of separate users inside containers.
Unix accounts are set up within the container.
To use this mechanism, `sshd` listens on a host-local docker network.
There are no passwords on user accounts; only ssh keys are allowed.

The user mechanism is designed as a convenience to keep user work separate;
it's not really secure since `ubuntu` is effectively superuser.


## Building an Atlas host

The Atlas host is built with terraform and ansible in the [dp-setup](https://github.com/ONSdigital/dp-setup) repo.

Instructions are in [terraform/dp-census-atlas-ec2](https://github.com/ONSdigital/dp-setup/tree/awsb/terraform/dp-census-atlas-ec2).

There is an instance in Sandbox and in Prod.


## Developer Prerequisites

To use the Atlas host, you must have a few things set up locally:

* AWS account in the environment running the Atlas host you want to use -- talk to a tech lead
* aws cli and session manager installed and working [Supporting AWSB](https://docs.google.com/document/d/1N8k1HnI7R1f9KgFPLAu37bGDLGPPWF9Gk-eiAQlsxm4)
* dp cli installed and working [dp-cli](https://github.com/ONSdigital/dp-cli)


## atlas.env

Certain environment variables must be set when working with any of the atlas utilities:

	AWS_PROFILE
	ATLAS_USER
	COMPOSE_PROJECT_NAME
	ONS_DP_ENV

`AWS_PROFILE` is `dp-sandbox` or `dp-prod` currently.
(We haven't set up a staging instance yet.)

`ATLAS_USER` is your username in the Atlas container.
These are hardcoded in the Dockerfile used to create the image.
See the Dockerfile for yours.

`COMPOSE_PROJECT_NAME` is used to distinguish your Docker objects from other users'.
The convention is `atlas-$ATLAS_USER`.

`ONS_DP_ENV` is `sandbox` or `prod`.

You can copy `atlas.env.example` to an environment-specific file and modify to suit.

Then source your env file before working with any atlas utilities, eg:

	. ./sandbox.env

You can clear the environment variables with:

	. ./no.env


## ssh.cfg

ssh is used to get shells on the Atlas host and its containers, and to create tunnels to Docker running on the Atlas host.
Once you have set the required environment variables, you can Generate a custom `ssh.cfg` file like this:

	make ssh.cfg

Before your container is up, you will see an error message, but the file will be configured enough for you to reach the Atlas host itself.
Run `make ssh.cfg` once your container is up, or whenever there is a change to the host or container.

There are `Makefile` targets for basic ssh operations, but for anything else you can call `ssh`, `scp`, or `sftp` with `-F ssh.cfg`.
Run `make` without any arguments to see a list of targets.


## Logging in to the Atlas host

To log in to the Atlas host, do this:

	make ssh-atlas

This will give you a shell as `ubuntu`.

It is equivalent to

	dp ssh sandbox atlas 1

except that `dp` won't work until the ansible inventory in `dp-setup` is updated with an `[atlas]` host group.


## Create docker tunnel

When you need to access docker on the Atlas host, set up a tunnel like this:

	make tunnel

Then you can point the docker cli to `tcp://localhost:2375`.


## Setting up Remote Docker Context

As an easy way to get the docker cli to talk to the tunnel, you can create a docker context.
Do something like this locally:

	docker context create --description 'docker on atlas host' --docker tcp://localhost:2375 atlas

And when you want to access docker on the Atlas host, do this first:

	docker context use atlas

(Because ssh access requires the `aws-ssm-ec2-proxy-command.sh` wrapper, it isn't possible to create an ssh-based context currently.)


## Building the Atlas Image

The Atlas image is a "fat" image based on a ubuntu base with all of the necessary utilities installed.
To avoid stomping on each others' work, each developer builds and runs their own images.

The convention for image names is `atlas-$ATLAS_USER`, where `ATLAS_USER is set in `atlas.env`.

If the ssh tunnel is up, and you are using the `atlas` context, you can do this:

	make image

Change `Dockerfile` and rebuild your image if you need to add/update/remove packages in your work environment.
Since homes are located in a separate volume, you can replace your image as needed without having to set up your home again.


## Enabling logins in your Atlas Container

You need to set up your ssh key in your home directory before you can login to your container.

Home directories are under `/data` on the Atlas host.
For example `/data/dl` is my home.

So login to the Atlas host and set up a basic home which allows you to login, something like this:

	make ssh-atlas
	sudo -s
	cd /data
	mkdir -m 0700 dl		# your username as seen in Dockerfile
	mkdir -m 0700 dl/.ssh		#   "      "
	vi dl/.ssh/authorized_keys	# << paste in your ssh public key
	chown -R 2001:2001 dl		# use your uid:gid as seen in Dockerfile


## Starting your Atlas Container

You can start a detached container running your image:

	make up

This will automatically update `ssh.cfg` to allow you to ssh to your container.


## Logging in to your Container

You can ssh to your running container like this:

	make ssh-container


## Stopping your Atlas Container

Stop your container like this:

	make down


## local Volume

Since EFS is relatively slow, containers also have a `/local` volume that uses space
on the docker EBS volume (under `/var/lib/docker` on the Atlas host).

You can use /local instead of your home if you need faster IO.


## scp and sftp

You can transfer files to and from your container with `scp` and `sftp`.
Just add `-F ssh.cfg` to the command line:

	scp -F ssh.cfg example.txt container:

or

	sftp -F ssh.cfg container


## Provisioning Atlas users

If you need to add another shell user to the Atlas image:

1. Edit `Dockerfile` and add a new group and user in the "Create user accounts" section.
   Note the uid and gid.
2. Become superuser on the Atlas host and create a home directory for the new user under `/data`.
   Change user and group of the home directory to the new user's uid and gid.
   Set the home directory to mode `0700`.
3. Create a `.ssh` directory for the user, setting user, group and mode like the home directory.
4. Create an `authorized_keys` file for the new user with the user's ssh public key.
   Set user, group and mode to uid, gid, `0644`.
5. Build a new image with `make image`.

It's up to the new user to log in and set up their own environment.


## Accessing github from the Atlas host or a container

Outbound port 22 is blocked at the VPC level, so we need to access github on port 443.
Add this tweak to your `~/.ssh/config` file in your container:

	Host github.com
		Hostname ssh.github.com
		Port 443
		User git

See [Using SSH over the HTTPS port](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port)


## Credits

The `aws-ssm-ec2-proxy-command.sh` script was stolen from https://github.com/qoomon/aws-ssm-ec2-proxy-command.
