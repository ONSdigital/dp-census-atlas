#!/usr/bin/env python

"""
Update variable descs from csv file.
"""

import csv
from datetime import datetime
from pathlib import Path
import sys

from census_objects import load_content, write_content


def main():
    content_json_fn = Path(sys.argv[1])
    variable_desc_file_fn = Path(sys.argv[2])

    content = load_content(content_json_fn)

    with open(variable_desc_file_fn, "r") as f:
        reader = csv.DictReader(f)
        content_to_upsert = list(reader)

    for row in content_to_upsert:
        classification_code = row["classification_mnemonic"].split("(")[0].strip()
        for variable_group in content["content"]:
            for variable in variable_group.variables:
                if any(c.code == classification_code for c in variable.classifications):
                    new_desc = row["New version from content design"]
                    if new_desc not in ("N/A", ""):
                        variable.desc = new_desc

    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    content["meta"].update({
        "variable_descs_updated_at": now,
        "variable_desc_file_used": variable_desc_file_fn.name,
    })
    output_filename = content_json_fn.parent.joinpath(f"all-atlas-content-{now}.json")
    write_content(content, output_filename)

if __name__ == "__main__":
    main()