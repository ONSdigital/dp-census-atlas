#!/usr/bin/env python

"""
Update data download links from csv file.
"""

import csv
from datetime import datetime
from pathlib import Path
import sys

from scripts.census_objects import load_content, write_content, CensusVariableGroup


def classification_data_download_spec_rows_from_csv(classification_data_downloads_file: Path or str) -> list[dict]:
    with open(classification_data_downloads_file, "r", encoding="ascii", errors="ignore") as f:
        reader = csv.DictReader(f)
        return list(reader)


def update_classification_data_downloads(all_variable_groups: list[CensusVariableGroup], classification_data_downloads_spec_rows: list[dict]) -> dict:
    for row in classification_data_downloads_spec_rows:
        target_classification_found = False
        classification_code = row["classification_mnemonic"].strip()
        for variable_group in all_variable_groups:
            for variable in variable_group.variables:
                for classification in variable.classifications:
                    if classification.code == classification_code:
                        data_download = row["data_download"].strip()
                        if data_download != "":
                            classification.data_download = data_download
                        target_classification_found = True
        if target_classification_found is False:
            print(f"New data data_downloads for {classification_code} could not be applied - classification not found.")
    return all_variable_groups


def update_classification_data_downloads_from_file(all_variable_groups: list[CensusVariableGroup], classification_downloads_file: Path or str) -> list[CensusVariableGroup]:
    classification_download_spec_rows = classification_data_download_spec_rows_from_csv(classification_downloads_file)
    return update_classification_data_downloads(all_variable_groups, classification_download_spec_rows)


def main():
    content_json_fn = Path(sys.argv[1])
    variable_data_downloads_file = Path(sys.argv[2])
    output_filename = Path(sys.argv[3])
    content = load_content(content_json_fn)
    variable_data_downloads_spec_rows = classification_data_download_spec_rows_from_csv(variable_data_downloads_file)
    content["content"] = update_classification_data_downloads(content["content"], variable_data_downloads_spec_rows)

    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    content["meta"].update({
        "variable_data_downloads_updated_at": now,
        "variable_data_downloads_file": variable_data_downloads_file.name,
    })

    write_content(content, output_filename)

if __name__ == "__main__":
    main()