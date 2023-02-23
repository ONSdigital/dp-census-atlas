import csv
from dataclasses import dataclass
from pathlib import Path

from lib import slugify_with_expanded_special_characters


@dataclass
class CensusCategory:
    """A category as found in content.json."""

    name: str
    slug: str
    code: str
    legend_str_1: str
    legend_str_2: str
    legend_str_3: str
    restrict_to_modes: list[str]
    _classification_code: str = ""
    _category_code: str = ""

    def set_legend_strs(self, legend_strings: list[dict]) -> None:
        legend_str_row = next((r for r in legend_strings if r["category_code"] == self.code), None)
        if legend_str_row is not None:
            self.legend_str_1 = legend_str_row["legend_str_1"].strip()
            self.legend_str_2 = legend_str_row["legend_str_2"].strip()
            self.legend_str_3 = legend_str_row["legend_str_3"].strip()

    def is_valid(self) -> bool:
        """Return False if public properties are blank strings."""
        is_valid = True

        for prop, value in vars(self).items():
            if isinstance(value, str) and not prop.startswith("_") and value == "":
                print(
                    f"** Blank property {prop} found in variable {self.name} **")
                is_valid = False

        return is_valid

    def to_jsonable(self) -> dict:
        """Category in json-friendly form."""
        output_params = {
            "name": self.name,
            "slug": self.slug,
            "code": self.code,
            "legend_str_1": self.legend_str_1,
            "legend_str_2": self.legend_str_2,
            "legend_str_3": self.legend_str_3,
        }

        if self.restrict_to_modes:
            output_params["restrict_to_modes"] = self.restrict_to_modes

        return output_params


def category_from_content_json(content_json: dict) -> CensusCategory:
    """Make CensusCategory from dictionary extracted from a content.json file"""
    return CensusCategory(
        name=content_json["name"],
        code=content_json["code"],
        slug=content_json["slug"],
        legend_str_1=content_json["legend_str_1"],
        legend_str_2=content_json["legend_str_2"],
        legend_str_3=content_json["legend_str_3"],
        restrict_to_modes=content_json.get("restrict_to_modes", []),
    )


def category_code_from_csv_row(csv_row: dict) -> str:
    """
    Make standardised category code from info in row from Category.csv - classification mnemonic plus zero-padded
    category number.
    """
    return f'{csv_row["Classification_Mnemonic"]}-{ str(csv_row["Category_Code"]).zfill(3)}'


def categories_from_metadata(category_csv: Path or str, legend_strs_csv: Path or str) -> list[CensusCategory]:
    """
    Make CensusCategory's from rows in Category.csv. NB filter out 'minus' or non-numeric category numbers (generally \
    'Does Not Apply' or similar) and any blank rows in the csv, and sort by category code number.
    Append extra metadata from:
        - category_legend_strings.csv
    """
    categories = []

    # load extra metadata
    with open(legend_strs_csv, "r") as f:
        legend_strs = list(csv.DictReader(f))

    # load categories
    with open(category_csv, "r", encoding="utf-8") as f:
        for csv_row in csv.DictReader(f):
            if csv_row["Category_Code"].isnumeric() and csv_row["External_Category_Label_English"] != "":
                cat = CensusCategory(
                    name=csv_row["External_Category_Label_English"].strip(),
                    code=category_code_from_csv_row(csv_row),
                    slug=slugify_with_expanded_special_characters(
                        csv_row["External_Category_Label_English"].strip()
                    ),
                    legend_str_1="",
                    legend_str_2="",
                    legend_str_3="",
                    restrict_to_modes=[],
                    _classification_code=csv_row["Classification_Mnemonic"],
                    _category_code=csv_row["Category_Code"],
                )

                cat.set_legend_strs(legend_strs)

                categories.append(cat)

    # sort categories (sometimes they aren't sorted!)
    categories.sort(key=lambda x: int(x._category_code))

    return categories
