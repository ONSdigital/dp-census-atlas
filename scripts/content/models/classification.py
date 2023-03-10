import csv
from dataclasses import dataclass
from pathlib import Path

from lib import slugify_with_expanded_special_characters
from models.category import CensusCategory, category_from_content_json


@dataclass
class CensusClassification:
    """A classification as found in content.json."""

    code: str
    slug: str
    desc: str
    available_geotypes: list[str]
    choropleth_default: bool
    dot_density_default: bool
    categories: list[CensusCategory]
    comparison_2011_data_available_geotypes: list[str]
    dot_density_data_available_geotypes: list[str]
    change_notes: str = ""
    change_notes_link: str = ""
    data_download: str = ""
    change_data_download: str = ""
    _variable_code: str = ""

    def gather_children(self, category_list: list[CensusCategory], variable_spec: dict) -> None:
        """
        Append all categories with matching classification code to self, except those the variable_spec says to drop.
        """
        dropped_cats = variable_spec.get("classification_dropped_categories", {}).get(self.code, [])
        self.categories = [
            c for c in category_list if c._classification_code == self.code and c.name not in dropped_cats
        ]

        # set mode restrictions
        for cat_code, mode_restrictions in variable_spec.get("classification_category_mode_restrictions", {}).get(self.code, {}).items():
            cat = next((c for c in self.categories if c.code == cat_code), False)
            if not cat:
                print(
                    f"** Mode restriction for category {cat_code} in classification {self.code} could not be set - no matching category found! **")
            else:
                cat.restrict_to_modes = mode_restrictions

        # add custom categories
        for custom_cat_set in variable_spec.get("classification_custom_categories", {}).get(self.code, {}):
            insert_after_cat_code = custom_cat_set["insert_after"]
            insert_index = next((i + 1 for i, c in enumerate(self.categories)
                                if c.code == insert_after_cat_code), False)
            if not insert_index:
                print(
                    f"** Custom categories for classification {self.code} could not be set - no category matched 'insert after'! **")
            else:
                self.categories[insert_index:insert_index] = [
                    category_from_content_json(cat) for cat in custom_cat_set["categories"]]

    def set_mode_restrictions(self, variable_spec: dict) -> None:
        """
        Append all categories with matching classification code to self, except those the variable_spec says to drop.
        """

    def set_choropleth_default(self, choropleth_default_classifications: list[str]) -> None:
        if self.code in choropleth_default_classifications:
            self.choropleth_default = True

    def set_dot_density_default(self, dot_density_default_classifications: list[str]) -> None:
        if self.code in dot_density_default_classifications:
            self.dot_density_default = True

    def set_data_downloads(self, data_downloads: list[dict]) -> None:
        relevant_row = next((r for r in data_downloads if r["classification"] == self.code), None)
        if relevant_row is not None:
            if relevant_row["data_download"] != "":
                self.data_download = relevant_row["data_download"].strip()
            # set change data download if defined
            if relevant_row["change_data_download"] != "":
                self.change_data_download = relevant_row["change_data_download"].strip()

    def set_available_geotypes(self, available_geos: list[dict]) -> None:
        relevant_row = next((r for r in available_geos if r["classification"] == self.code), None)
        if relevant_row is not None:
            self.available_geotypes = relevant_row["2021_data_available_geotypes"].strip().split(",")
            # set comparison 2011 geotypes if defined
            if relevant_row["2011_2021_comparison_data_available_geotypes"] != "":
                self.comparison_2011_data_available_geotypes = relevant_row[
                    "2011_2021_comparison_data_available_geotypes"
                ].strip().split(",")
            # set dot density geotypes if defined
            if relevant_row["dot_density_data_available_geotypes"] != "":
                self.dot_density_data_available_geotypes = relevant_row[
                    "dot_density_data_available_geotypes"
                ].strip().split(",")
            

    def set_mode_specific_notes(self, mode_specific_notes: list[dict]) -> None:
        relevant_row = next((r for r in mode_specific_notes if r["classification"] == self.code), None)
        if relevant_row is not None and relevant_row["change_notes"] != "":
            self.change_notes = relevant_row["change_notes"].strip()
            if relevant_row["change_notes_link"] != "":
                self.change_notes_link = relevant_row["change_notes_link"]

    def is_valid(self) -> bool:
        """
        Return False if public properties are blank strings, categories is empty list, or any categories are not valid
        """
        is_valid = True
        blankable_props = ["dataset", "data_download", "change_notes", "change_notes_link", "change_data_download"]
        for prop, value in vars(self).items():
            if (
                isinstance(value, str)
                and not prop.startswith("_")
                and prop not in blankable_props
                and value == ""
            ):
                print(
                    f"** Blank property {prop} found in classification {self.code} **"
                )
                is_valid = False

        if len(self.categories) == 0:
            print(f"** Classification {self.code} has no categories **")
            is_valid = False

        if len(self.available_geotypes) == 0:
            print(
                f"** Classification {self.code} has no available geotypes **")
            is_valid = False

        for c in self.categories:
            if not c.is_valid():
                is_valid = False

        return is_valid

    def to_jsonable(self):
        """Classification json-friendly form w. optional properties."""
        output_params = {
            "code": self.code,
            "slug": self.slug,
            "desc": self.desc,
            "available_geotypes": self.available_geotypes,
        }
        optional_params = [
            "choropleth_default",
            "dot_density_default",
            "comparison_2011_data_available_geotypes",
            "dot_density_data_available_geotypes",
            "data_download",
            "change_data_download",
            "change_notes",
            "change_notes_link"
        ]
        for op in optional_params:
            op_value = getattr(self, op)
            if op_value:
                output_params[op] = op_value

        output_params["categories"] = [c.to_jsonable()
                                       for c in self.categories]

        return output_params


