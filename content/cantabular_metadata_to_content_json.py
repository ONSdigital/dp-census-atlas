#!/usr/bin/env python

"""
Create atlas content.json file containing ALL census objects defined in cantabular_metadata_dir, which is assumed
to be an unzipped cantabular metadata archive containing csv files. This script consumes four of these - assumed to be
found as: '<cantabular_metadata_dir>/Topic.csv', '<cantabular_metadata_dir>/Variable.csv',  
'<cantabular_metadata_dir>/Classification.csv'and '<cantabular_metadata_dir>/Category_Mapping.csv'.

Parse topics and their child variables, classifications and categories from these files, collates,
and output as <output_dir>/<lowest level of cantabular_metada_dir>-content.json, e.g. if 
cantabular_metadata_dir="path/to/my-cantabular-metadata-dir" and output_dir="content_jsons", the output will be written
to "content_jsons/my-cantabular-metadata-dir-content.json".
"""

import csv
from dataclasses import dataclass
import json
from pathlib import Path
import sys

from slugify import slugify

from census_objects import (CensusCategory, CensusClassification, CensusVariable, CensusTopic)

# ====================================================== CONFIG ====================================================== #


# csv file encoding. NB - might want to check this if you get weird characters in the metadata output
METADATA_FILE_ENCODING = "utf-8-sig'"


# ================================================ CLASS FACTORIES =================================================== #


def category_from_cantabular_csv_row(csv_row: dict) -> CensusCategory:
    """Make CensusCategory from row in Category_Mapping.csv"""
    return CensusCategory(
        # combine mapping label with source values to make code? ToDo - discuss this!
        name=csv_row["External_Mapping_Label_English"].strip(),
        code=f'{slugify(csv_row["External_Mapping_Label_English"].strip())}-{csv_row["Source_Value"].strip()}',
        slug=slugify(csv_row["External_Mapping_Label_English"].strip()),
        legend_str_1="",
        legend_str_2="",
        legend_str_3="",
        _classification_code=csv_row["Classification_Mnemonic"],
        _source_value=csv_row["Source_Value"],
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
        slug=slugify(csv_row["Variable_Mnemonic"].strip()),
        desc=csv_row["Variable_Description"].strip(),
        units=csv_row["Statistical_Unit"].strip(),
        classifications=[],
        # sometimes things don't have topics??
        _topic_code=csv_row["Topic_Mnemonic"] if csv_row["Topic_Mnemonic"] != "" else "NO_TOPIC"
    )


def topic_from_cantabular_csv_row(csv_row: dict) -> CensusTopic:
    """Make CensusTopic from row in Topic.csv"""
    return CensusTopic(
        name=csv_row["Topic_Title"].strip(),
        slug=slugify(csv_row["Topic_Mnemonic"].strip()),
        desc=csv_row["Topic_Description"].strip(),
        variables=[],
        _code=csv_row["Topic_Mnemonic"].strip(),
    )


# create blank topic to store things that don't seem to have a topic...
NO_TOPIC = CensusTopic(
    name="NO TOPIC",
    slug=slugify("NO TOPIC"),
    desc="Place to keep variables that have no topic.",
    variables=[],
    _code="NO_TOPIC",
)


# ======================================================= MAIN ======================================================= #


def main(cantabular_metadata_dir: Path, output_dir: Path):
    # load all census objects
    with open(cantabular_metadata_dir.joinpath("Category_Mapping.csv"), "r",  encoding=METADATA_FILE_ENCODING) as f:
        categories = [category_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f)]

    with open(cantabular_metadata_dir.joinpath("Classification.csv"), "r",  encoding=METADATA_FILE_ENCODING) as f:
        classifications = [classification_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f)]
    
    with open(cantabular_metadata_dir.joinpath("Variable.csv"), "r",  encoding=METADATA_FILE_ENCODING) as f:
        variables = [variable_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f)]

    with open(cantabular_metadata_dir.joinpath("Topic.csv"), "r",  encoding=METADATA_FILE_ENCODING) as f:
        topics = [topic_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f)]
    topics.append(NO_TOPIC)

    # filter out blanks (these happen when blank rows are in the csvs, etc)
    categories = list(filter(lambda x: x.name != "", categories))
    classifications = list(filter(lambda x: x.code != "", classifications))
    variables = list(filter(lambda x: x.name != "", variables))
    topics = list(filter(lambda x: x.name != "", topics))

    # gather children and append any missing info
    for c in classifications:
        c.gather_categories(categories)
    
    for v in variables:
        v.gather_classifications(classifications)
        v.make_legend_strings()
    
    for t in topics:
        t.gather_variables(variables)
    
    # sort topics and convert to jsonable
    content = [t.to_jsonable() for t in sorted(topics, key=lambda x: x.name)]
    output_filename = output_dir.joinpath(f"{cantabular_metadata_dir.name}-content.json")
    with open(output_filename, "w") as f:
        json.dump(content, f, indent=2)


if __name__ == "__main__":
    metadata_dir = Path(sys.argv[1])
    output_dir = Path("content_jsons")
    main(metadata_dir, output_dir)
