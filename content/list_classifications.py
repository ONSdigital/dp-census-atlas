#!/usr/bin/env python

"""
Crawl though content.json file and output all classifications referenced in it as csv.
"""

import csv
import json
import sys


def main():
    content_json_fp = sys.argv[1]
    output_filename = sys.argv[2]
    with open(content_json_fp, "r") as f:
        content = json.load(f)
    
    csv_content = []
    for topic in content:
        for variable in topic["variables"]:
            for classification in variable["classifications"]:
                csv_content.append({
                    "topic": topic["name"],
                    "variable": variable["name"],
                    "classification": classification["code"],
                })
                # for category in classification["categories"]:
    
    with open(output_filename, "w") as f:
        writer = csv.DictWriter(f, fieldnames=csv_content[0].keys(), quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(csv_content)
                   

if __name__ == "__main__":
    main()