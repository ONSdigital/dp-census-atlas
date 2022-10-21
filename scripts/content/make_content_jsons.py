#!/usr/bin/env python

"""
Make content.json(s) according to spec json file (arg 1).

Spec json file assumed to be in this format:
{
    "cantabular_metadata_dir": "path to unzipped cantabular metadata archive from https://confluence.ons.gov.uk/pages/viewpage.action?spaceKey=ODADH&title=Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc goes here",
    "variable_groups_spec_file": "this file is checked in, so shouldn't need to change: Atlas_Variable_Groups.json",
    "rich_content_spec_file": "this file is checked in, so shouldn't need to change: Rich_content_product_specifications.csv",
    "category_legend_strs_file": "this file is checked in, so shouldn't need to change: atlas-legend-strs-2022-09-14.csv",
    "variable_descriptions_file": "this file is checked in, so shouldn't need to change:  atlas_variables_short_descriptions.csv",
    "version": "label for this iteration of content should go here (will be included in metadata for all produced files)"
}

This script outputs several content json files to content/output_content_jsons/<"version" from spec json file>/. One
json will be produced for each census topic, plus an additional one with ALL topics included.

e.g. if spec json "version" is 'My-Test', and there are three topics in the ouput (T1, T2, T3), you will get the
following output:
content/
    output_content_jsons/
        My-Test/
            My-Test-ALL.json
            My-Test-T1.json
            My-Test-T2.json
            My-Test-T3.json
"""

import csv
from dataclasses import dataclass
from datetime import datetime
import json
from os import makedirs
from pathlib import Path
import sys

from slugify import slugify

from scripts.census_objects import (
    CensusCategory,
    CensusClassification,
    CensusVariable,
    CensusVariableGroup,
    write_content,
    variable_from_content_json
)
from scripts.filter_content_to_atlas_spec import filter_content_to_atlas_spec_from_file
from scripts.split_content_by_topic import split_content_by_topic
from scripts.update_legend_strs_from_csv import update_legend_strs_from_file
from scripts.update_variable_desc_from_csv import update_variable_descs_from_file
from scripts.validate_content import validate_variable_groups


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
        available_geotypes=[],
        choropleth_default=False,
        dot_density_default=False,
        dataset = "",
        categories=[],
        _variable_code=csv_row["Variable_Mnemonic"],
    )


def variable_from_cantabular_csv_row(csv_row: dict, variable_topic_overrides) -> CensusVariable:
    """Make CensusVariable from row in Variable.csv"""
    variable = CensusVariable(
        name=csv_row["Variable_Title"].strip(),
        code=csv_row["Variable_Mnemonic"].strip(),
        slug=slugify(csv_row["Variable_Title"].strip()),
        desc=csv_row["Variable_Description"].strip(),
        long_desc=csv_row["Variable_Description"].strip(),
        units=csv_row["Statistical_Unit"].strip(),
        # sometimes things don't have topics??
        topic_code=csv_row["Topic_Mnemonic"] if csv_row["Topic_Mnemonic"] != "" else "NO_TOPIC",
        classifications=[],
    )
    if variable.code in variable_topic_overrides:
        variable.topic_code = variable_topic_overrides[variable.code]
    return variable


def variable_group_from_dict(raw_tg: dict) -> CensusVariableGroup:
    """Make CensusVariableGroup from object in variable group definition json"""
    return CensusVariableGroup(
        name=raw_tg["name"].strip(),
        slug=raw_tg["slug"],
        desc=raw_tg["desc"],
        variables=[],
        _topic_codes=raw_tg["topic_codes"],
    )


def datasets_classifications_from_cantabular(dataset_variable_csv_file: str) -> dict:
    with open(dataset_variable_csv_file, "r") as f:
        raw_dvs =  list(csv.DictReader(f))
    return {raw_dv["Classification_Mnemonic"]: raw_dv["Dataset_Mnemonic"] for raw_dv in raw_dvs}


def input_full_path(input_partial_path: str) -> Path:
    return Path("input_metadata_files").joinpath(input_partial_path)


def available_geotypes_for_classifications_from_file(available_geotypes_for_variables_file: str) -> dict:
    with open(available_geotypes_for_variables_file, "r", encoding="ascii", errors="ignore") as f:
        all_raw_avgs = list(csv.DictReader(f))
    avgs = {}
    for raw_avg in all_raw_avgs:
        classification = raw_avg["classification_mnemonic"]
        avgs[classification] = raw_avg["available_geotypes"].split(",")
    return avgs


