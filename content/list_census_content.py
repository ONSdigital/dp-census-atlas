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
    census_data_type = sys.argv[2] if len(sys.argv) > 2 else "categories"
    additional_output_fields = sys.argv[3].split(",") if len(sys.argv) > 3 else []

    with open(content_json_fp, "r") as f:
        content = json.load(f)

    csv_content = []
    # NB author is aware how horrible this nested if block is...
    for variable_group in content["content"]:

        if census_data_type == "variable_group":
                output = {
                    "variable_group_name": variable_group["name"]
                }
                output.update({k: variable_group[k] for k in additional_output_fields})
                csv_content.append(output)
                continue

        for variable in variable_group["variables"]:

            if census_data_type == "variable":
                output = {
                    "topic_group_name": variable_group["name"],
                    "variable_name": variable["name"],
                    "variable_mnemonic": variable["code"],
                }
                output.update({k: variable[k] for k in additional_output_fields})
                csv_content.append(output)
                continue

            for classification in variable["classifications"]:

                if census_data_type == "classification":
                    output = {
                        "topic_group_name": variable_group["name"],
                        "variable_mnemonic": variable["code"],
                        "dataset": classification["dataset"],
                        "classification_mnemonic": classification["code"],
                    }
                    output.update({k: classification[k] for k in additional_output_fields})
                    csv_content.append(output)
                    continue

                for category in classification["categories"]:
                    output = {
                        "topic_group_name": variable_group["name"],
                        "variable_mnemonic": variable["code"],
                        "classification_mnemonic": classification["code"],
                        "category": category["name"]
                    }
                    output.update({k: category[k] for k in additional_output_fields})
                    csv_content.append(output)

    output_filename = f"{content_json_fp.stem}-all-{census_data_type}-{datetime.today().strftime('%Y-%m-%d')}.csv"

    with open(output_filename, "w") as f:
        writer = csv.DictWriter(f, fieldnames=csv_content[0].keys(), quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(csv_content)


if __name__ == "__main__":
    main()