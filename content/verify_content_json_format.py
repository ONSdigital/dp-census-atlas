#!/usr/bin/env python

"""
Crawl though content.json file check the format looks right.
"""

import json
import sys

def main():
    content_json_fp = sys.argv[1]
    with open(content_json_fp, "r") as f:
        content = json.load(f)
    
    for topic in content:

        for key in ["name", "slug", "desc", "variables"]:
            if key not in topic:
                print (f"{key} missing from topic: {topic}")


        if len(topic.get("variables", [])) == 0:
            print(f"Topic has no variables: {topic['name']}")
            continue

        for variable in topic["variables"]:
            for key in ["name", "slug", "code", "desc","units", "classifications"]:
                if key not in variable:
                    print (f"{key} missing from variable: {variable}")

            if len(variable.get("classifications", [])) == 0:
                print(f"Variable has no classifications: {variable['code']}")
                continue
            
            if len([c for c in variable["classifications"] if c.get("choropleth_default", False)]) == 0:
                print(f"Variable has no default choropleth classification: {variable['code']}")

            for classification in variable["classifications"]:
                for key in ["slug", "code", "desc", "categories"]:
                    if key not in classification:
                        print (f"{key} missing from classification: {classification}")


                if len(classification.get("categories", [])) == 0:
                    print(f"Classification has no categories: {classification['code']}")
                    continue

                for category in classification["categories"]:
                    for key in ["name", "slug", "code", "legend_str_1", "legend_str_2", "legend_str_3"]:
                        if key not in category:
                            print (f"{key} missing from category: {category}")
                            return


                   

if __name__ == "__main__":
    main()