def variable_groups_from_metadata(
    cantabular_metadata_dir: Path,
    variable_groups_spec_file: str,
    variable_topic_overrides: dict
) -> list[CensusVariableGroup]:
    # load all census objects, ignoring non-ACSII characters
    with open(cantabular_metadata_dir.joinpath("Category.csv"), "r", encoding="ascii", errors="ignore") as f:
        # nb filter out 'minus' categories (generally 'Does Not Apply' or similar) and non-numeric strings
        categories = [
            category_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f)
            if csv_row["Category_Code"].isnumeric()
        ]

    with open(cantabular_metadata_dir.joinpath("Classification.csv"), "r", encoding="ascii", errors="ignore") as f:
        classifications = [classification_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f)]

    with open(cantabular_metadata_dir.joinpath("Variable.csv"), "r", encoding="ascii", errors="ignore") as f:
        variables = [variable_from_cantabular_csv_row(csv_row, variable_topic_overrides) for csv_row in csv.DictReader(f)]

    with open(variable_groups_spec_file, "r") as f:
        variable_groups = [variable_group_from_dict(tg_raw) for tg_raw in json.load(f)]

    datasets = datasets_classifications_from_cantabular(cantabular_metadata_dir.joinpath("Dataset_Variable.csv"))

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
        v.gather_ts_datasets(datasets)

    for vg in variable_groups:
        vg.gather_variables(variables)

    return sorted(variable_groups, key=lambda vg: vg.name)


def main(spec_fn: str):
    with open(spec_fn, "r") as f:
        spec = json.load(f)
    # init content iterations container
    content_iterations = {}

    # get raw content from metadata
    print(f"Loading cantabular metadata from {spec['cantabular_metadata_dir']}...")
    content_iterations["ALL"] = variable_groups_from_metadata(
        input_full_path(spec["cantabular_metadata_dir"]),
        input_full_path(spec["variable_groups_spec_file"]),
        spec["variable_topic_overrides"]
    )
    print("... done.")

    # filter to atlas content
    print(f"Filtering atlas content to spec from {spec['rich_content_spec_file']}...")
    content_iterations["ALL"] = filter_content_to_atlas_spec_from_file(
        content_iterations["ALL"],
        input_full_path(spec["rich_content_spec_file"])
    )
    print("... done.")

    # remove any dropped categories
    print(f"Removing dropped categories...")
    for vg in content_iterations["ALL"]:
        for v in vg.variables:
            for c in v.classifications:
                if c.code in spec["classification_dropped_categories"]:
                    all_cats_to_drop = spec["classification_dropped_categories"][c.code]
                    for cat_to_drop in all_cats_to_drop:
                        print(f"Removing {vg.name}.{v.code}.{c.code}.{cat_to_drop}.")
                    c.categories = list(filter(lambda c: c.code not in all_cats_to_drop, c.categories))
    print("... done.")

    # # update legend strings
    print(f"Inserting new legend strings from {spec['category_legend_strs_file']}...")
    content_iterations["ALL"] = update_legend_strs_from_file(
        content_iterations["ALL"],
        input_full_path(spec["category_legend_strs_file"])
    )
    print("... done.")

    # update variable descriptions
    print(f"Inserting new variable descriptions from {spec['variable_descriptions_file']}...")
    content_iterations["ALL"] = update_variable_descs_from_file(
        content_iterations["ALL"],
        input_full_path(spec["variable_descriptions_file"])
    )
    print("... done.")

    # append available geotypes for classifications
    print(f"Inserting available geotypes for classifications from {spec['classification_geotype_availability_file']}")
    available_geotypes_for_classifications = available_geotypes_for_classifications_from_file(
        input_full_path(spec["classification_geotype_availability_file"])
    )
    for vg in content_iterations["ALL"]:
        for v in vg.variables:
            v.set_available_geotypes(available_geotypes_for_classifications)
    print("... done.")

    # insert any extra variables
    print("Inserting extra variables...")
    for vg in content_iterations["ALL"]:
        if vg.name in spec["extra_variables"]:
            for ev in spec["extra_variables"][vg.name]:
                print(f'Inserting {ev["variable"]["name"]} before {vg.name}.{ev["insert_before"]}')
                insert_index = next(i for i,v in enumerate(vg.variables) if v.code == ev["insert_before"])
                vg.variables.insert(insert_index, variable_from_content_json(ev["variable"]))
    print("... done.")

    # make topic splits
    print("Splitting content by topic...")
    content_iterations.update(split_content_by_topic(content_iterations["ALL"]))
    print("... done.")

    # validate
    is_valid = True
    for content_iteration_name, content_iteration in content_iterations.items():
        print(f"Validating {content_iteration_name}...")
        if not validate_variable_groups(content_iteration):
            is_valid = False
    if is_valid:
        print("... all content passes validity check.")
    else:
        print("... content has validity issues, see above! Check input files. EXITING!")
        exit()

    # set meta
    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    meta = {
        "created_at": now,
        "spec_file": spec_fn,
    }

    # output
    output_dir = Path("output_content_jsons").joinpath(spec["version"])
    makedirs(output_dir, exist_ok=True)
    print(f"Writing content jsons to {output_dir}...")
    for content_iteration_name, content_iteration in content_iterations.items():
        release_name = f"{spec['version']}-{content_iteration_name}"
        meta["release"] = f"{spec['version']}-{content_iteration_name}"
        output_filename = output_dir.joinpath(f"{release_name}.json")
        write_content({"meta": meta, "content": content_iteration}, output_filename)
    print("... done.")


if __name__ == "__main__":
    spec_fn = sys.argv[1]
    main(spec_fn)
