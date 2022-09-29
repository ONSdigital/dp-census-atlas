#!/usr/bin/env python

"""
Split content.json file by variable.topic_code (rationale: releases are done by topic) 
"""

from datetime import datetime
from pathlib import Path
import sys

from census_objects import CensusVariableGroup, load_content, write_content


def main():
    content_json_fn = Path(sys.argv[1])
   
    content = load_content(content_json_fn)

    # split content
    split_content = {}

    for variable_group in content["content"]:
        for variable in variable_group.variables:
            
            # add topic_code to split_content if not present already
            if variable.topic_code not in split_content:
                split_content[variable.topic_code] = []
            
            # if variable group is already in split_content.topic_code, add this variable to it
            vg_in_split_content = next((vg for vg in split_content[variable.topic_code]), None)
            if vg_in_split_content is not None:
                vg_in_split_content.variables.append(variable)
            
            # else add variable group and this variable
            else:
                split_content[variable.topic_code].append(
                    CensusVariableGroup(
                        name=variable_group.name,
                        slug=variable_group.slug,
                        desc=variable_group.desc,
                        variables=[variable],
                        _topic_codes = [],
                    )
                )
            
    # update meta
    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    meta = content["meta"]
    meta.update({
        "split_from_source_content_json_at": now,
        "source_content_json": content_json_fn.name,
    })

    # write
    for topic, topic_content in split_content.items():
        meta.update({"release": f"{topic}-{now}"})
        output_filename = content_json_fn.parent.joinpath(f"{topic}-{now}.json")
        output = {
            "meta": meta,
            "content": topic_content,
        }
        write_content(output, output_filename)

if __name__ == "__main__":
    main()