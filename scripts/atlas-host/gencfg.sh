#! /bin/sh
#
# This script generates an ssh config file to make it easier to connect to the
# Atlas host and containers running on that host.
#
# If docker is not reachable when this script is run, the container Hostname
# is "placeholder", which won't work, but satisfies the syntax.

set -e

main() {
	local instance=$(
		aws ec2 describe-instances \
			--filter "Name=tag:Name,Values=$ONS_DP_ENV - atlas 1" \
			--query 'Reservations[0].Instances[0].InstanceId' \
			--output text
	)
        local ip=$(
                docker network inspect \
                        -f '{{range .Containers}}{{.IPv4Address}}{{end}}' \
                        atlas-${ATLAS_USER}_default |
                cut -d / -f1
        )

	if test -z "$ip"
	then
		ip=placeholder
	fi

	cat <<EOF
Host atlas
    IdentityFile ~/.ssh/id_awsb
    ProxyCommand ./aws-ssm-ec2-proxy-command.sh $instance ubuntu 22 ~/.ssh/id_awsb.pub
    User ubuntu
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null

Host container
    ProxyJump atlas
    User $ATLAS_USER
    Hostname $ip
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    # git needs ssh credentials
    ForwardAgent yes
EOF
}

main "$@"
