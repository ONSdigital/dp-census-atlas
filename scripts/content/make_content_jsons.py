import json
from os import makedirs
from pathlib import Path
import sys

from models.content import content_from_spec_and_metadata
from models.variable_group import CensusVariableGroup


def validate_variable_groups(variable_groups: list[CensusVariableGroup]) -> bool:
    return all([vg.is_valid() for vg in variable_groups])


def main(spec_fn: str, input_metadata_files_dir: str, output_dir: str):
    with open(spec_fn, "r") as f:
        spec = json.load(f)

    # get content from spec spec metadata
    print(f"Building maps content based on cantabular metadata from {spec['cantabular_metadata_dir']}...")
    content_iterations = content_from_spec_and_metadata(spec, input_metadata_files_dir)
    print("... done.")

    # validate content
    print("validating maps content...")
    for content in content_iterations:
        print(f"validating {content.content_json}")
        validate_variable_groups(content.content)
    print("... done.")

    # output
    output_dir_path = Path(output_dir)
    makedirs(output_dir_path, exist_ok=True)
    print(f"Writing content jsons to {output_dir_path}...")
    for content in content_iterations:
        print(f"Writing {content.content_json}...")
        content.to_content_json_file(output_dir_path)
    print("... done.")


if __name__ == "__main__":
    spec_fn = sys.argv[1]
    if len(sys.argv) > 2:
        input_metadata_file_dir = sys.argv[2]
    else:
        input_metadata_file_dir = "input_metadata_files"
    if len(sys.argv) > 3:
        output_dir = sys.argv[3]
    else:
        output_dir = "output_content_jsons"
    main(spec_fn, input_metadata_file_dir, output_dir)
