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
    data_download: str = ""
    _variable_code: str = ""

    def gather_children(self, category_list: list[CensusCategory], variable_spec: dict) -> None:
        """
        Append all categories with matching classification code to self, except those the variable_spec says to drop.
        """
        dropped_cats = variable_spec.get("classification_dropped_categories", {}).get(self.code, [])
        self.categories = [
            c for c in category_list if c._classification_code == self.code and c.name not in dropped_cats
        ]

    def set_choropleth_default(self, choropleth_default_classifications: list[str]) -> None:
        if self.code in choropleth_default_classifications:
            self.choropleth_default = True

    def set_dot_density_default(self, dot_density_default_classifications: list[str]) -> None:
        if self.code in dot_density_default_classifications:
            self.dot_density_default = True

    def set_data_downloads(self, data_downloads: list[dict]) -> None:
        data_downloads_row = next((r for r in data_downloads if r["classification"] == self.code), None)
        if data_downloads_row is not None and data_downloads_row["data_download"] != "":
            self.data_download = data_downloads_row["data_download"].strip()

    def set_available_geotypes(self, available_geos: list[dict]) -> None:
        available_geos_row = next((r for r in available_geos if r["classification"] == self.code), None)
        if available_geos_row is not None:
            self.available_geotypes = available_geos_row["available_geotypes"].strip().split(",")

    def set_comparison_2011_data_available_geotypes(self, available_2011_comparison_data: list[dict]) -> None:
        available_2011_row = next((r for r in available_2011_comparison_data if r["classification"] == self.code), None)
        if available_2011_row is not None and available_2011_row["2011_comparison_data_available_geotypes"] != "":
            self.comparison_2011_data_available_geotypes = available_2011_row[
                "2011_comparison_data_available_geotypes"
            ].strip().split(",")

    def is_valid(self) -> bool:
        """
        Return False if public properties are blank strings, categories is empty list, or any categories are not valid
        """
        is_valid = True
        blankable_props = ["dataset", "data_download"]
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

        if self.choropleth_default:
            output_params["choropleth_default"] = self.choropleth_default

        if self.dot_density_default:
            output_params["dot_density_default"] = self.dot_density_default

        if self.comparison_2011_data_available_geotypes:
            output_params[
                "comparison_2011_data_available_geotypes"
            ] = self.comparison_2011_data_available_geotypes

        if self.data_download:
            output_params["data_download"] = self.data_download

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
            "comparison_2011_data_available_geotypes", []
        ),
        data_download=content_json.get("data_download", ""),
        categories=[category_from_content_json(
            c) for c in content_json["categories"]],
    )


def classifications_from_metadata(
    classification_csv: Path or str,
    map_vis_defaults_csv: Path or str,
    downloads_csv: Path or str,
    available_geotypes_csv: Path or str,
    comparison_2011_csv: Path or str
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

    with open(comparison_2011_csv, "r") as f:
        available_2011_comparison_data_geotypes = list(csv.DictReader(f))

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
                    data_download="",
                    categories=[],
                    comparison_2011_data_available_geotypes=[],
                    _variable_code=csv_row["Variable_Mnemonic"],
                )

                classification.set_choropleth_default(choropleth_defaults)
                classification.set_dot_density_default(dot_density_defaults)
                classification.set_data_downloads(data_downloads)
                classification.set_available_geotypes(available_geotypes)
                classification.set_comparison_2011_data_available_geotypes(available_2011_comparison_data_geotypes)

                classifications.append(classification)

    return classifications
