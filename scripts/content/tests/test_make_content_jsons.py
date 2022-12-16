from freezegun import freeze_time
import json
from pathlib import Path
from tempfile import TemporaryDirectory

from make_content_jsons import main as make_content_jsons


def all_json_in_dir(dir: str) -> dict[str, dict]:
    all_json = {}
    for json_fn in Path(dir).glob("*.json"):
        with open(json_fn, "r") as f:
            json_contents = json.load(f)
        all_json[json_fn.stem] = json_contents
    return all_json


@freeze_time("2022-12-13 13:01:53")
def test_make_content_jsons_regression():
    with TemporaryDirectory() as test_dir:
        make_content_jsons("tests/fixtures/test-content-spec.json",
                           "tests/fixtures/test_input_metadata_files", test_dir)
        expected_json = all_json_in_dir("tests/fixtures/expected_output_content_jsons")
        returned_json = all_json_in_dir(test_dir)

    for json_nm, expected_json_content in expected_json.items():
        assert returned_json[json_nm] == expected_json_content
