#!/usr/bin/env python

"""
Scrape all unique category from the TEST_GEODATA_BUCKET/LAD_DATA_TILES_PREFIX and replace each category.code
in the content_json file (provided as first arg) with a randomly chosen test category code, then write out to
a new content_json file, named as the input file but suffixed with '-test'.
"""
from datetime import datetime
from pathlib import Path
import random
import sys
from typing import Generator

from census_objects import load_content, write_content

import boto3


TEST_GEODATA_BUCKET = "ons-dp-sandbox-atlas-data"
LAD_DATA_TILES_PREFIX = "newquads/tiles/lad" # scrape keys from lad data tiles because there's the least amount of them!

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
    content_json_fn = Path(sys.argv[1])

    content = load_content(content_json_fn)

    now = datetime.now().strftime("%Y-%m-%d%Z%H-%M-%S")
    content["meta"].update({
        "converted_to_2011_test_data_at": now
    })

    for topic_group in content["content"]:
        for topic in topic_group.topics:
            for variable in topic.variables:
                for classification in variable.classifications:
                    for category in classification.categories:
                        category.name = f"2011_TEST-{category.name}"
                        category.code = random.choice(test_cat_codes)

    output_filename = content_json_fn.parent.joinpath(f"2011-TEST-{content_json_fn.stem}.json")
    write_content(content, output_filename)


if __name__=="__main__":
    main()