
import csv
import json
import pathlib
import random
import string
import shutil
import tempfile

from unittest import TestCase
from unittest.mock import call, patch

import validate_content_json


class TestValidateContentJSON(TestCase):

    def setUp(self):
        self.maxDiff = None
        self.test_dir = tempfile.TemporaryDirectory()
        self.test_fn = "test.json"
        self.test_fp = pathlib.PurePath(self.test_dir.name, self.test_fn)

    def tearDown(self):
        shutil.rmtree(self.test_dir.name)

    def write_test_JSON(self, test_json):
        with open(self.test_fp, 'w') as f:
            json.dump(test_json, f, indent=2)

    def generate_valid_codes(self, n):
        output = []
        for _ in range(n):
            output.append(''.join(random.choices(string.ascii_uppercase + string.digits, k=11)))
        return output

    @patch('validate_content_json.check_requestable_code')
    def test_content_csv_to_json_OK_one_topic_no_subcategories(self, mock_requestable_code):
        # GIVEN we have written a csv with one topic and two classifications, each with two categories and one total
        valid_codes = self.generate_valid_codes(6)
        self.write_test_JSON({
            "meta": {
                "source": self.test_fn
            },
            "content": [
                {
                    "code": "1",
                    "name": "Topic 1",
                    "slug": "topic-1",
                    "desc": "Topic 1 desc.",
                    "display_taxonomy": "topic",
                    "classifications": [
                        {
                            "code": "1_1",
                            "name": "Class 1_1",
                            "slug": "class-1-1",
                            "desc": "Class 1_1 desc.",
                            "units": "units_1",
                            "display_taxonomy": "category",
                            "total": {
                                "code": valid_codes[0],
                                "name": "Cat 1_1_0001",
                                "slug": "cat-1-1-0001",
                                "desc": "Cat 1_1_0001 desc.",
                                "display_taxonomy": "subject",
                            },
                            "categories": [
                                {
                                    "code": valid_codes[1],
                                    "name": "Cat 1_1_0002",
                                    "slug": "cat-1-1-0002",
                                    "desc": "Cat 1_1_0002 desc.",
                                    "display_taxonomy": "subject",
                                },
                                {
                                    "code": valid_codes[2],
                                    "name": "Cat 1_1_0003",
                                    "slug": "cat-1-1-0003",
                                    "desc": "Cat 1_1_0003 desc.",
                                    "display_taxonomy": "subject"
                                },
                            ]
                        },
                        {
                            "code": "1_2",
                            "name": "Class 1_2",
                            "slug": "class-1-2",
                            "desc": "Class 1_2 desc.",
                            "units": "units_2",
                            "display_taxonomy": "category",
                            "total": {
                                "code": valid_codes[3],
                                "name": "Cat 1_2_0001",
                                "slug": "cat-1-2-0001",
                                "desc": "Cat 1_2_0001 desc.",
                                "display_taxonomy": "subject",
                            },
                            "categories": [
                                {
                                    "code": valid_codes[4],
                                    "name": "Cat 1_2_0002",
                                    "slug": "cat-1-2-0002",
                                    "desc": "Cat 1_2_0002 desc.",
                                    "display_taxonomy": "subject",
                                },
                                {
                                    "code": valid_codes[5],
                                    "name": "Cat 1_2_0003",
                                    "slug": "cat-1-2-0003",
                                    "desc": "Cat 1_2_0003 desc.",
                                    "display_taxonomy": "subject"
                                },
                            ]
                        },
                    ]
                }
            ]
        })
       
        # WHEN we run the validation function
        validate_content_json.main(self.test_fp)

        # THEN we expect out mock to have been called with all the codes in the above json
        self.assertEqual(mock_requestable_code.call_count, len(valid_codes)) 
        for code in valid_codes:
            mock_requestable_code.assert_any_call(code)
            