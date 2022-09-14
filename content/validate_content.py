#!/usr/bin/env python

"""
Crawl though content.json file check the format looks right.
"""

import json
from pathlib import Path
import sys

from census_objects import (
    CensusTopic, 
    load_content
)


def main():
    content_json_fn = Path(sys.argv[1])
    variable_groups = load_content(content_json_fn)["content"]
    is_valid = all([vg.is_valid() for vg in variable_groups])
    if is_valid:
        print("All content passes validation!")


if __name__ == "__main__":
    main()