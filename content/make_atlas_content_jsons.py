#!/usr/bin/env python

"""
Parse atlas content.json file(s) from config excel and csv files. 

Load category mappings and custom config from output category mapping excel file (this must be suppled as an arg when
running the script). This file is expected to be changed by use fairly regularly and so is given as an arg.

Load cantabular metadata from csv files - there are assumed to be three of these, found in the 'metadata_files'
directory: 'metadata_files/Topic.csv', 'metadata_files/Variable.csv' and 'metadata_files/Classification.csv'.

Parse releases (sets of topics) and their child variables, classifications and categories from these files, collate,
and output as content.json files to the content_jsons directory.
"""

import copy
import csv
from dataclasses import dataclass
import json
import os
import sys

from openpyxl.cell.cell import Cell
from openpyxl import load_workbook
from openpyxl.workbook.workbook import Workbook
from openpyxl.worksheet.worksheet import Worksheet
from slugify import slugify


# ====================================================== CONFIG ====================================================== #


# csv file encoding. NB - might want to check this if you get weird characters in the metadata output
METADATA_FILE_ENCODING = "utf-8-sig'"

# The name of the sheet in the Output_Category_Mapping excel workbook with the variables to process and the additional
# config required to process them into atlas content files.
CONFIG_WORKSHEET = "INDEX-filtered"

# The release column name (assumed to be first row) in the index page which specifies the release a topic/variable
# belongs to.
RELEASE_COLUMN = "Release"

# The column name (assumed to be first row) in the index page which specifies the topic each variable belongs to
TOPIC_NAME_COLUMN = "Topic Area(s)"

# The column name (assumed to be first row) in the index page which contains within-sheet hyperlinks to variable sheets
# to be included (e.g. Accommodation_Type, which links to the ACCOMODATION_TYPE worksheet). NB - all values in here that
# are NOT hyperlinks will not currently be processed, as they are assumed to refer to variables that are not
# defined in the Output_Category_Mapping excel workbook.
VAR_HYPERLINK_COLUMN = "2021 Mnemonic (variable)"

# The column name (assumed to be first row) that lists the classifications from each variable that are to be included.
# This can be either a single value (e.g. 2A), a comma-seperated list (e.g 2A, 4A, 5A) or 'all' (all defined
# classifications will be included.)
CLASSIFICATIONS_TO_INCLUDE_COLUMN = "Classifications to keep"

# The column name (assumed to be first row) that defines the default classification to be used for each variable.
CHOROPLETH_DEFAULT_CLASS_COLUMN = "Default classification"

# The column name (assumed to be first row) that defines the classification for each variable that can be represented
# as a dot density map
DOT_DENSITY_DEFAULT_CLASS_COLUMN = "Dot density classification"

# The column name (assumed to be first row) that flags if this variable has comparison data from the previous 2011
# census
COMPARISON_2011_COLUMN = "2011 comparability?"

# Values that are often found in the same place as data but are not data, and so shouldn't be included.
NOT_DATA = ("return to index", "does not apply", "no code required")


# dictionaries of known aliases, i.e. names that differ between the category mapping excel workbook (here as keys)
# and the cantabular metadata (here as values)
TOPIC_ALIASES = {
    "Migration": "International Migration",
    "Health": "Health, Disability and Unpaid Care",
    "Unpaid Care": "Health, Disability and Unpaid Care",
}

VARIABLE_ALIASES = {
    "VETERAN_IND": "uk_armed_forces",
    "COB": "country_of_birth",
    "ECONOMIC_ACTIVITY_STATUS": "activity_last_week",
    "Hours_Worked_Per_Week": "hours_per_week_worked",
    "RELIGION_DETAILED": "religion",
    "NSSEC": "ns_sec",
}


# dictionary of known unit plurals
UNIT_PLURALS = {
    "household": "households",
    "dwelling": "dwellings",
    "family": "families",
    "person": "people"
}

