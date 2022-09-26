#!/usr/bin/env python
from datetime import datetime
from pathlib import Path
import sys

from census_objects import load_content, write_content

MAX_L = 250
LOREM_IPSUM_250 = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium."

def main():
    content_json_fn = Path(sys.argv[1])
    content = load_content(content_json_fn)
 
    now = datetime.now().strftime("%Y-%m-%d%Z%H-%M-%S")
    content["meta"].update({
        "placeholder_variable_descs_inserted_at": now
    })

    for variable_group in content["content"]:
        for variable in variable_group.variables:
            if ("\n" in variable.desc) or len(variable.desc) > MAX_L:
                variable.desc = LOREM_IPSUM_250

    output_filename = content_json_fn.parent.joinpath(f"PLACEHOLDER-VAR-DESCS-{content_json_fn.stem}.json")
    write_content(content, output_filename)

if __name__=="__main__":
    main()