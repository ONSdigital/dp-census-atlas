import json
from pathlib import Path
import pytest
from re import L
from shutil import rmtree
from tempfile import mkdtemp
from unittest import TestCase

from make_atlas_content_jsons import main as make_atlas_content_jsons


@pytest.fixture(scope="module")
def output_dir():
    output_dir = mkdtemp()
    yield output_dir
    rmtree(output_dir, ignore_errors=True)


def test_make_atlas_content_jsons(output_dir):
    # GIVEN a pre-baked set of test input files
    test_workbook = Path("tests/test_metadata_files/test_output_category_mapping.xlsx").absolute()
    test_topic_meta = Path("tests/test_metadata_files/test_topic_cantabular_metadata.csv").absolute()
    test_variable_meta = Path("tests/test_metadata_files/test_variable_cantabular_metadata.csv").absolute()
    test_classification_meta = Path("tests/test_metadata_files/test_classification_cantabular_metadata.csv").absolute()
    # WHEN we invoke the main function of make_atlas_content_jsons using our test files, outputting to a test dir
    make_atlas_content_jsons(test_workbook, test_topic_meta, test_variable_meta, test_classification_meta, output_dir)

    # THEN we expect there to be two files in the output_dir, one for each release
    assert Path(output_dir).joinpath("test_release_1-content.json").exists()
    assert Path(output_dir).joinpath("test_release_2-content.json").exists()

    # AND THEN we expect the content for each to match the expected content
    for file_to_test in ("test_release_1-content.json", "test_release_2-content.json"):
        with open(Path("tests/expected_output").joinpath(file_to_test), "r") as f:
            expected = json.load(f)
        with open(Path(output_dir).joinpath(file_to_test), "r") as f:
            output = json.load(f)
        
        assert output == expected