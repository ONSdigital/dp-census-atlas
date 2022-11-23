#!/usr/bin/env python

"""
Split content.json file by variable.topic_code (rationale: releases are done by topic)
"""
from collections import defaultdict
from copy import deepcopy
from datetime import datetime
import json
from pathlib import Path
import sys

from scripts.census_objects import CensusVariableGroup, load_content, write_content
from scripts.filter_content_to_atlas_spec import clone_census_object

def split_content(all_variable_groups: list[CensusVariableGroup], releases_spec_file: str) -> dict:
    with open(releases_spec_file, "r") as f:
        atlas_releases = json.load(f)

    split_content = defaultdict(list)

    for release_name, release_content in atlas_releases.items():
        for variable_group in all_variable_groups:
            for variable in variable_group.variables:
                if variable.code in release_content:
                    # copy variable with only named classifications
                    cls_for_release = [c for c in variable.classifications if c.code in release_content[variable.code]["classifications"]]
                    var_to_add = clone_census_object(variable, classifications=cls_for_release)

                    # if variable group is already in split_content.release, add this variable to it
                    vg_in_split_content = next((vg for vg in split_content[release_name]), None)
                    if vg_in_split_content is not None:
                        vg_in_split_content.variables.append(var_to_add)

                    # else add variable group and this variable
                    else:
                        split_content[release_name].append(
                            CensusVariableGroup(
                                name=variable_group.name,
                                slug=variable_group.slug,
                                desc=variable_group.desc,
                                variables=[var_to_add],
                                _topic_codes = [],
                            )
                        )
    return split_content


def main():
    content_json_fn = Path(sys.argv[1])
    release_spec_fn = Path(sys.argv[2])

    content = load_content(content_json_fn)
    split_variable_groups = split_content(content["content"], release_spec_fn)

    # update meta
    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    meta = content["meta"]
    meta.update({
        "split_from_source_content_json_at": now,
        "source_content_json": content_json_fn.name,
    })

    # write
    for topic, topic_variable_groups in split_variable_groups.items():
        meta.update({"release": f"{topic}-{now}"})
        output_filename = content_json_fn.parent.joinpath(f"{topic}-{now}.json")
        output = {
            "meta": meta,
            "content": topic_variable_groups,
        }
        write_content(output, output_filename)

if __name__ == "__main__":
    main()