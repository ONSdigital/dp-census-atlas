#!/usr/bin/env bash

# NB ASSUMES:
# - you have aws sso access to the ons-dp-sandbox-atlas-data bucket
# - you are logged in to aws sso

AWS_PROFILE=dp-sandbox aws s3 sync output_content_jsons s3://ons-dp-sandbox-atlas-data/content-json/2021