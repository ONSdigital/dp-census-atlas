#!/usr/bin/env python

"""
Crawl though content.json file check the format looks right.
"""

from pathlib import Path
import sys

from scripts.census_objects import (
    CensusVariableGroup, 
    load_content
)


def validate_variable_groups(variable_groups: list[CensusVariableGroup]) -> bool:
    return all([vg.is_valid() for vg in variable_groups])


def main():
    content_json_fn = Path(sys.argv[1])
    variable_groups = load_content(content_json_fn)["content"]
    is_valid = validate_variable_groups(variable_groups)
    if is_valid:
        print("All content passes validation!")


if __name__ == "__main__":
    main()