# ==================================================== CLASSES ======================================================= #


@dataclass
class ConfigRow:
    """All needed config values from a row from the config page of the input workbook (e.g INDEX-fitered)"""

    release: str
    topic: str
    variable: Cell
    classifications: str
    choropleth_default_classification: str
    dot_density_default_classification: str

    def to_str(self):
        """Simple string representation for error logging"""
        return f"topic: {self.topic}, variable: {self.variable.value}"


@dataclass
class CensusCategory:
    """A category as found in content.json."""

    name: str
    slug: str
    code: str
    legend_str_1: str = ""
    legend_str_2: str = ""
    legend_str_3: str = ""

    def to_jsonable(self):
        """Category in json-friendly form."""
        return {
            "name": self.name, 
            "slug": self.slug, 
            "code": self.code,
            "legend_str_1": self.legend_str_1, 
            "legend_str_2": self.legend_str_2,
            "legend_str_3": self.legend_str_3,
        }


@dataclass
class CensusClassification:
    """A classification as found in content.json."""

    code: str
    slug: str
    desc: str
    choropleth_default: bool
    dot_density_default: bool
    categories: list[CensusCategory]

    def to_jsonable(self):
        """Classification json-friendly form w. optional properties."""
        output_params = {
            "code": self.code,
            "slug": self.slug,
            "desc": self.desc
        }
        if self.choropleth_default:
            output_params["choropleth_default"] = self.choropleth_default
        if self.dot_density_default:
            output_params["dot_density_default"] = self.dot_density_default
        output_params["categories"] = [c.to_jsonable() for c in self.categories]
        return output_params


@dataclass
class CensusVariable:
    """A variable as found in content.json."""

    name: str
    code: str
    slug: str
    desc: str
    units: str
    classifications: list[CensusClassification]

    def to_jsonable(self):
        """Variable in json-friendly form."""
        return {
            "name": self.name,
            "code": self.code,
            "slug": self.slug,
            "desc": self.desc,
            "units": self.units,
            "classifications": [c.to_jsonable() for c in self.classifications],
        }


@dataclass
class CensusTopic:
    """A topic as found in content.json."""

    name: str
    code: str
    slug: str
    desc: str
    variables: list[CensusVariable]

    def to_jsonable(self):
        """Topic in json-friendly form."""
        return {
            "name": self.name,
            "slug": self.slug,
            "desc": self.desc,
            "variables": [v.to_jsonable() for v in self.variables],
        }


@dataclass
class CensusRelease:
    """The contents of an individual content json, representing a release of census data."""

    name: str
    topics: list[CensusTopic]

    def to_jsonable(self):
        """Topic list in json-friendly form, with topics sorted alphabetically.."""
        return [t.to_jsonable() for t in sorted(self.topics, key=lambda x: x.name)]


@dataclass
class CantabularMetadata:
    """All needed definitions loaded from cantabular metadata csv files"""

    topics: list[CensusTopic]
    variables: list[CensusVariable]
    classifications: list[CensusClassification]


# ==================================================== UTILITIES ===================================================== #


def load_config_rows_from_config_sheet(wb: Workbook) -> list[ConfigRow]:
    """load_config_rows_from_config_sheet to list of ConfigRows. NB blank rows will be ignored"""
    rows = wb[CONFIG_WORKSHEET].rows
    header_row = next(rows)
    colnames = [cell.value for cell in header_row]
    row_dicts = [
        dict(zip(colnames, row))
        for row in rows
        if not all(c.value == None for c in row)
    ]
    return [
        ConfigRow(
            release=row_raw[RELEASE_COLUMN].value,
            topic=row_raw[TOPIC_NAME_COLUMN].value,
            variable=row_raw[VAR_HYPERLINK_COLUMN],
            classifications=row_raw[CLASSIFICATIONS_TO_INCLUDE_COLUMN].value,
            choropleth_default_classification=row_raw[CHOROPLETH_DEFAULT_CLASS_COLUMN].value,
            dot_density_default_classification=row_raw[DOT_DENSITY_DEFAULT_CLASS_COLUMN].value,
        )
        for row_raw in row_dicts
    ]


