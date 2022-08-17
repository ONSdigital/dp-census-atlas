#!/usr/bin/env python

"""
Dump legend_strs from an atlas content.json file (supplied as arg) to csv, to make it easier to manually review / edit 
them for readability.
"""

import csv
import json
from pathlib import Path
import sys


def main():
    content_json_fn = Path(sys.argv[1])
    output_filename = content_json_fn.parent.joinpath(f"{content_json_fn.stem}-legend-strs.csv")
    if output_filename.exists():
        print(
            f"target file {output_filename} already exists! Will not overwrite to avoid loss of work. "
            f"If you need to start again, please delete {output_filename} first."
        )
        return

    with open(content_json_fn, "r") as f:
        content = json.load(f)
    
    csv_content = []
    for topic in content:
        for variable in topic["variables"]:
            for classification in variable["classifications"]:
                for category in classification["categories"]:
                    csv_content.append({
                        "ADMIN_topic": topic["name"],
                        "ADMIN_variable": variable["name"],
                        "ADMIN_classification": classification["code"],
                        "ADMIN_category": category["name"],
                        "ADMIN_legend_start_str": "{PERCENTAGE}%",
                        "EDIT_THIS_legend_str_1": category["legend_str_1"],
                        "EDIT_THIS_legend_str_2": category["legend_str_2"],
                        "EDIT_THIS_legend_str_3": category["legend_str_3"],
                    })
    
    with open(output_filename, "w") as f:
        writer = csv.DictWriter(f, fieldnames=csv_content[0].keys(), quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(csv_content)
                   

if __name__ == "__main__":
    main()