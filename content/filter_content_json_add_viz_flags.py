#!/usr/bin/env python

"""
Filter content.json file with all variables + classifications (first CL arg) to only those referenced in config csv file
(second CL arg) and add additional visualisation flags for atlas (default classification for choropleth map, etc)

Output will be written to <path to input content.json>/<name of input content.json>-atlas-content-<todays date>.json.
"""

import csv
from dataclasses import dataclass
from datetime import datetime
import json
from pathlib import Path
import sys


from census_objects import ( 
    CensusClassification, 
    CensusVariable, 
    CensusTopic,
    CensusRelease,
    topic_from_content_json
)


# ====================================================== CONFIG ====================================================== #


# csv file encoding. NB - might want to check this if you get weird characters in the metadata output
METADATA_FILE_ENCODING = "utf-8-sig'"


# ==================================================== CLASSES ======================================================= #


@dataclass
class ConfigRow:
    """All needed config values from a row from the config csv file."""
    release: str
    topic_grouping: str
    topic: str
    variable: str
    classifications: str
    choropleth_default_classification: str
    dot_density_default_classification: str

    def to_str(self):
        """Simple string representation for error logging"""
        return f"topic: {self.topic}, variable: {self.variable.value}"


# ==================================================== UTILITIES ===================================================== #


def load_config_rows_from_csv(csv_fn: Path) -> list[ConfigRow]:
    """
    load_config_rows_from_config_sheet to list of ConfigRows. NB rows with no classifications to include will be 
    ignored
    """
    output = []
    with open(csv_fn, "r", encoding=METADATA_FILE_ENCODING) as f:
        for raw_row in csv.DictReader(f):
            if raw_row["Classifications To Include (leave blank if none)"] != "":
                output.append(ConfigRow(
                    release=raw_row["Release"],
                    topic_grouping=raw_row["Topic Grouping"],
                    topic=raw_row["Topic"],
                    variable=raw_row["Variable"],
                    classifications=raw_row["Classifications To Include (leave blank if none)"],
                    choropleth_default_classification=raw_row["Choropleth Default Classification (required)"],
                    dot_density_default_classification=raw_row["Dot Density Default Classification (leave blank if none)"],
                ))
    return output


def load_content(content_file: Path) -> list[CensusTopic]:
    """Load all census objects defined in content_file."""
    with open(content_file, "r") as f:
        raw_topics = json.load(f)
    return [topic_from_content_json(t) for t in raw_topics]


# ================================================= TOPIC PROCESSING ================================================= #


def get_topics(config_rows: list[ConfigRow], all_topics: list[CensusTopic]) -> list[CensusTopic]:
    """
    Filter topics + variables specified in config_rows from all_topics. 

    NB:
        - topics that are not found in all_topics will be ignored!
        - topics and variables are defined in the same rows on the config worksheet, so the same topic will be processed
        multiple times.
    """
    topics = []
    for cr in config_rows:
        # If we've already processed this topic on a different row, just add the topic variable...
        topic = next((t for t in topics if  cr.topic == t.name), None)
       
        if topic is None:
            # ... else get topic, add variable, and append to topics - nb config sheet seems to refer to topics
            # by either name, code or desc. skip this config row if no matching topic can be found/
            # NB COPY TOPIC RATHER THAN JUST TAKE REFERENCE (topics can be in multiple releases!)

            try:
                matched_topic = next(t for t in all_topics if cr.topic == t.name)
                topic = CensusTopic(
                    name=matched_topic.name,
                    slug=matched_topic.slug,
                    desc=matched_topic.desc,
                    variables=[],
                    _code=""
                )
                topics.append(topic)
            except StopIteration:
                print(f"** No definition found for topic on row with content {cr.to_str()}, cannot process! **")
                continue

        variable = get_variable(cr, matched_topic)
        if variable is not None:
            topic.variables.append(variable)
        
    return topics


# =============================================== VARIABLE PROCESSING ================================================ #


def get_variable(config_row: ConfigRow, topic: CensusTopic) -> CensusVariable:
    """
    To parse a variable from the wb workbook, first get_variable_code from the config_row, and then lookup the variable
    for that code in cantabular_metadata.variable (return if a variable for that code could not be found), then
    get_classifications from the worksheet for the variable, and finally make_legend_strs for all categories in all
    classifications for that variable.
    """

    try:

        # NB COPY VARIABLE RATHER THAN JUST TAKE REFERENCE (variables can be in multiple releases!)
        matched_variable = next(v for v in topic.variables if config_row.variable == v.code)
        variable = CensusVariable(
            name=matched_variable.name,
            code=matched_variable.code,
            slug=matched_variable.slug,
            desc=matched_variable.desc,
            units=matched_variable.units,
            classifications=[],
            _topic_code=""
        )
    
    except StopIteration:
        print(f"** No definition found for variable {config_row.variable}, cannot process! **")
        return

    variable.classifications = get_required_classifications(config_row, matched_variable)
    return variable


# ============================================ CLASSIFICATION PROCESSING ============================================= #


def get_required_classifications(config_row: ConfigRow, variable: CensusVariable) -> list[CensusClassification]:
    """
    Filter classifications specified in config_row from all classifications found in variable.
    """
    required_cls_str = config_row.classifications
    classifications = []
    required_cls_suffixes = [x.strip() for x in required_cls_str.split(",")]
    for suffix in required_cls_suffixes:
        try:
            if suffix == "raw":
                classification = next(c for c in variable.classifications if c.code == variable.code)
            else:
                classification = next(c for c in variable.classifications if has_suffix(c.code, suffix))
        except StopIteration:
            print(f"** No definition found for variable {variable.name} classification {suffix}, cannot process! **")
            continue

        cls_flags = get_classification_visualisation_flags(classification.code, config_row)
        classification.choropleth_default = cls_flags["choropleth_default"]
        classification.dot_density_default = cls_flags["dot_density_default"]
        classifications.append(classification)

    return classifications


def has_suffix(classification_code: str, suffix: str) -> bool:
    """Return true if classification_code ends with an underscore followed by suffix"""
    return classification_code.lower().endswith(f"_{suffix.lower()}")


def get_classification_visualisation_flags(code: str, config_row: dict) -> dict:
    """Parse additional flags relating to map visualisations for current variables classifications from config_row"""
    choropleth_default_class_suffix = (
        config_row.choropleth_default_classification
        .replace("(only one classification)", "")
        .strip()
        .lower()
    )
    dot_density_default_class_suffix = config_row.dot_density_default_classification.strip().lower()
    code_for_comparison = code.lower()
    return {
        "choropleth_default": has_suffix(code_for_comparison, choropleth_default_class_suffix),
        "dot_density_default": dot_density_default_class_suffix != "no" and has_suffix(code_for_comparison, dot_density_default_class_suffix)
    }


# ======================================================= MAIN ======================================================= #


def main(all_content_json_fn: Path, config_csv_fn: Path):
    config_rows = load_config_rows_from_csv(config_csv_fn)
    all_topics = load_content(all_content_json_fn)
    topics = CensusRelease(name="all 2021 atlas data", topics=get_topics(config_rows, all_topics))
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
    config_csv_fn = Path(sys.argv[2])
    main(all_content_json_fn, config_csv_fn)