def load_cantabular_metadata(topic_csv: str, variable_csv: str, classification_csv: str) -> CantabularMetadata:
    return CantabularMetadata(
        topics=load_cantabular_topics(topic_csv),
        variables=load_cantabular_variables(variable_csv),
        classifications=load_cantabular_classifications(classification_csv),
    )


def load_cantabular_topics(topic_csv: str) -> list[CensusTopic]:
    """load_cantabular_topics from csv file cantabular_topic_csv to a list of CensusTopic with no variables."""
    with open(topic_csv, "r", encoding=METADATA_FILE_ENCODING) as f:
        dict_reader = csv.DictReader(f)
        return [
            CensusTopic(
                name=topic_raw["Topic_Title"].strip(),
                code=topic_raw["Topic_Mnemonic"].strip(),
                slug=slugify(topic_raw["Topic_Mnemonic"].strip()),
                desc=topic_raw["Topic_Description"].strip(),
                variables=[],
            )
            for topic_raw in dict_reader
        ]


def load_cantabular_variables(variable_csv: str) -> list[CensusVariable]:
    """
    load_cantabular_variables from csv file cantabular_variable_csv to a list of CensusVariable with no classifications.
    """
    with open(variable_csv, "r", encoding=METADATA_FILE_ENCODING) as f:
        dict_reader = csv.DictReader(f)
        return [
            CensusVariable(
                name=var_raw["Variable_Title"].strip(),
                code=var_raw["Variable_Mnemonic"].strip(),
                slug=slugify(var_raw["Variable_Mnemonic"].strip()),
                desc=var_raw["Variable_Description"].strip(),
                units=var_raw["Statistical_Unit"].strip(),
                classifications=[],
            )
            for var_raw in dict_reader
        ]


def load_cantabular_classifications(classification_csv: str) -> list[CensusClassification]:
    """
    load_cantabular_variables from csv file cantabular_variable_csv to a list of CensusClassification with no
    categories.
    """
    with open(classification_csv, "r", encoding=METADATA_FILE_ENCODING) as f:
        dict_reader = csv.DictReader(f)
        return [
            CensusClassification(
                code=cls_raw["Classification_Mnemonic"].strip(),
                slug=slugify(cls_raw["Classification_Mnemonic"].strip()),
                desc=cls_raw["External_Classification_Label_English"].strip(),
                choropleth_default=False,
                dot_density_default=False,
                categories=[],
            )
            for cls_raw in dict_reader
        ]


def cmp_strings(string1: str, string2: str) -> bool:
    """Return True if normalised strings are equal. Return false if one is None!"""
    if string1 is None or string2 is None:
        return False
    return string1.lower().strip() == string2.lower().strip()


def cmp_string_to_list(string1: str, strList: list[str] | tuple[str]) -> bool:
    """Return True if normalised string1 is equal to any normalised string in strList."""
    return any(cmp_strings(string1, string2) for string2 in strList)


# ================================================ RELEASE PROCESSING ================================================ #


def get_releases(wb: Workbook, config_rows: list[ConfigRow], cantabular_metadata) -> list[CensusRelease]:
    """
    To parse the releases from the wb workbook, gather unique release names from the config_rows list, gather
    config_rows associated with each release name, and get_topics for each release.
    """
    release_names = set(cr.release for cr in config_rows if cr.release is not None)
    releases = []
    for rn in release_names:
        release_config_rows = [cr for cr in config_rows if cr.release == rn]
        releases.append(
            CensusRelease(
                name=rn,
                topics=get_topics(wb, release_config_rows, cantabular_metadata)
            )
        )
    return releases


# ================================================= TOPIC PROCESSING ================================================= #


