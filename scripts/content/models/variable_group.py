from dataclasses import dataclass
import json

from lib import clone_census_object
from models.category import CensusCategory
from models.classification import CensusClassification
from models.variable import CensusVariable, variable_from_content_json


@dataclass
class CensusVariableGroup:
    """An atlas-specific group of census variables as found in content.json."""

    name: str
    slug: str
    desc: str
    variables: list[CensusVariable]

    def gather_children(self, variable_list: list[CensusVariable], classification_list: list[CensusClassification],
                        category_list: list[CensusCategory], variable_group_spec: dict) -> None:
        """
        Append all variables in variable_list that are referenced in variable_group_spec, then tell variables to
        gather_children.
        """
        for content_json_spec in variable_group_spec["variables_by_content_json"].values():
            for variable_spec in content_json_spec:
                # append custom variables directly without invoking gather children
                # (they should be fully defined in spec)
                if "custom_variable" in variable_spec:
                    self.variables.append(variable_from_content_json(variable_spec["custom_variable"]))
                # otherwise clone matching variable and gather its children, then append to self.variables
                else:
                    try:
                        variable = clone_census_object(
                            next(v for v in variable_list if v.code == variable_spec["code"]))
                    except StopIteration:
                        print(f"Could not find variable matching code {variable_spec['code']} in metadata!")
                        exit(1)
                    variable.gather_children(classification_list, category_list, variable_spec)
                    self.variables.append(variable)

    def is_valid(self) -> bool:
        """
        Return False if public properties are blank strings, variables is empty list or any variables are not valid.
        """
        is_valid = True

        for prop, value in vars(self).items():
            if isinstance(value, str) and not prop.startswith("_") and value == "":
                print(
                    f"** Blank property {prop} found in topic {self.name} **")
                is_valid = False

        if len(self.variables) == 0:
            print(f"** Topic {self.name} has no variables **")
            is_valid = False

        for v in self.variables:
            if not v.is_valid():
                is_valid = False

        return is_valid

    def to_jsonable(self) -> dict:
        """Variable group in json-friendly form."""
        return {
            "name": self.name,
            "slug": self.slug,
            "desc": self.desc,
            "variables": [v.to_jsonable() for v in self.variables],
        }


def variable_group_from_content_json(content_json: dict) -> CensusVariableGroup:
    """Make CensusVariableGroup from dictionary extracted from a content.json file"""
    return CensusVariableGroup(
        name=content_json["name"],
        slug=content_json["slug"],
        desc=content_json["desc"],
        variables=[variable_from_content_json(v) for v in content_json["variables"]],
        _topic_codes=[],
    )


def variable_groups_from_spec(spec: dict, variables: list[CensusVariable], classifications: list[CensusClassification],
                              categories: list[CensusCategory]) -> list[CensusVariableGroup]:
    """Make CensusVariableGroups from spec dict."""
    variable_groups = []
    for vg_spec in spec["variable_groups"]:
        # gather all variable group variables from spec
        vg = CensusVariableGroup(
            name=vg_spec["name"],
            slug=vg_spec["slug"],
            desc=vg_spec["desc"],
            variables=[],
        )
        vg.gather_children(variables, classifications, categories, vg_spec)
        variable_groups.append(vg)
    return variable_groups
