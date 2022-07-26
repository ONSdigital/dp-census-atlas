#!/usr/bin/env python

"""
Take manually reviewed / edited legend_strs from a csv file produced by content_json_legend_strs_to_csv.py and use them
to update values in an atlas content.json.
"""

import csv
import json
import sys


def main():
    content_json = sys.argv[1]
    legend_str_file = sys.argv[2]

    with open(content_json, "r") as f:
        content = json.load(f)
    
    with open(legend_str_file, "r") as f:
        reader = csv.DictReader(f)
        content_to_upsert = list(reader)

    for row in content_to_upsert:
        topic = next(t for t in content if t["name"] == row["ADMIN_topic"])
        variable = next(v for v in topic["variables"] if v["name"] == row["ADMIN_variable"])
        classification = next(c for c in variable["classifications"] if c["code"] == row["ADMIN_classification"])
        category = next(c for c in classification["categories"] if  c["name"] == row["ADMIN_category"])
        category["legend_str_1"] = row["EDIT_THIS_legend_str_1"]
        category["legend_str_2"] = row["EDIT_THIS_legend_str_2"]
    
    with open(content_json, "w") as f:
        json.dump(content, f, indent=2)
                   

if __name__ == "__main__":
    main()