def get_topics(wb: Workbook, config_rows: list[ConfigRow], cantabular_metadata) -> list[CensusTopic]:
    """
    To parse the topics from the wb workbook, loop through the ConfigRows (which define which topics, variables
    and classifications are to be processed) get the topic defined in the cantabular_metadata.topics for each one,
    and get_variable for each topic.

    NB:
        - topics that are not found in the cantabular metadata will be ignored!
        - known aliases of topics (there are different names uses in different files) are checked against the
        TOPIC_ALIASES constant.
        - topics and variables are defined in the same rows on the config worksheet, so the same topic will be processed
        multiple times. Only the first defintion of the topic will be saved.
    """
    topics = []
    for cr in config_rows:
        # check for topic aliases, use name from there if found to lookup topic in cantabular_metadata
        if cr.topic in TOPIC_ALIASES:
            print(
                f"Using alias {TOPIC_ALIASES[cr.topic]} for topic {cr.topic}")
            search_name = TOPIC_ALIASES[cr.topic]
        else:
            search_name = cr.topic

        # If we've already processed this topic on a different row, just add the topic variable...
        if search_name in [t.name for t in topics]:
            topic = next(t for t in topics if t.name == search_name)

        # ... else get cantabular topic, add variable, and append to topics - nb config sheet seems to refer to topics
        # by either name, code or desc. skip this config row if no matching topic can be found/
        # NB COPY TOPIC FROM CANTABULAR RATHER THAN JUST TAKE REFERENCE (topics can be in multiple releases!)
        else:
            try:
                topic = copy.deepcopy(
                        next(
                        t
                        for t in cantabular_metadata.topics
                        if cmp_string_to_list(search_name, (t.name, t.code, t.desc))
                    )
                )
                topics.append(topic)
            except StopIteration:
                print(
                    f"** No defintion found in cantabular metadata for topic on row with content {cr.to_str()}, "
                    "cannot process! **"
                )
                continue

        variable = get_variable(wb, cr, cantabular_metadata)
        if variable is not None:
            topic.variables.append(variable)

    return topics


# =============================================== VARIABLE PROCESSING ================================================ #


def get_variable(wb: Workbook, config_row: ConfigRow, cantabular_metadata: CantabularMetadata) -> CensusVariable:
    """
    To parse a variable from the wb workbook, first get_variable_code from the config_row, and then lookup the variable
    for that code in cantabular_metadata.variable (return if a variable for that code could not be found), then
    get_classifications from the worksheet for the variable, and finally make_legend_strs for all categories in all
    classifications for that variable.
    """
    var_code = get_variable_code(config_row)

    try:

        # check for variable aliases, use code from there if found to lookup variable in cantabular_metadata
        if var_code in VARIABLE_ALIASES:
            print(
                f"Using alias {VARIABLE_ALIASES[var_code]} for variable {var_code}")
            search_code = VARIABLE_ALIASES[var_code]
        else:
            search_code = var_code

        # NB COPY VARIABLE FROM CANTABULAR RATHER THAN JUST TAKE REFERENCE (variables can be in multiple releases!)
        variable = copy.deepcopy(
                next(
                v for v in cantabular_metadata.variables if cmp_strings(search_code, v.code)
            )
        )
    except StopIteration:
        print(
            f"** No defintion found in cantabular metadata for variable {var_code}, cannot process! **"
        )
        return

    variable.classifications = get_required_classifications(wb[var_code], config_row, cantabular_metadata)
    for classification in variable.classifications:
        for category in classification.categories:
            make_cat_legend_strs(variable, category)
    
    return variable


def get_variable_code(config_row: dict) -> str or None:
    """
    To get the variable code from the config_row, read the value of the config_row.variable cell. If this is not a
    hyperlink, the config_row does not refer to the a variable that is defined in the current workbook, so return None.
    If it is a hyperlink, return the name of the worksheet it points to.
    """
    var_code_cell = config_row.variable
    if var_code_cell.hyperlink is None:
        print(
            f"Ignoring variable {var_code_cell.value} as it does not link to a variable in spreadsheet."
        )
        return None
    return var_code_cell.hyperlink.location.split("!")[0].replace("'", "")


