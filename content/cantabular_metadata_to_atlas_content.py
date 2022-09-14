#!/usr/bin/env python

"""
Create atlas content.json file containing census objects defined in metadata_dir (assumed to be an unzipped cantabular
metadata archive containing csv files), with the census topics re-packaged as atlas-specific variable groups (defined in
the variable_groups_json_fn, assumed to be a JSON file specifying the atlas variable groups), and then filtered to the
list of variables specified in the rich_content_spec_fn (assumed to be exported from the confluence Rich Content Product
Specifications table, here: https://confluence.ons.gov.uk/display/ODADH/Rich+content+product+specifications).

This script consumes three files from the cantabular metata directory - assumed to be found as:
    - <cantabular_metadata_dir>/Variable.csv,
    - <cantabular_metadata_dir>/Classification.csv
    - <cantabular_metadata_dir>/Category.csv

Output will be written to <output_dir>/all-atlas-content-<datetime of writing>.json
"""

import csv
from dataclasses import dataclass
from datetime import datetime
import json
from pathlib import Path
import sys

from slugify import slugify

from census_objects import (
    CensusCategory,
    CensusClassification,
    CensusVariable,
    CensusVariableGroup,
    RichContentSpecRow
)


def spec_row_from_csv_row(csv_row: dict) -> RichContentSpecRow:
    """Make RichContentSpecRow from row in rich content spec csv file."""
    return RichContentSpecRow(
        dataset=csv_row["dataset_mnemonic"],
        dataset_classification=csv_row["classification_mnemonic"].split("(")[0].strip(),
        additional_atlas_classifications=[
            c.strip() for c in csv_row["Census Atlas derived classification"].split(",") if c.strip() != ""
        ],
        choropleth_default_classification=csv_row["Census Atlas choropleth default classification"],
        dot_density_default_classification=csv_row["Census Atlas dot density default classification"],
        comparison_2011=csv_row["2011 data Required for Census Atlas?(If available)"].lower() == "y",
    )


def category_from_cantabular_csv_row(csv_row: dict) -> CensusCategory:
    """Make CensusCategory from row in Category.csv"""
    cat_code = str(csv_row["Category_Code"]).zfill(3)
    return CensusCategory(
        name=csv_row["External_Category_Label_English"].strip(),
        code=f'{csv_row["Classification_Mnemonic"]}-{cat_code}',
        slug=slugify(csv_row["External_Category_Label_English"].strip()),
        legend_str_1="",
        legend_str_2="",
        legend_str_3="",
        _classification_code=csv_row["Classification_Mnemonic"],
        _category_code=csv_row["Category_Code"],
    )


def classification_from_cantabular_csv_row(csv_row: dict) -> CensusClassification:
    """Make CensusClassification from row in Classification.csv"""
    return CensusClassification(
        code=csv_row["Classification_Mnemonic"].strip(),
        slug=slugify(csv_row["Classification_Mnemonic"].strip()),
        desc=csv_row["External_Classification_Label_English"].strip(),
        choropleth_default=False,
        dot_density_default=False,
        categories=[],
        _variable_code=csv_row["Variable_Mnemonic"],
    )

def variable_from_cantabular_csv_row(csv_row: dict) -> CensusVariable:
    """Make CensusVariable from row in Variable.csv"""
    return CensusVariable(
        name=csv_row["Variable_Title"].strip(),
        code=csv_row["Variable_Mnemonic"].strip(),
        slug=slugify(csv_row["Variable_Title"].strip()),
        desc=csv_row["Variable_Description"].strip(),
        units=csv_row["Statistical_Unit"].strip(),
        classifications=[],
        # sometimes things don't have topics??
        topic_code=csv_row["Topic_Mnemonic"] if csv_row["Topic_Mnemonic"] != "" else "NO_TOPIC"
    )


def variable_group_from_dict(raw_tg: dict) -> CensusVariableGroup:
    """Make CensusVariableGroup from row in Topic.csv"""
    return CensusVariableGroup(
        name=raw_tg["name"].strip(),
        slug=raw_tg["slug"],
        desc=raw_tg["desc"],
        variables=[],
        _topic_codes=raw_tg["topic_codes"],
    )


