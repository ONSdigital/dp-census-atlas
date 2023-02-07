import csv
from dataclasses import dataclass
from datetime import datetime
import json
from pathlib import Path

from models.category import categories_from_metadata
from models.classification import classifications_from_metadata
from models.variable import variables_from_metadata
from models.variable_group import CensusVariableGroup, variable_group_from_content_json, variable_groups_from_spec


@dataclass
class CensusContent:
    content_json: str
    meta: dict
    content: list[CensusVariableGroup]

    def to_content_json_file(self, output_dir: Path) -> None:
        """Write content to json file."""
        output_fn = output_dir.joinpath(f"{self.content_json}.json")
        with open(output_fn, "w") as f:
            json.dump({
                "meta": self.meta,
                "content": [c.to_jsonable() for c in self.content]
            }, f, indent=2)


def content_from_content_json_file(content_file: str) -> CensusContent:
    """Make CensusContent a content.json file"""
    with open(content_file, "r") as f:
        raw_content = json.load(f)
    return CensusContent(
        meta=raw_content["meta"],
        content=[variable_group_from_content_json(tg) for tg in raw_content["content"]]
    )


def content_from_spec_and_metadata(spec: dict, input_metadata_files_dir: str) -> list[CensusContent]:
    """Make CensusContent's according to spec dict and other metadata"""
    # set metadata paths
    metadata_dir_path = Path(input_metadata_files_dir)
    cantabular_metadata_full_path = metadata_dir_path.joinpath(spec["cantabular_metadata_dir"])

    # build content from csv files in cantabular_metadata_dir and append extra metadata
    categories = categories_from_metadata(cantabular_metadata_full_path.joinpath(
        "Category.csv"), metadata_dir_path.joinpath("category_legend_strings.csv"))
    classifications = classifications_from_metadata(
        cantabular_metadata_full_path.joinpath("Classification.csv"),
        metadata_dir_path.joinpath("variable_map_type_default_classifications.csv"),
        metadata_dir_path.joinpath("classification_data_downloads.csv"),
        metadata_dir_path.joinpath("classification_data_available_geotypes.csv"),
    )
    variables = variables_from_metadata(
        cantabular_metadata_full_path.joinpath("Variable.csv"),
        metadata_dir_path.joinpath("variable_short_descriptions.csv"),
        metadata_dir_path.joinpath("variable_caveats.csv"),
        metadata_dir_path.joinpath("variable_tile_data_base_urls.csv")
    )

    # build content from spec
    now = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    all_content = []

    # cycle through and produce content for all content json referenced in spec
    for content_json_name, content_json_spec in spec["content_json"].items():
        print(f"building {content_json_name}")
        meta = {
            "created_at": now,
            "release": f"{content_json_name}-{spec['cantabular_metadata_dir']}",
        }
        additional_content_jsons = content_json_spec.get("additional_content_jsons", [])
        if additional_content_jsons:
            meta["additional_content_jsons"] = additional_content_jsons
        all_content.append(
            CensusContent(
                content_json=content_json_name,
                meta=meta,
                content=variable_groups_from_spec(content_json_spec["content"], variables, classifications, categories)
            )
        )

    return all_content