# ============================================ CLASSIFICATION PROCESSING ============================================= #


def get_required_classifications(
    cls_ws: Worksheet, config_row: ConfigRow, cantabular_metadata: CantabularMetadata
) -> list[CensusClassification]:
    """
    To parse required classifications from the cls_ws worksheet, first get_classification_column_indices, then
    filter_required_classifications to only those required in the config_row, then for each required classification,
    convert the cls_ws.columns generator into an indexable list and get_classification_metadata,
    get_classification_visualisation_flags, and then get_categories from those columns containing classification info.
    """
    cls_col_indices = get_classification_column_indices(cls_ws)
    required_cls_col_indices = filter_required_classifications(
        cls_col_indices, config_row
    )
    cls_ws_cols = [col for col in cls_ws.columns]
    classifications = []
    for c in required_cls_col_indices:

        try:
            classification = next(
                v for v in cantabular_metadata.classifications if cmp_strings(c["cls_code"], v.code))
        except StopIteration:
            print(
                f"** No defintion found in cantabular metadata for classification {c['cls_code']}, cannot process! **"
            )
            return []

        cls_flags = get_classification_visualisation_flags(
            c["cls_code"], config_row)
        classification.choropleth_default = cls_flags["choropleth_default"]
        classification.dot_density_default = cls_flags["dot_density_default"]
        classification.categories = get_categories(
            cls_ws_cols[c["cat_codes_col"]], cls_ws_cols[c["cat_name_col"]]
        )
        classifications.append(classification)

    return classifications


def get_classification_column_indices(cls_ws: Worksheet) -> list[dict]:
    """
    To get classification column indices, first get the classification codes by extracting all non-empty strings from
    the first row of the worksheet and filtering out those listed in the NOT_DATA constant, then get the column index
    of each classification code (the category codes are assumed to also in this column) and the column index immediately
    to its right (the category names are assumed to be in this column). Finally fix_classification_code_formatting.
    """
    col_headers = [cell.value for cell in next(cls_ws.rows)]
    cls_headers = [h for h in col_headers if isinstance(h, str) and not cmp_string_to_list(h, NOT_DATA)]
    return [
        {"cls_code": fix_classification_code_formatting(c), "cat_codes_col": i, "cat_name_col": i + 1}
        for i, c in enumerate(col_headers) if c in cls_headers
    ]


def fix_classification_code_formatting(cls_code: str) -> str:
    """Fix common issues seen in classification code formatting in the category mapping excel."""
    return cls_code.replace(" ", "")


def filter_required_classifications(cls_column_indices: list[dict], config_row: dict) -> list[dict]:
    """
    To filter required classifications, first extract and parse the value of config_row.classifications (which may be
    'all' or a comma-seperated list of classification suffixes) and filter the cls_column_indices dict to only those
    referenced in this value.
    """
    required_cls_str = config_row.classifications

    if required_cls_str == "all":
        return cls_column_indices
    else:
        required_cls = [x.strip() for x in required_cls_str.split(",")]
        return [
            c for c in cls_column_indices if any(has_suffix(c["cls_code"], rc) for rc in required_cls)
        ]


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


def has_suffix(classification_code: str, suffix: str) -> bool:
    """Return true if classification_code ends with an underscore followed by suffix"""
    return classification_code.lower().endswith(f"_{suffix.lower()}")


# ================================================ CATEGORY PROCESSING =============================================== #


