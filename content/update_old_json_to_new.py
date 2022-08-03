#!/usr/bin/env python

import csv
import json
import re
import sys


UNIT_SINGULARS = {
    "Households": "Household",
    "People": "Person"
}


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
        "units": UNIT_SINGULARS[variable["units"]],
        "classifications": [make_default_classification(variable)],
    }


def make_default_classification(variable: dict) -> dict:
    return {
        "code": variable["code"],
        "slug": variable["slug"],
        "desc": variable["desc"],
        "choropleth_default": True,
        "categories": [refactor_category(cat, variable) for cat in variable["categories"]]
    }


def refactor_category(category: dict, variable: dict) -> dict:
    string_replace_dict= {
    "{variable_name}": variable["name"][0].lower() + variable["name"][1:],
    "{category_name}": category["name"][0].lower() + category["name"][1:],
    "{category_unit}": variable["units"][0].lower() + variable["units"][1:],
    }
    category_h_pt2 = category["category_h_pt2"]
    category_h_pt3 = category["category_h_pt3"]
    for target, replacement in string_replace_dict.items():
        category_h_pt2 = category_h_pt2.replace(target, replacement)
        category_h_pt3 = category_h_pt3.replace(target, replacement)
    category_h_pt2_components = re.split("({location})", category_h_pt2)
    return {
        "name": category["name"],
        "slug": category["slug"],
        "code": category["code"],
        "legend_str_1": "".join(category_h_pt2_components[:2]).strip(),
        "legend_str_2": category_h_pt2_components[2].strip(),
        "legend_str_3": category_h_pt3.strip()
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