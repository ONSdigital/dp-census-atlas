import csv
import json
import os
import pathlib
import shutil
import tempfile

from unittest import TestCase

import content_csv_to_json


class TestContentCsvToJson(TestCase):

    def setUp(self):
        self.maxDiff = None
        self.test_dir = tempfile.TemporaryDirectory()
        self.test_fn = "test.csv"
        self.test_fp = pathlib.PurePath(self.test_dir.name, self.test_fn)

    def tearDown(self):
        shutil.rmtree(self.test_dir.name)

    def write_test_CSV(self, csvRowList):
        with open(self.test_fp, 'w') as f:
            writer = csv.writer(f)
            writer.writerows(csvRowList)

    def read_test_JSON(self):
        with open(self.test_fp.with_suffix(".content.json"), 'r') as f:
            json_contents = json.load(f)
        return json_contents


    def test_content_csv_to_json_OK_one_topic_no_subcategories(self):
        # GIVEN we have written a csv with one topic and two tables, each with two categories and one total
        self.write_test_CSV([
            ["code","taxonomy","display taxonomy","name","desc","units", "Data percentage component 1", 
            "Data percentage component 2","Data percentage component 3"],
            ["", "topic","topic", "Topic 1", "Topic 1 desc.", "", "", "", ""],
            ["1_1", "variable","category", "Class 1_1", "Class 1_1 desc.", "units_1", "", "", ""],
            ["1_1_0001", "category","subject", "Cat 1_1_0001", "Cat 1_1_0001 desc.", "", "", "", ""],
            ["1_1_0002", "category","subject", "Cat 1_1_0002", "Cat 1_1_0002 desc.", "", "dpc1_1_1_2", "dpc2_1_1_2",
            "dpc3_1_1_2"],
            ["1_1_0003", "category","subject", "Cat 1_1_0003", "Cat 1_1_0003 desc.", "", "dpc1_1_1_3", "dpc2_1_1_3",
            "dpc3_1_1_3"],
            ["1_2", "variable","category", "Class 1_2", "Class 1_2 desc.", "units_2", "", "", ""],
            ["1_2_0001", "category","subject", "Cat 1_2_0001", "Cat 1_2_0001 desc.", "", "", "", ""],
            ["1_2_0002", "category","subject", "Cat 1_2_0002", "Cat 1_2_0002 desc.", "", "dpc1_1_2_2", "dpc2_1_2_2",
            "dpc3_1_2_2"],
            ["1_2_0003", "category","subject", "Cat 1_2_0003", "Cat 1_2_0003 desc.", "", "dpc1_1_2_3", "dpc2_1_2_3",
            "dpc3_1_2_3"],
        ])
       
        # WHEN we run the content_csv_to_json script
        os.system(f"./content_csv_to_json.py {self.test_fp} --no-metadata")

        # THEN we expect to get a properly formatted JSON back
        expected = [
            {
                "name": "Topic 1",
                "slug": "topic-1",
                "desc": "Topic 1 desc.",
                "variables": [
                    {
                        "code": "1_1",
                        "name": "Class 1_1",
                        "slug": "class-1-1",
                        "desc": "Class 1_1 desc.",
                        "units": "units_1",
                        "total": {
                            "code": "1_1_0001",
                            "name": "Cat 1_1_0001",
                            "slug": "cat-1-1-0001",
                        },
                        "categories": [
                            {
                                "code": "1_1_0002",
                                "name": "Cat 1_1_0002",
                                "slug": "cat-1-1-0002",
                                "desc": "Cat 1_1_0002 desc.",
                                "category_h_pt1": "dpc1_1_1_2",
                                "category_h_pt2": "dpc2_1_1_2",
                                "category_h_pt3": "dpc3_1_1_2",
                            },
                            {
                                "code": "1_1_0003",
                                "name": "Cat 1_1_0003",
                                "slug": "cat-1-1-0003",
                                "desc": "Cat 1_1_0003 desc.",
                                "category_h_pt1": "dpc1_1_1_3",
                                "category_h_pt2": "dpc2_1_1_3",
                                "category_h_pt3": "dpc3_1_1_3",
                            },
                        ]
                    },
                    {
                        "code": "1_2",
                        "name": "Class 1_2",
                        "slug": "class-1-2",
                        "desc": "Class 1_2 desc.",
                        "units": "units_2",
                        "total": {
                            "code": "1_2_0001",
                            "name": "Cat 1_2_0001",
                            "slug": "cat-1-2-0001"
                        },
                        "categories": [
                            {
                                "code": "1_2_0002",
                                "name": "Cat 1_2_0002",
                                "slug": "cat-1-2-0002",
                                "desc": "Cat 1_2_0002 desc.",
                                "category_h_pt1": "dpc1_1_2_2",
                                "category_h_pt2": "dpc2_1_2_2",
                                "category_h_pt3": "dpc3_1_2_2",
                            },
                            {
                                "code": "1_2_0003",
                                "name": "Cat 1_2_0003",
                                "slug": "cat-1-2-0003",
                                "desc": "Cat 1_2_0003 desc.",
                                "category_h_pt1": "dpc1_1_2_3",
                                "category_h_pt2": "dpc2_1_2_3",
                                "category_h_pt3": "dpc3_1_2_3",
                            },
                        ]
                    },
                ]
            }
        ]

        returned = self.read_test_JSON()
        print(returned)
        self.assertEqual(expected, returned)
