# upload zipped tiles + breaks data to s3 and unzip with the atlas host (NB TEMPORARY STOPGAP)

## The problem

- Census maps data consists of hundreds of thousands of very small files, served from s3
- the s3 bucket can only be accessed from either inside the VPC, an ONS laptop on the VPN, or within the ONS offices.
- ONS laptops cannot install the AWS CLI, and so can only use the AWS GUI to upload files
- uploading hundreds of thousands of very small files with the AWS GUI is incredibly slow (30 B/s slow) - it can take a week to upload
enough data for one release

## The solution

Zipping up the census maps data into a single archive and uploading that is much, much, much faster. However, this still
needs to be unzipped and added to the s3 bucket as individual files in order to work. This can be done by uploading the
zip, logging into the Atlas host EC2 instance, downloading the zip file from s3, unzipped it, and uploading it to s3
again as individual files. This requires some manual workarounds (see below). Once the atlas host is up and usable for
its intended purpose (producing the data files and adding them to s3) none of the manual workarounds should be neccessary.

1. upload the zip file with the data from your ONS laptop into the target bucket using the AWS GUI
2. from your dev machine, log into the atlas host with `dp ssh prod atlas 1` (assuming you have prod access etc set up)
3. copy the `dp-prod` profile from your local `~/.aws/config` file to the `~/.aws/config` file on the atlas host
4. sign in to AWS SSO with `aws sso login --profile dp-prod` from the atlas host. You will need to open a browser, go to the URL indicated in the terminal (shoud be [https://device.sso.eu-west-2.amazonaws.com/](https://device.sso.eu-west-2.amazonaws.com/), but check), and copy/paste the access code from the terminal on the host to the sso website, then click `Allow`. The terminal on the atlas host should say login was successful.
5. export `AWS_PROFILE=dp-prod` on the atlas host terminal so that the aws cli knows which profile to use.
6. get your current AWS user id by calling `aws sts get-caller-identity`. Copy the displayed value for `UserId`. 
7. log in to the `dp-prod` AWS console on your dev machine, go to the target bucket, and edit the bucket policy. Add the following to the `Condition` part of the `Deny` block of the policy:

```JSON
    "StringNotLike": {
        "aws:userId": [
            <your current UserId>,
        ]
    },
```
8. Add `S3:PutObject` to the actions available to users able to access the bucket:

```JSON
 {
    "Sid": "",
    "Effect": "Allow",
    "Principal": {
        "AWS": "*"
    },
    "Action": [
        "s3:GetObject",
        "s3:PutObject"
    ],
    "Resource": "arn:aws:s3:::ons-dp-prod-census-maps-dem-mig/*"
},
```

9. The policy should now look something like this:

```JSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::ons-dp-prod-census-maps-dem-mig/*"
        },
        {
            "Sid": "",
            "Effect": "Deny",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::ons-dp-prod-census-maps-dem-mig/*",
            "Condition": {
                "StringNotLike": {
                    "aws:userId": "<your User ID>"
                },
                "NotIpAddress": {
                    "aws:SourceIp": [
                        "10.27.0.0/16",
        .... blah

```
9. you should now be able to get the zip file you uploaded from the target bucket with `aws s3 cp s3://<my target bucket>/<my zip file>.zip <my zip file>.zip`
10. you should now be able to unzip that file locally with `unzip <my zip file>.zip -d <my zip file>`.
11. you should now be able to sync the contents of your zip file to s3 (presumably there is a `tiles` and a `breaks` folder in there) with:
```
cd <my zip file>
aws s3 sync breaks s3://<my target bucket>/breaks
aws s3 sync tiles s3://<my target bucket>/tiles
```
12. Once done and checked, **clean up!**: 
    - remove the reference to your user ID from the bucket policy.
    - remove `S3:PutObject` from the list of permitted bucket actions.
    - remove the zip file and unzipped directory from the atlas host filesystem
    - logout from sso with `aws sso logout`
    - remove your AWS credenentials by either deleting or blanking `~/.aws/config`