#!/usr/bin/env python

import argparse
import datetime
import json
import pathlib
import re
import sys

from csv import DictReader
from typing import Iterator


TAXONOMIC_ORDER = [
    "topic",
    "variable",
    "category",
    "sub-category",
]
NESTED_KEYS = {
    "topic": "variables",
    "variable": "categories",
    "category": "sub-categories",
    "sub-category": None
}
DESC_PLACEHOLDER = "Lorem ipsum dolor sit amet."


def slugify(name: str) -> str:
    return "-".join(re.sub(r"[^a-zA-Z0-9]", " ", name.lower()).split())


def is_nested(row, rows: list[dict], i: int) -> bool:
    if i >= len(rows):
        return False
    return TAXONOMIC_ORDER.index(rows[i]["taxonomy"]) > TAXONOMIC_ORDER.index(row["taxonomy"])


def is_total_code(code: str) -> bool:
    return code.endswith("0001")


def norm_template_taxonomy(template_string: str) -> str:
    return template_string.replace("{category_", "{variable_").replace("{subject_", "{category_")


def process_census_content(rows: list[dict], i: int) -> (dict, int):
    # extract current row
    row = rows[i]

    # init content dict
    content = {
        "name": row["name"],
        "slug": slugify(row["name"]),
    }

    # everything except topics should have a code
    if row["taxonomy"] != "topic":
        if row["code"] == "":
            raise Exception(f"Content definition does not include a code! {row}")
        else:
            content["code"] = row["code"]


    # everything except totals categories should have a description
    if not is_total_code(row["code"]):
        if row["desc"] == "":
            raise Exception(
                f"Content definition is not for a totals category but does not include a description! {row}"
            )
        else:
            content["desc"] = row["desc"]

    # all non-totals categories should have all three Data percentage components
    if row["taxonomy"] in ("category", "sub-category") and not is_total_code(row["code"]):
        dpcs = (
            row["Data percentage component 2"], 
            row["Data percentage component 3"]
        )
        if all(dpc == "" for dpc in dpcs):	
            raise Exception(
                f"Content definition for category or sub-category did not include dpc strings! {row}"
            )
        else:
            content["category_h_pt2"] = norm_template_taxonomy(row["Data percentage component 2"])
            content["category_h_pt3"] = norm_template_taxonomy(row["Data percentage component 3"])

     # all non-totals categories should have a comparison component 2
    if row["taxonomy"] in ("category", "sub-category") and not is_total_code(row["code"]):
        if row["comparison component 2"] == "":	
            raise Exception(
                f"Content definition for category or sub-category did not include comparison component 2 strings! {row}"
            )
        else:
            content["cat_location_summary_pt2"] = norm_template_taxonomy(row["comparison component 2"])

    # all variables should have units!
    if row["taxonomy"] == "variable":
        if row["units"] == "":
            raise Exception(f"Classification definition does not include units! {row}")
        else:
            content["units"] = row["units"]

    # deal with nested content using lookahead
    i+=1
    nested_key = NESTED_KEYS[row["taxonomy"]]
    while is_nested(row, rows, i):
        if nested_key not in content:
            content[nested_key] = []
        next_content, i = process_census_content(rows, i)
        if "code" in next_content and is_total_code(next_content["code"]):
            content["total"] = next_content
        else:
            content[nested_key].append(next_content)

    return content, i


def main(fp: pathlib.PurePath, no_metadata=False):
    with open(fp) as f:
        rows = list(DictReader(f))
        content = []
        i = 0
        while i < len(rows):
            new_content, i = process_census_content(rows, i)
            content.append(new_content)
        
        # collate output
        if no_metadata:
            output = content
        else:
            output = {
                "meta": {
                    "source": fp.name,
                    "utc_created_at": datetime.datetime.utcnow().isoformat()
                },
                "content": content
            }

    with open(fp.with_suffix(".content.json"), 'w') as f:
       json.dump(output, f, indent=2)


if __name__=="__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("fp", type=str, help="String, filepath for csv file to create content JSON from.")
    parser.add_argument("--no-metadata", default=False, action="store_true", help="Do not append metadata to content JSON (default True)")
    args = parser.parse_args()
    fp = pathlib.PurePath(args.fp)
    main(fp, args.no_metadata)