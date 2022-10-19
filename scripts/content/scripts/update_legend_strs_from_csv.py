#!/usr/bin/env python

"""
Take manually reviewed / edited legend_strs from a csv file produced by legend_strs_to_csv.py and use them
to update values in an atlas content.json.
"""

import csv
from datetime import datetime
from pathlib import Path
import sys

from scripts.census_objects import load_content, write_content, CensusVariableGroup


def legend_strs_spec_rows_from_csv(legend_str_file: Path or str) -> list[dict]:
    with open(legend_str_file, "r", encoding="ascii", errors="ignore") as f:
        reader = csv.DictReader(f)
        return list(reader)


def update_legend_strs(all_variable_groups: list[CensusVariableGroup], legend_strs_spec_rows: list[dict]) -> list[CensusVariableGroup]:
    for row in legend_strs_spec_rows:
        variable_group = next(vg for vg in all_variable_groups if vg.name == row["ADMIN_variable_group"])
        try:
            variable = next(v for v in variable_group.variables if v.name == row["ADMIN_variable"])
        except:
            breakpoint()
        classification = next(c for c in variable.classifications if c.code == row["ADMIN_classification"])
        category = next(c for c in classification.categories if  c.code == row["ADMIN_category_code"])
        category.legend_str_1 = row["EDIT_THIS_legend_str_1"]
        category.legend_str_2 = row["EDIT_THIS_legend_str_2"]
        category.legend_str_3 = row["EDIT_THIS_legend_str_3"]
    return all_variable_groups


def update_legend_strs_from_file(all_variable_groups: list[CensusVariableGroup], legend_str_file: Path or str) -> list[CensusVariableGroup]:
    legend_strs_spec_rows = legend_strs_spec_rows_from_csv(legend_str_file)
    return update_legend_strs(all_variable_groups, legend_strs_spec_rows)


def main():
    content_json_fn = Path(sys.argv[1])
    legend_str_file = Path(sys.argv[2])
    output_filename = Path(sys.argv[3])
    content = load_content(content_json_fn)
    content["content"] = update_legend_strs_from_file(content["content"], legend_str_file)

    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    content["meta"].update({
        "legend_strs_updated_at": now,
        "legend_strs_file": legend_str_file.name,
    })

    write_content(content, output_filename)

if __name__ == "__main__":
    main()