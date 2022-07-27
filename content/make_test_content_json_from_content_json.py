#!/usr/bin/env python

"""
Scrape all unique category from the TEST_GEODATA_BUCKET/LAD_DATA_TILES_PREFIX and replace each category.code
in the content_json file (provided as first arg) with a randomly chosen test category code, then write out to 
a new content_json file, named as the input file but suffixed with '-test'.
"""

import json
from pathlib import Path
import random
import sys
from typing import Generator

import boto3


TEST_GEODATA_BUCKET = "ons-dp-sandbox-atlas-data"
LAD_DATA_TILES_PREFIX = "quads/lad" # scrape keys from lad data tiles because there's the least amount of them!

s3 = boto3.client("s3")


def bucket_keys(bucket: str, prefix: str) -> Generator[str, None, None]:
    """Return generator for all keys found under prefix in bucket."""
    kwargs = {"Bucket": bucket, "Prefix": prefix}
    while True:
        resp = s3.list_objects_v2(**kwargs)
        for obj in resp['Contents']:
            yield obj['Key']
        try:
            kwargs['ContinuationToken'] = resp['NextContinuationToken']
        except KeyError:
            break


def get_category_codes_from_s3(geodata_bucket: str, prefix: str) -> list[str]:
    """get all unique census category codes from the geodata_bucket."""
    cat_codes = set()
    for key in bucket_keys(geodata_bucket, prefix):
        cat_codes.add(Path(key).stem)
    return list(cat_codes)


def main() -> None:
    test_cat_codes = get_category_codes_from_s3(TEST_GEODATA_BUCKET, LAD_DATA_TILES_PREFIX)
    content_json = sys.argv[1]
    output_filename = content_json.replace(".json", "-test.json")
    
    with open(content_json, "r") as f:
        content = json.load(f)
    
    for topic in content:
        for variable in topic["variables"]:
            for classification in variable["classifications"]:
                for category in classification["categories"]:
                    category["code"] = random.choice(test_cat_codes)
    
    with open(output_filename, "w") as f:
        json.dump(content, f, indent=2)


if __name__=="__main__":
    main()