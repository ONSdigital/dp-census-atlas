#!/usr/bin/env python

"""
Filter content.json to only those classifications referenced in the
"""

import csv
from datetime import datetime
from pathlib import Path
import sys

from scripts.census_objects import (
    load_content,
    write_content,
    CensusVariable,
    CensusVariableGroup,
)


def atlas_spec_from_csv(atlas_spec_file:  Path or str) -> list[dict]:
    with open(atlas_spec_file, "r") as f:
        raw_spec_rows = list(csv.DictReader(f))

    atlas_spec = {
        "atlas_classifications": [],
        "choropleth_defaults": [],
        "dot_density_defaults": [],
        "comparison_2011": [],
    }

    for sr_raw in raw_spec_rows:

        # only process data rows for the atlas
        if sr_raw["2021 data Required for Census Atlas?"].strip().lower() == "y":

            # gather all classifications referenced
            dataset_classification = sr_raw["classification_mnemonic"].split("(")[0].strip()
            additional_atlas_classifications = [
                c.strip() for c in sr_raw["Census Atlas derived classification"].split(",") if c.strip() != ""
            ]
            all_classifications_for_row = [dataset_classification] + additional_atlas_classifications
            atlas_spec["atlas_classifications"].extend(all_classifications_for_row)

            # gather rendering flags
            atlas_spec["choropleth_defaults"].append(sr_raw["Census Atlas choropleth default classification"])
            atlas_spec["dot_density_defaults"].append(sr_raw["Census Atlas dot density default classification"])

            # NB - assume if we say 'yes' to 2011 data then it will be available for all requested classifications?
            # ToDo - check this assumption against reality!
            if sr_raw["2011 data Required for Census Atlas?(If available)"].lower() == "y":
                atlas_spec["comparison_2011"].append(all_classifications_for_row)

    return atlas_spec


def clone_census_object(census_obj, **kwargs):
    """
    Return copy of census_obj with identical data EXCEPT whatever overrides are specified as kwargs
    """
    census_obj_props = {**vars(census_obj)}
    census_obj_props.update(kwargs)
    census_obj_class = type(census_obj)
    return census_obj_class(**census_obj_props)


def filter_variable_groups_to_atlas_spec(all_variable_groups: list[CensusVariableGroup], atlas_spec: dict) -> list[CensusVariableGroup]:
    """
    Filter topics, variables and classifications to fit the classifications specified in spec_rows
    """
    filtered_variable_groups = []

    for vg in all_variable_groups:

        # clone variable group with no variables
        filtered_vg = clone_census_object(vg, variables=[])

        for v in vg.variables:

            # clone variable with no classifications
            filtered_v = clone_census_object(v, classifications=[])

            # add filtered classifications
            filtered_v.classifications = [c for c in v.classifications if c.code in atlas_spec["atlas_classifications"]]
            
            # set classification visualisation flags
            for c in filtered_v.classifications:
                if c.code in atlas_spec["choropleth_defaults"]:
                    c.choropleth_default = True
                if c.code in atlas_spec["dot_density_defaults"]:
                    c.dot_density_default = True
                if c.code in atlas_spec["comparison_2011"]:
                    c.comparison_2011_data_available = True

            # if variable has any classifications, add it to the filtered variable group
            if len(filtered_v.classifications) > 0:
                filtered_vg.variables.append(filtered_v)

        # if variable group has any variables, add it to the filtered content
        if len(filtered_vg.variables) > 0:
            filtered_variable_groups.append(filtered_vg)

    return filtered_variable_groups


def filter_content_to_atlas_spec_from_file(all_variable_groups: list[CensusVariableGroup], atlas_spec_file: Path or str) -> list[CensusVariableGroup]:
    atlas_spec = atlas_spec_from_csv(atlas_spec_file)
    return filter_variable_groups_to_atlas_spec(all_variable_groups, atlas_spec)


def main():
    content_json_fn = Path(sys.argv[1])
    atlas_spec_file = Path(sys.argv[2])
    output_filename = sys.argv[3]

    content = load_content(content_json_fn)
    atlas_spec = atlas_spec_from_csv(atlas_spec_file)
    content["content"] = filter_content_to_atlas_spec_from_file(content["content"], atlas_spec)

    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    content["meta"].update({
        "filtered_to_atlas_content_at": now,
        "rich_content_spec_file_used_to_filter": atlas_spec_file.name,
    })
    output_path = content_json_fn.parent.joinpath(output_filename)
    write_content(content, output_path)

if __name__ == "__main__":
    main()