def get_categories(cat_codes_col: tuple[Cell], cat_name_col: tuple[Cell]) -> list[CensusCategory]:
    """
    To parse categories from cat_codes_col and cat_name_col worksheet columns, first get_category_cell_indices for each
    (throws exception if these do not match), then create_category_code from both the codes and the
    name for each category. NB - category names found in the NOT_DATA constant will be ignored.
    """
    cat_code_cell_indices = get_category_cell_indices(cat_codes_col)
    cat_name_cell_indices = get_category_cell_indices(cat_name_col)

    if cat_code_cell_indices != cat_name_cell_indices:
        error_str = (
            f"Fatal error processing classification {cat_codes_col[0].value} - code and name columns don't match up!"
            " Differences seen in cells "
            f"{[x + 1 for x in set(cat_code_cell_indices).difference(set(cat_name_cell_indices))]}."
        )
        raise Exception(error_str)

    categories = []
    for i in cat_code_cell_indices:
        if not cmp_string_to_list(cat_name_col[i].value, NOT_DATA):
            categories.append(
                CensusCategory(
                    name=cat_name_col[i].value,
                    slug=slugify(
                        cat_name_col[i].value,
                    ),
                    code=make_cat_code(
                        cat_name_col[i].value, cat_codes_col[i].value),
                )
            )
    return categories


def get_category_cell_indices(col: tuple[Cell]) -> list[int]:
    """
    To get category cell indices from a col, find indices of all populated cells that have left or right borders defined
    (this seems to be a consistent style used in the Output_Category_Mapping excel workbook). NB - enumerate from second
    row (making sure to adjust the index) and ignore the first row as this should be the category code, regardless of
    formatting.
    """
    category_cell_indices = []
    for i, c in enumerate(col[1:], 1):
        if c.value != None and (c.border.left.style is not None or c.border.right.style is not None):
            category_cell_indices.append(i)
    return category_cell_indices


def make_cat_code(cat_name: str, cat_codes: str) -> str:
    """
    To make a unqiue category_code from the cat_name and cat_codes of a category, first normalise the cat_codes
    statement to have no whitespace and consist only of numbers, commas and '-' (with no leading zeroes) then combine
    with the slugified cat_name, seperated by an =.
    """
    cat_codes = "".join(str(cat_codes).split())
    for to_replace in ("–", ">"):
        cat_codes = cat_codes.replace(to_replace, "-")
    if cat_codes[0] == "0":
        cat_codes = cat_codes[1:]
    return f"{slugify(cat_name)}={cat_codes}"


def make_cat_legend_strs(var: CensusVariable, cat: CensusCategory) -> None:
    """Make first-attempt at legend strings for category (intention is these are then manually reviewed / edited)"""
    cat.legend_str_1 = f" of {UNIT_PLURALS[var.units.lower()]} in {{location}}"
    cat.legend_str_2 = " are "
    cat.legend_str_3 = cat.name.lower()


# ======================================================= MAIN ======================================================= #


def main(workbook_fn: str, topic_meta_fn: str, variable_meta_fn: str, classification_meta_fn: str, output_dir: str):
    wb = load_workbook(workbook_fn)
    config_rows = load_config_rows_from_config_sheet(wb)
    cantabular_metadata = load_cantabular_metadata(topic_meta_fn, variable_meta_fn, classification_meta_fn)
    releases = get_releases(wb, config_rows, cantabular_metadata)
    for release in releases:
        output_filename = f"{output_dir}/{release.name}-content.json"
        if os.path.exists(output_filename):
            print(
                f"target file {output_filename} already exists! Will not overwrite to avoid loss of work. "
                f"If you need to start again, please delete {output_filename} first."
            )
            continue
        with open(output_filename, "w") as f:
            json.dump(release.to_jsonable(), f, indent=2)


if __name__ == "__main__":
    workbook_fn = sys.argv[1]
    topic_meta_fn = "metadata_files/Topic.csv"
    variable_meta_fn = "metadata_files/Variable.csv"
    classification_meta_fn = "metadata_files/Classification.csv"
    output_dir = "content_jsons"
    main(workbook_fn, topic_meta_fn, variable_meta_fn, classification_meta_fn, output_dir)