def classification_from_content_json(content_json: dict) -> CensusClassification:
    """Make CensusClassification from dictionary extracted from a content.json file"""
    return CensusClassification(
        code=content_json["code"],
        slug=content_json["slug"],
        desc=content_json["desc"],
        available_geotypes=content_json["available_geotypes"],
        choropleth_default=content_json.get("choropleth_default", False),
        dot_density_default=content_json.get("dot_density_default", False),
        comparison_2011_data_available_geotypes=content_json.get(
            "comparison_2011_data_available_geotypes", False
        ),
        dot_density_data_available_geotypes=content_json.get(
            "dot_density_data_available_geotypes", False
        ),
        data_download=content_json.get("data_download", ""),
        change_data_download=content_json.get("change_data_download", ""),
        change_notes=content_json.get("change_notes", ""),
        change_notes_link=content_json.get("change_notes_link", ""),
        categories=[category_from_content_json(
            c) for c in content_json["categories"]],
    )


def classifications_from_metadata(
    classification_csv: Path or str,
    map_vis_defaults_csv: Path or str,
    downloads_csv: Path or str,
    available_geotypes_csv: Path or str,
    mode_specific_notes_csv: Path or str,
) -> list[CensusClassification]:
    """
    Make CensusClassification's from rows in Classification.csv. NB filter out any blank rows in the csv. Append extra
    metadata from:
        - variable_choropleth_default_classifications.csv
        - classification_data_downloads.csv
        - classification_available_geotypes.csv
        - classification_2011_comparison_data_availability.csv
    """
    classifications = []

    # load extra metadata
    with open(map_vis_defaults_csv, "r") as f:
        vis_defaults = list(csv.DictReader(f))
    choropleth_defaults = [r["choropleth_default_classification"] for r in vis_defaults]
    dot_density_defaults = [r["dot_density_default_classification"] for r in vis_defaults]

    with open(downloads_csv, "r") as f:
        data_downloads = list(csv.DictReader(f))

    with open(available_geotypes_csv, "r") as f:
        available_geotypes = list(csv.DictReader(f))

    with open(mode_specific_notes_csv, "r") as f:
        mode_specific_notes = list(csv.DictReader(f))

    # load classifications
    with open(classification_csv, "r", encoding="utf-8") as f:
        for csv_row in csv.DictReader(f):
            if csv_row["Classification_Mnemonic"] != "":
                classification = CensusClassification(
                    code=csv_row["Classification_Mnemonic"].strip(),
                    slug=slugify_with_expanded_special_characters(
                        csv_row["Classification_Mnemonic"].strip()
                    ),
                    desc=csv_row["External_Classification_Label_English"].strip(
                    ),
                    available_geotypes=[],
                    choropleth_default=False,
                    dot_density_default=False,
                    comparison_2011_data_available_geotypes=[],
                    dot_density_data_available_geotypes=[],
                    data_download="",
                    categories=[],
                    _variable_code=csv_row["Variable_Mnemonic"],
                )

                classification.set_choropleth_default(choropleth_defaults)
                classification.set_dot_density_default(dot_density_defaults)
                classification.set_data_downloads(data_downloads)
                classification.set_available_geotypes(available_geotypes)
                classification.set_mode_specific_notes(mode_specific_notes)

                classifications.append(classification)

    return classifications
