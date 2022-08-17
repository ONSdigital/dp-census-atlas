#!/usr/bin/env python

"""
Crawl though content.json file check the format looks right.
"""

import json
from pathlib import Path
import sys

from census_objects import (
    CensusTopic, 
    topic_from_content_json
)

def load_content(content_file: Path) -> list[CensusTopic]:
    """Load all census objects defined in content_file."""
    with open(content_file, "r") as f:
        raw_topics = json.load(f)
    return [topic_from_content_json(t) for t in raw_topics]


def main():
    content_json_fn = Path(sys.argv[1])
    topics = load_content(content_json_fn)
    is_valid = all([t.is_valid() for t in topics])
    if is_valid:
        print("All topics pass validation!")


if __name__ == "__main__":
    main()