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
from datetime import datetime
import json
from pathlib import Path
import sys

from slugify import slugify

from census_objects import (
    CensusCategory,
    CensusClassification,
    CensusVariable,
    CensusTopic,
    CensusTopicGroup
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
        _topic_code=csv_row["Topic_Mnemonic"] if csv_row["Topic_Mnemonic"] != "" else "NO_TOPIC"
    )


def topic_from_cantabular_csv_row(csv_row: dict) -> CensusTopic:
    """Make CensusTopic from row in Topic.csv"""
    return CensusTopic(
        name=csv_row["Topic_Title"].strip(),
        slug=slugify(csv_row["Topic_Title"].strip()),
        desc=csv_row["Topic_Description"].strip(),
        variables=[],
        _code=csv_row["Topic_Mnemonic"].strip(),
    )


def topic_groups_from_dict(raw_tg: dict) -> CensusTopic:
    """Make CensusTopic from row in Topic.csv"""
    return CensusTopicGroup(
        name=raw_tg["name"].strip(),
        slug=raw_tg["slug"],
        desc=raw_tg["desc"],
        topics=[],
        _topic_names=raw_tg["topic_names"],
    )


# create blank topic to store things that don't seem to have a topic...
NO_TOPIC = CensusTopic(
    name="NO TOPIC",
    slug=slugify("NO TOPIC"),
    desc="Place to keep variables that have no topic.",
    variables=[],
    _code="NO_TOPIC",
)


def main(cantabular_metadata_dir: Path, output_dir: Path):
    # load all census objects, ignoring non-ACSII characters
    with open(topic_groupings_json_fn, "r") as f:
        topic_groups = [topic_groups_from_dict(tg_raw) for tg_raw in json.load(f)]

    with open(cantabular_metadata_dir.joinpath("Category.csv"), "r", encoding="ascii", errors="ignore") as f:
        # nb filter out 'minus' categories (generally 'Does Not Apply' or similar) and non-numeric strings
        categories = [category_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f) if csv_row["Category_Code"].isnumeric()]

    with open(cantabular_metadata_dir.joinpath("Classification.csv"), "r", encoding="ascii", errors="ignore") as f:
        classifications = [classification_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f)]

    with open(cantabular_metadata_dir.joinpath("Variable.csv"), "r", encoding="ascii", errors="ignore") as f:
        variables = [variable_from_cantabular_csv_row(csv_row) for csv_row in csv.DictReader(f)]

    with open(cantabular_metadata_dir.joinpath("Topic.csv"), "r", encoding="ascii", errors="ignore") as f:
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

    for tg in topic_groups:
        tg.gather_topics(topics)

    # sort topics and convert to jsonable
    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    meta = {
        "first_created_at": now,
        "cantabular_metadata_source": cantabular_metadata_dir.name
    }
    content = [tg.to_jsonable() for tg in topic_groups]
    output = {
        "meta": meta,
        "content": content
    }
    output_filename = output_dir.joinpath(f"all-cantabular-content-{now}.json")
    with open(output_filename, "w") as f:
        json.dump(output, f, indent=2)


if __name__ == "__main__":
    metadata_dir = Path(sys.argv[1])
    topic_groupings_json_fn = Path(sys.argv[2])
    output_dir = Path("content_jsons")
    main(metadata_dir, output_dir)
