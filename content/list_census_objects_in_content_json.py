#!/usr/bin/env python

"""
Crawl though content.json file (first CL arg) and output all <census data type> referenced in it as csv.
"""

import csv
from datetime import datetime
import json
from pathlib import Path
import sys


def main():
    content_json_fp = Path(sys.argv[1])
    census_data_type = sys.argv[2]
   
    with open(content_json_fp, "r") as f:
        content = json.load(f)

    csv_content = []
    for topic in content:

        if census_data_type == "topic":
            csv_content.append({
                "topic_name": topic["name"]
            })
            continue

        else:
            for variable in topic["variables"]:

                if census_data_type == "variable":
                    csv_content.append({
                        "topic_name": topic["name"],
                        "variable_name": variable["name"],
                        "variable_mnemonic": variable["code"]
                    })
                    continue

                else:
                    for classification in variable["classifications"]:
                        csv_content.append({
                            "topic": topic["name"],
                            "variable_mnemonic": variable["code"],
                            "classification_mnemonic": classification["code"],
                        })
    output_filename = f"{content_json_fp.stem}-all-{census_data_type}-{datetime.today().strftime('%Y-%m-%d')}.csv"
    with open(output_filename, "w") as f:
        writer = csv.DictWriter(f, fieldnames=csv_content[0].keys(), quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(csv_content)


if __name__ == "__main__":
    main()