#!/usr/bin/env python

"""
Update variable descs from csv file.
"""

import csv
from datetime import datetime
from pathlib import Path
import sys

from scripts.census_objects import load_content, write_content, CensusVariableGroup


SHORT_DEFINITION_HEADER = "Atlas short description"


def variable_desc_spec_rows_from_csv(variable_desc_file: Path or str) -> list[dict]:
    with open(variable_desc_file, "r", encoding="ascii", errors="ignore") as f:
        reader = csv.DictReader(f)
        return list(reader)


def update_variable_descs(all_variable_groups: list[CensusVariableGroup], variable_desc_spec_rows: list[dict]) -> dict:
    for row in variable_desc_spec_rows:
        target_variable_found = False
        variable_code = row["variable_mnemonic"].strip()
        for variable_group in all_variable_groups:
            for variable in variable_group.variables:
                if variable.code == variable_code:
                    variable.desc = row[SHORT_DEFINITION_HEADER].strip()
                    target_variable_found = True
        if target_variable_found is False:
            print(f"New variable desc for {variable_code} could not be applied - variable not found.")
    return all_variable_groups


def update_variable_descs_from_file(all_variable_groups: list[CensusVariableGroup], variable_desc_file: Path or str) -> list[CensusVariableGroup]:
    variable_desc_spec_rows = variable_desc_spec_rows_from_csv(variable_desc_file)
    return update_variable_descs(all_variable_groups, variable_desc_spec_rows)


def main():
    content_json_fn = Path(sys.argv[1])
    variable_desc_file = Path(sys.argv[2])
    output_filename = Path(sys.argv[3])
    content = load_content(content_json_fn)
    variable_desc_spec_rows = variable_desc_spec_rows_from_csv(variable_desc_file)
    content["content"] = update_variable_descs(content["content"], variable_desc_spec_rows)

    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    content["meta"].update({
        "variable_descs_updated_at": now,
        "variable_desc_file": variable_desc_file.name,
    })

    write_content(content, output_filename)

if __name__ == "__main__":
    main()