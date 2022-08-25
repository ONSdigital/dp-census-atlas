#!/usr/bin/env python

"""
Filter content.json file with all variables + classifications (first CL arg) to only those referenced in rich content
spec csv file (second CL arg)

Output will be written to <path to input content.json>/<name of input content.json>-atlas-content-<todays date>.json.
"""

import csv
from dataclasses import dataclass
from datetime import datetime
import json
from pathlib import Path
import sys

from census_objects import (
    CensusVariable,
    CensusTopic,
    CensusRelease,
    topic_from_content_json
)


# csv file encoding. NB - might want to check this if you get weird characters in the metadata output
METADATA_FILE_ENCODING = "utf-8-sig'"


@dataclass
class RichContentSpecRow:
    """All needed config values from a row from the rich content spec csv file."""
    dataset: str
    dataset_classification: str
    additional_atlas_classifications: list[str]
    choropleth_default_classification: str
    dot_density_default_classification: str
    comparison_2011: bool

    def to_str(self):
        """Simple string representation for error logging"""
        return f"topic: {self.dataset}, variable: {self.variable}"


def load_spec_rows_from_csv(csv_fn: Path) -> list[RichContentSpecRow]:
    """
    load_spec_rows_from_csv to list of RichContentSpecRow. NB only rows with 'Y' in the
    '2021 data Required for Census Atlas?` column will be processed.
    """
    output = []
    with open(csv_fn, "r", encoding=METADATA_FILE_ENCODING) as f:
        for raw_row in csv.DictReader(f):
            if raw_row["2021 data Required for Census Atlas?"].strip().lower() == "y":
                output.append(RichContentSpecRow(
                    dataset=raw_row["dataset_mnemonic"],
                    dataset_classification=raw_row["classification_mnemonic"].split("(")[0].strip(),
                    additional_atlas_classifications=[
                        c.strip() for c in raw_row["Census Atlas derived classification"].split(",") if c.strip() != ""
                    ],
                    choropleth_default_classification=raw_row["Census Atlas choropleth default classification"],
                    dot_density_default_classification=raw_row["Census Atlas dot density default classification"],
                    comparison_2011=raw_row["2011 data Required for Census Atlas?(If available)"].lower() == "y",
                ))
    return output


def load_content(content_file: Path) -> list[CensusTopic]:
    """Load all census objects defined in content_file."""
    with open(content_file, "r") as f:
        raw_topics = json.load(f)
    return [topic_from_content_json(t) for t in raw_topics]


def filter_content(spec_rows: list[RichContentSpecRow], all_topics: list[CensusTopic]) -> list[CensusTopic]:
    """
    Filter topics, variables and classifications to fit the classifications specified in spec_rows
    """
    topics = []
    all_variables = []
    for t in all_topics:
        all_variables.extend(t.variables)

    for sr in spec_rows:
        # extract classification codes from spec row NB ensure no duplication here
        required_cls_codes = [sr.dataset_classification]
        required_cls_codes.extend(sr.additional_atlas_classifications)
        required_cls_codes = list(set(required_cls_codes))

        # get topic, variable and classifications for those codes
        matched_variable = next(
            v for v in all_variables if required_cls_codes[0] in [c.code for c in v.classifications]
        )
        matched_classifications = [c for c in matched_variable.classifications if c.code in required_cls_codes]
        matched_topic = next(t for t in all_topics if matched_variable.code in [v.code for v in t.variables])


        # set classification visualisation flags
        for c in matched_classifications:
            if c.code == sr.choropleth_default_classification:
                c.choropleth_default = True
            if c.code == sr.dot_density_default_classification:
                c.dot_density_default = True
            if sr.comparison_2011 is True:
                c.comparison_2011_data_available = True

        # make shallow copy of topic with only the variable and classifications needed
        topic = CensusTopic(
            name=matched_topic.name,
            slug=matched_topic.slug,
            desc=matched_topic.desc,
            variables=[
                CensusVariable(
                    name=matched_variable.name,
                    code=matched_variable.code,
                    slug=matched_variable.slug,
                    desc=matched_variable.desc,
                    units=matched_variable.units,
                    classifications=matched_classifications,
                )
            ],
        )

        # merge topics and variables with those already processed, or add it if not
        processed_topic = next((t for t in topics if t.name == matched_topic.name), None)
        if processed_topic is not None:
            # variables can be referenced in multiple rows, so will need to check for already processed variables here
            processed_variable = next((v for v in processed_topic.variables if v.code == matched_variable.code), None)
            if processed_variable is not None:
                processed_variable.classifications.extend(matched_classifications)
            else:
                processed_topic.variables.extend(topic.variables)
        else:
            topics.append(topic)

    return topics


def main(all_content_json_fn: Path, rich_content_spec_fn: Path):
    spec_rows = load_spec_rows_from_csv(rich_content_spec_fn)
    all_topics = load_content(all_content_json_fn)
    topics = CensusRelease(name="all 2021 atlas data", topics=filter_content(spec_rows, all_topics))
    today = datetime.today().strftime('%Y-%m-%d')
    output_filename = all_content_json_fn.parent.joinpath(f"{all_content_json_fn.stem}-atlas-{today}.json")
    if output_filename.exists():
        print(
            f"target file {output_filename} already exists! Will not overwrite to avoid loss of work. "
            f"If you need to start again, please delete {output_filename} first."
        )
        return
    with open(output_filename, "w") as f:
        json.dump(topics.to_jsonable(), f, indent=2)


if __name__ == "__main__":
    all_content_json_fn = Path(sys.argv[1])
    rich_content_spec_fn = Path(sys.argv[2])
    main(all_content_json_fn, rich_content_spec_fn)
