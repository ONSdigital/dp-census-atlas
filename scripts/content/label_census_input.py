import csv
import json
from pathlib import Path
import sys

if __name__ == "__main__":
    input_dir = Path(sys.argv[1])
    prefix_to_match = sys.argv[2]
    content_json = sys.argv[3]
    output_dir = input_dir.joinpath("relabelled")

    with open(content_json, "r") as f:
        content = json.load(f)
    classifications = []
    for vg in content["content"]:
        for v in vg["variables"]:
            classifications.extend(v["classifications"])

    for input_csv in input_dir.rglob("*.csv"):
        file_classification = input_csv.stem.split("_2011_2021_comparison")[0]

        for c in classifications:
            if file_classification.endswith(c["code"]):

                output_filename = output_dir.joinpath(input_csv.relative_to(input_dir))
                output_filename.parent.mkdir(parents=True, exist_ok=True)

                with open(input_csv) as fin, open(output_filename, "w") as fout:

                    reader = csv.reader(fin)
                    writer = csv.writer(fout)

                    header = next(reader)
                    for cat in c["categories"]:
                        for i, fieldname in enumerate(header):
                            if fieldname == prefix_to_match + cat["name"]:
                                header[i] = cat["code"]

                    writer.writerow(header)
                    writer.writerows(reader)