def filter_content(spec_rows: list[RichContentSpecRow], all_variable_groups: list[CensusVariableGroup]) -> list[CensusVariableGroup]:
    """
    Filter topics, variables and classifications to fit the classifications specified in spec_rows
    """
    filtered_content = []
    for vg in all_variable_groups:

        filtered_vg = CensusVariableGroup(
            name=vg.name,
            slug=vg.slug,
            desc=vg.desc,
            variables=[],
            _topic_codes=[],
        )

        for sr in spec_rows:

            # extract classification codes from spec row NB ensure no duplication here
            required_cls_codes = [sr.dataset_classification]
            required_cls_codes.extend(sr.additional_atlas_classifications)

            # NB use list of dict keys here rather than set to preserve category order
            # see https://stackoverflow.com/questions/1653970/does-python-have-an-ordered-set
            required_cls_codes = list(dict.fromkeys(required_cls_codes))

            # get variable and classifications for those codes
            matched_variable = next(
                (v for v in vg.variables if required_cls_codes[0] in [c.code for c in v.classifications]),
                None
            )

            # if we get no variable match, assume this spec row refers to a variable from a different topic grouping
            if matched_variable is None:
                continue

            matched_classifications = [c for c in matched_variable.classifications if c.code in required_cls_codes]

            # set classification visualisation flags
            for c in matched_classifications:
                if c.code == sr.choropleth_default_classification:
                    c.choropleth_default = True
                if c.code == sr.dot_density_default_classification:
                    c.dot_density_default = True
                if sr.comparison_2011 is True:
                    c.comparison_2011_data_available = True

            # variables can be referenced in multiple rows, so will need to check for already processed variables here.
            # if variable is not already appended to filtered_ag, add the matched classifications to it
            processed_variable = next((v for v in filtered_vg.variables if v.code == matched_variable.code), None)
            if processed_variable is not None:
                processed_variable.classifications.extend(matched_classifications)

            # otherwise add shallow copy of matched variable with only the classifications needed
            else:
                filtered_vg.variables.append(
                    CensusVariable(
                        name=matched_variable.name,
                        code=matched_variable.code,
                        slug=matched_variable.slug,
                        desc=matched_variable.desc,
                        units=matched_variable.units,
                        topic_code=matched_variable.topic_code,
                        classifications=matched_classifications,
                    )
                )

        if len(filtered_vg.variables) > 0:
            filtered_content.append(filtered_vg)

    return filtered_content


def main(cantabular_metadata_dir: Path, output_dir: Path):
    # load all census objects, ignoring non-ACSII characters

    with open(cantabular_metadata_dir.joinpath("Category.csv"), "r", encoding="ascii", errors="ignore") as f:
        # nb filter out 'minus' categories (generally 'Does Not Apply' or similar) and non-numeric strings
        categories = [category_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f) if csv_row["Category_Code"].isnumeric()]

    with open(cantabular_metadata_dir.joinpath("Classification.csv"), "r", encoding="ascii", errors="ignore") as f:
        classifications = [classification_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f)]

    with open(cantabular_metadata_dir.joinpath("Variable.csv"), "r", encoding="ascii", errors="ignore") as f:
        variables = [variable_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f)]

    with open(variable_groups_json_fn, "r") as f:
        variable_groups = [variable_group_from_dict(tg_raw) for tg_raw in json.load(f)]

    with open(rich_content_spec_fn, "r") as f:
        # nb filter out rows that do not apply to the atlas
        spec_rows = [
            spec_row_from_csv_row(sr_raw) for sr_raw in csv.DictReader(f)
            if sr_raw["2021 data Required for Census Atlas?"].strip().lower() == "y"
        ]

    # filter out blanks (these happen when blank rows are in the csvs, etc)
    categories = list(filter(lambda x: x.name != "", categories))
    classifications = list(filter(lambda x: x.code != "", classifications))
    variables = list(filter(lambda x: x.name != "", variables))
    variable_groups = list(filter(lambda x: x.name != "", variable_groups))

    # gather children and append any missing info
    for c in classifications:
        c.gather_categories(categories)

    for v in variables:
        v.gather_classifications(classifications)
        v.make_legend_strings()

    for vg in variable_groups:
        vg.gather_variables(variables)

    # filter to atlas content as defined in the rich content spec sheet
    filtered_content = filter_content(spec_rows, variable_groups)

    # sort topics and convert to jsonable
    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    meta = {
        "created_at": now,
        "cantabular_metadata_source": cantabular_metadata_dir.name,
        "rich_content_spec_file_used_to_filter": rich_content_spec_fn.name,
        "release": "TESTDEV this file has all atlas variables, not intended for release as-is."
    }
    json_ready_content = [vg.to_jsonable() for vg in sorted(filtered_content, key=lambda x: x.name)]

    # write
    output = {
        "meta": meta,
        "content": json_ready_content
    }
    output_filename = output_dir.joinpath(f"all-atlas-content-{now}.json")
    with open(output_filename, "w") as f:
        json.dump(output, f, indent=2)


if __name__ == "__main__":
    metadata_dir = Path(sys.argv[1])
    variable_groups_json_fn = Path(sys.argv[2])
    rich_content_spec_fn = Path(sys.argv[3])
    output_dir = Path("content_jsons")
    main(metadata_dir, output_dir)
