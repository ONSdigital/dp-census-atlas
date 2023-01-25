s3sync(1) - General Commands Manual

# NAME

**s3sync** - transfer files to and from S3

# SYNOPSIS

**s3sync**
\[**-h**]
\[**-n**]
\[**-C**]
\[**-D**]
\[**-w**&nbsp;*workers*]
*src*
*dst*

# DESCRIPTION

**s3sync**
transfers files between S3 and a local directory.
Its default mode copies missing or changed files from
*src*
to
*dst*,
and removes files on
*dst*
which don't exist on
*src*.

CRC32 checksums determine if a file has changed or not.

**s3sync**
recognises the following flags:

**-n**

> Dryrun.
> No changes are made, and you can see what would be done.
> This is a good way to test if your AWS authentication is working.

**-C**

> Missing S3 checksums are ok.
> It is normally an error if an existing S3 object does not have a CRC32 checksum.
> When -C is used, a missing checksum will not return an error, but the object will
> always be considered changed, and will always be re-uploaded.
> But on the re-upload the checksum should be set so subsequent comparisons will have a
> valid checksum.

> An edge case is when syncing from S3 to S3 and the source objects do not have checksums.
> In this case there are no checksums available to post to the destination.
> But you can sync to a local temporary directory first, then sync to the destination bucket.
> This would generate checksums for the destination.

**-D**

> Do not delete files on destination.

**-w** *workers*

> Use
> *workers*
> concurrent goroutines in the checksum, copy and remove phases.
> The default for workers is the value of Go's
> '`runtime.NumCPU`'
> function.
> You can see what this by running
> **s3sync**
> **-h**.
> The default value for workers will be included in the help message.

*src*
and
*dst*
can be S3 locations or local directories.
Any combination is supported.

S3 locations are specified with a URI that looks like
'`s3:// *bucket*[*/prefix*]`'.

Local directories are normal file paths.
These can be relative, and on Windows may include a drive letter.

# IMPLEMENTATION NOTES

S3 has two mechanisms which are almost useful for determining whether a file would need to be transfered or not.
Objects have a LastModified timestamp and MD5 checksums.
Unfortunately LastModified is set by the AWS machine receiving the S3 upload request and is not under the control of the caller.
And the MD5 checksum is not necessarily a checksum over the entire object.
In multipart uploads, a checksum is used for each part; there is no overall checksum.
So in order to determine whether an object's content has changed or not, a separate
checksum must be maintained and compared.
This obviously has performance implications since checksums have to be calculated on
local files every time.

All authentication is offloaded to
**aws-sso**,
which sets all necessary environment
variables for
**s3sync**
to use.
**s3sync**
is intended to run as a child under
**aws-sso**,
so there are no explicit mechanisms for setting up AWS authentication.
If you know which environment variables to set, you can use
**s3sync**
without
**aws-sso**.
For example, in simple situations you can just set
`AWS_REGION`,
`AWS_ACCESS_KEY_ID`,
and
`AWS_SECRET_ACCESS_KEY`.

# ENVIRONMENT

These environment variables are normallys set by
**aws-sso**,
but you can set them yourself instead of running
**aws-sso**.

`AWS_ACCESS_KEY_ID`  
`AWS_SECRET_ACCESS_KEY`  
`AWS_SESSION_TOKEN`  
`AWS_DEFAULT_REGION`  
`AWS_PROFILE`

You always have to set
`AWS_REGION`.

# EXIT STATUS

The **s3sync** utility exits0 on success, and>0 if an error occurs.

# EXAMPLES

For simple AWS authentication setups you could set an account's environment variables
and run
**s3sync**
directly:

> export AWS_REGION=eu-west-2
> export AWS_ACCESS_KEY_ID=<id>
> export AWS_SECRET_ACCESS_KEY=<secret>
> s3sync -n ./somedir s3://mybucket

For more complicated authentication, you can run
**s3sync**
under
**aws-sso**.
**aws-sso**
will prompt for the account or role you want to use, or you can provide these on the command line.
See the
**aws-sso**
docs for more info.

> export AWS_REGION=eu-west-2
> aws-sso exec -- s3sync -n ./somedir s3://mybucket

# SEE ALSO

[AWS SSO CLI](https://github.com/synfinatic/aws-sso-cli)  
[AWS CLI s3 subcommand](https://docs.aws.amazon.com/cli/latest/reference/s3/index.html)

# BUGS

Checksums for local files have to be calculated on every run.

`AWS_REGION`
has to be set explicitly.
It doesn't seem like
**aws-sso**
sets this (or else I'm not using aws-sso right).

Debian - January 25, 2023
