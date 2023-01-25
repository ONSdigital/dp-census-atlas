import csv
from dataclasses import dataclass
from pathlib import Path

from lib import slugify_with_expanded_special_characters
from models.category import CensusCategory
from models.classification import CensusClassification, classification_from_content_json


@dataclass
class CensusVariable:
    """A variable as found in content.json."""

    name: str
    code: str
    slug: str
    desc: str
    long_desc: str
    units: str
    classifications: list[CensusClassification]
    base_url: str = ""
    topic_code: str = ""
    caveat_text: str = ""
    caveat_link: str = ""

    def gather_children(self, classification_list: list[CensusClassification], category_list: list[CensusCategory],
                        variable_spec: dict) -> None:
        """
        Append all classifications in classification_list that are referenced in variable_spec, then tell
        classifications to gather_children.
        """
        unsorted_classifications = [c for c in classification_list if c.code in variable_spec["classifications"]]
        for cls in unsorted_classifications:
            cls.gather_children(category_list, variable_spec)
        sorted_classifications = sorted(unsorted_classifications, key=lambda c: len(c.categories))
        self.classifications = sorted_classifications

    def set_short_desc(self, short_descs: list[dict]) -> None:
        short_desc_row = next((r for r in short_descs if r["variable"] == self.code), None)
        if short_desc_row is not None:
            self.desc = short_desc_row["short_desc"].strip()

    def set_caveat(self, caveats: list[dict]) -> None:
        caveat_row = next((r for r in caveats if r["variable"] == self.code), None)
        if caveat_row is not None and caveat_row["caveat_text"] != "":
            self.caveat_text = caveat_row["caveat_text"].strip()
            self.caveat_link = caveat_row["caveat_link"].strip()

    def set_base_url(self, tile_data_base_urls: list[dict]) -> None:
        base_url_row = next((r for r in tile_data_base_urls if r["variable"] == self.code), None)
        if base_url_row is not None and base_url_row["tile_data_base_url"] != "":
            self.base_url = base_url_row["tile_data_base_url"].strip()

    def is_valid(self) -> bool:
        """
        Return False if public properties are blank strings, classifications is empty list, available_geotypes is an
        empty list, there is no choropleth default classification set, or any classifications are not valid.
        """
        is_valid = True
        blankable_props = ["caveat_text", "caveat_link"]
        for prop, value in vars(self).items():
            if (
                isinstance(value, str)
                and not prop.startswith("_")
                and prop not in blankable_props
                and value == ""
            ):
                print(
                    f"** Blank property {prop} found in variable {self.name} **")
                is_valid = False

        if len(self.classifications) == 0:
            print(f"** Variable {self.name} has no classifications **")
            is_valid = False

        if not any(
            getattr(c, "choropleth_default", False) == True
            for c in self.classifications
        ):
            print(
                f"** Variable {self.name} has no choropleth default classification **"
            )
            is_valid = False

        for c in self.classifications:
            if not c.is_valid():
                is_valid = False

        return is_valid

    def to_jsonable(self):
        """Variable in json-friendly form."""
        output_params = {
            "name": self.name,
            "code": self.code,
            "slug": self.slug,
            "desc": self.desc,
            "long_desc": self.long_desc,
            "units": self.units,
            "topic_code": self.topic_code,
            "base_url": self.base_url
        }

        if self.caveat_text != "":
            output_params["caveat_text"] = self.caveat_text

        if self.caveat_link != "":
            output_params["caveat_link"] = self.caveat_link

        output_params["classifications"] = [
            c.to_jsonable() for c in self.classifications
        ]

        return output_params


def variable_from_content_json(content_json: dict) -> CensusVariable:
    """Make CensusVariable from dictionary extracted from a content.json file"""
    return CensusVariable(
        name=content_json["name"],
        code=content_json["code"],
        slug=content_json["slug"],
        desc=content_json["desc"],
        long_desc=content_json["long_desc"],
        units=content_json["units"],
        topic_code=content_json["topic_code"],
        caveat_text=content_json.get("caveat_text", ""),
        caveat_link=content_json.get("caveat_link", ""),
        base_url=content_json.get("base_url", ""),
        classifications=[classification_from_content_json(
            c) for c in content_json["classifications"]],
    )


def variables_from_metadata(variable_csv: Path or str, short_desc_csv: Path or str,
                            caveat_csv: Path or str, tile_data_base_url_csv: Path or str) -> list[CensusVariable]:
    """
    Make CensusVariable's from rows in Variable.csv. NB filter out any blank rows in the csv. Append extra
    metadata from:
        - variable_short_descriptions.csv
        - variable_caveats.csv
    """
    variables = []

    # load extra metadata
    with open(short_desc_csv, "r") as f:
        short_descs = list(csv.DictReader(f))

    with open(caveat_csv, "r") as f:
        caveats = list(csv.DictReader(f))

    with open(tile_data_base_url_csv, "r") as f:
        tile_data_base_urls = list(csv.DictReader(f))

    # load variables
    with open(variable_csv, "r", encoding="utf-8") as f:
        for csv_row in csv.DictReader(f):
            if csv_row["Variable_Title"] != "":
                variable = CensusVariable(
                    name=csv_row["Variable_Title"].strip(),
                    code=csv_row["Variable_Mnemonic"].strip(),
                    slug=slugify_with_expanded_special_characters(
                        csv_row["Variable_Title"].strip()),
                    desc=csv_row["Variable_Description"].strip(),
                    long_desc=csv_row["Variable_Description"].strip(),
                    units=csv_row["Statistical_Unit"].strip(),
                    # sometimes things don't have topics??
                    topic_code=csv_row["Topic_Mnemonic"] if csv_row["Topic_Mnemonic"] != "" else "NO_TOPIC",
                    classifications=[],
                )

                variable.set_short_desc(short_descs)
                variable.set_caveat(caveats)
                variable.set_base_url(tile_data_base_urls)

                variables.append(variable)
    return variables
