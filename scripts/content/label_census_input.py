import csv
import json
from pathlib import Path
import sys

if __name__ == "__main__":
    input_dir = Path(sys.argv[1])
    prefix_to_match = sys.argv[2]
    content_json = sys.argv[3]
    output_dir = input_dir.parent.joinpath("relabelled")
    issues_dir = input_dir.parent.joinpath("relabelled_with_issues")
    with open(content_json, "r") as f:
        content = json.load(f)
    classifications = []
    for vg in content["content"]:
        for v in vg["variables"]:
            classifications.extend(v["classifications"])

    for input_csv in input_dir.rglob("*.csv"):
        print(f"Relabelling fields in {input_csv}...")
        file_classification = input_csv.stem.split("_2011_2021_comparison")[0]

        issues_found = False

        with open(input_csv) as fin:
            reader = csv.reader(fin)
            header = next(reader)

            matched_cls = next(
                (c for c in classifications if file_classification.lower().endswith(c["code"].lower())), False)
            if not matched_cls:
                issues_found = True
                print(f"No matching classification found for {input_csv}! Skipping")
                continue
            print(f"Classification {matched_cls['code']} matched with {input_csv}")
            matched_cats = 0
            for cat in matched_cls["categories"]:
                for i, fieldname in enumerate(header):
                    if fieldname.lower() == f"{prefix_to_match}{cat['name']}".lower():
                        header[i] = cat["code"]
                        matched_cats += 1
                        print(
                            f"{input_csv}: relabelling {fieldname} to {cat['code']}. {matched_cats} of {len(matched_cls['categories'])} found.")
            if matched_cats != len(matched_cls["categories"]):
                issues_found = True
                print(f"Only {matched_cats} of {len(matched_cls['categories'])} found for {input_csv}")

            output_filename = output_dir.joinpath(input_csv.relative_to(input_dir))

            if issues_found:
                output_filename = issues_dir.joinpath(input_csv.relative_to(input_dir))
            output_filename.parent.mkdir(parents=True, exist_ok=True)

            with open(output_filename, "w") as fout:
                writer = csv.writer(fout)
                writer.writerow(header)
                writer.writerows(reader)
