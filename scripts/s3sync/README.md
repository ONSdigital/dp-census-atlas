`s3sync` copies files to and from S3 and local directories.

Its initial use is for uploading Census Map data to S3 from certain machines that cannot
run the AWS CLI.
It may be useful in other situations, but note how it does certain things in the man page.

To build the `s3sync` binary (requires local Go compiler):

	$ make s3sync

See the [man page](s3sync.md) for usage instructions.

For a normal man page in your terminal, run:

	$ make man

See [AWS SSO CLI](https://github.com/synfinatic/aws-sso-cli) for an AWS authentication
wrapper that can be used with `s3sync`.
