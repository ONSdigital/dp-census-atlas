#!/usr/bin/env python

import csv
import json
import re
import sys


def refactor_topic(topic: dict) -> dict:
    return {
        "name": topic["name"],
        "slug": topic["slug"],
        "desc": topic["desc"],
        "variables": [refactor_variable(var) for var in topic["variables"]]
    }

def refactor_variable(variable: dict) -> dict:
    return {
        "name": variable["name"],
        "slug": variable["slug"],
        "code": variable["code"],
        "desc": variable["desc"],
        "units": variable["units"],
        "classifications": [make_default_classification(variable)],
    }


def make_default_classification(variable: dict) -> dict:
    return {
        "code": variable["code"],
        "slug": variable["slug"],
        "desc": variable["desc"],
        "chorolpleth_default": True,
        "categories": [refactor_category(cat) for cat in variable["categories"]]
    }


def refactor_category(category: dict) -> dict:
    category_h_pt2_components = re.split("({location})", category["category_h_pt2"])
    return {
        "name": category["name"],
        "slug": category["slug"],
        "code": category["code"],
        "desc": category["desc"],
        "legend_str_1": "".join(category_h_pt2_components[:2]),
        "legend_str_2": category_h_pt2_components[2],
        "legend_str_3": category["category_h_pt3"]
    }


def main():
    old_content_json_fp = sys.argv[1]
    output_filename = sys.argv[2]
    with open(old_content_json_fp, "r") as f:
        old_content = json.load(f)
    new_content = [refactor_topic(t) for t in old_content]
    
    with open(output_filename, "w") as f:
        json.dump(new_content, f, indent=2)

if __name__ == "__main__":
    main()