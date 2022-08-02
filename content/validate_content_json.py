#!/usr/bin/env python

"""
Crawl though content.json file check the format looks right.
"""

import json
import sys

from make_atlas_content_jsons import (
    CensusTopic, 
    CensusVariable, 
    CensusClassification, 
    CensusCategory
)

def main():
    content_json_fp = sys.argv[1]
    with open(content_json_fp, "r") as f:
        content = json.load(f)

    for t in content:

        topic = CensusTopic(
            name=t["name"],
            slug=t["slug"],
            desc=t["desc"],
            variables = [
                CensusVariable(
                    name=v["name"],
                    code=v["code"], 
                    slug=v["slug"],
                    desc=v["desc"],
                    units=v["units"],
                    classifications=[
                        CensusClassification(
                            code=c["code"], 
                            slug=c["slug"],
                            desc=c["desc"],
                            choropleth_default=c.get("choropleth_default", False),
                            dot_density_default=c.get("dot_density_default", False),
                            categories = [
                                CensusCategory(
                                    name=ct["name"],
                                    slug=ct["slug"],
                                    code=ct["code"],
                                    legend_str_1=ct["legend_str_1"],
                                    legend_str_2=ct["legend_str_2"],
                                    legend_str_3=ct["legend_str_3"]
                                ) for ct in c["categories"]
                            ]
                        ) for c in v["classifications"]
                    ]
                ) for v in t["variables"]
            ]

        )

        topic.is_valid()




if __name__ == "__main__":
    main()