#!/usr/bin/env python

"""
Take manually reviewed / edited legend_strs from a csv file produced by legend_strs_to_csv.py and use them
to update values in an atlas content.json.
"""

import csv
from datetime import datetime
from pathlib import Path
import sys

from census_objects import load_content, write_content


def main():
    content_json_fn = Path(sys.argv[1])
    legend_str_file_fn = Path(sys.argv[2])

   
    content =load_content(content_json_fn)

    with open(legend_str_file_fn, "r") as f:
        reader = csv.DictReader(f)
        content_to_upsert = list(reader)

    for row in content_to_upsert:
        variable_group = next(vg for vg in content["content"] if vg.name == row["ADMIN_variable_group"])
        variable = next(v for v in variable_group.variables if v.name == row["ADMIN_variable"])
        classification = next(c for c in variable.classifications if c.code == row["ADMIN_classification"])
        category = next(c for c in classification.categories if  c.code == row["ADMIN_category_code"])
        category.legend_str_1 = row["EDIT_THIS_legend_str_1"]
        category.legend_str_2 = row["EDIT_THIS_legend_str_2"]
        category.legend_str_3 = row["EDIT_THIS_legend_str_3"]

    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    content["meta"].update({
        "legend_strs_updated_at": now,
        "legend_strs_file_used": legend_str_file_fn.name,
    })
    output_filename = content_json_fn.parent.joinpath(f"all-atlas-content-{now}.json")
    write_content(content, output_filename)

if __name__ == "__main__":
    main()