import csv
import json
from pathlib import Path
import sys

CSV_FILENAME_SUFFIX = "_2011_2021_comparison"

if __name__ == "__main__":

    # setup in/out paths
    input_dir = Path(sys.argv[1])
    prefix_to_match = sys.argv[2]
    content_json = sys.argv[3]
    output_dir = input_dir.parent.joinpath(f"{input_dir.name}-relabelled")
    issues_dir = input_dir.parent.joinpath(f"{input_dir.name}-relabelled_with_issues")

    # load all classifications from content json
    with open(content_json, "r") as f:
        content = json.load(f)
    classifications = []
    for vg in content["content"]:
        for v in vg["variables"]:
            classifications.extend(v["classifications"])

    # iterate through all csv in input_dir
    n_files = 0
    unmatched_files = []
    successfully_processed_files = []
    partially_processed_files = []

    for input_csv in input_dir.rglob("*.csv"):
        n_files += 1
        print(f"\nRelabelling classification fields in {input_csv}...")

        # assume the csv filename is of form "{classification}{CSV_FILENAME_SUFFIX}{xxx}.csv"
        file_classification = input_csv.stem.split(CSV_FILENAME_SUFFIX)[0]

        # check for a classification from content json that matches the classification assumed to be in the filename
        matched_cls = next(
            (c for c in classifications if file_classification.lower().endswith(c["code"].lower())), False)
        if not matched_cls:
            unmatched_files.append(input_csv)
            print(f"\n!! No matching classification found for {input_csv}! Skipping!!\n")
            continue
        print(f"Classification {matched_cls['code']} matched with {input_csv}")

        # if matching classification found, read header from csv file and check for string matches for each category.
        with open(input_csv) as fin:
            reader = csv.reader(fin)
            header = next(reader)

            all_cats = set(c["name"] for c in matched_cls["categories"])
            matched_cats = set()
            for cat in matched_cls["categories"]:
                for i, fieldname in enumerate(header):
                    # replace field in header with category code if category name matches "{prefix_to_match}{category_name}"
                    if fieldname.lower() == f"{prefix_to_match}{cat['name']}".lower():
                        header[i] = cat["code"]
                        matched_cats.add(cat["name"])
                        print(
                            f"{input_csv}: relabelling {fieldname} to {cat['code']}. {len(matched_cats)} of {len(all_cats)} categories matched.")

            if matched_cats != all_cats:
                # Save file to relabelled_with_issues if any categories could not be matched
                partially_processed_files.append(input_csv)
                print(f"\n!!Only {len(matched_cats)} of {len(all_cats)} categories matched for {input_csv}!!")
                unmatched_cats = all_cats.difference(matched_cats)
                for uc in unmatched_cats:
                    print(f"category {uc} could not be matched")
                output_filename = issues_dir.joinpath(input_csv.relative_to(input_dir))
            else:
                successfully_processed_files.append(input_csv)
                # otherwise save file to relabelled
                output_filename = output_dir.joinpath(input_csv.relative_to(input_dir))

            output_filename.parent.mkdir(parents=True, exist_ok=True)
            with open(output_filename, "w") as fout:
                writer = csv.writer(fout)
                writer.writerow(header)
                writer.writerows(reader)

    # final report
    print("\nAll finished!\n")
    if len(unmatched_files) > 0:
        print(f"{len(unmatched_files)}/{n_files} files could not be matched to classifications from {content_json} (skipped):")
        for uf in unmatched_files:
            print(uf)
        print("\n")
    if len(successfully_processed_files) > 0:
        print(f"{len(successfully_processed_files)}/{n_files} files succesfully processed (written to {output_dir}):")
        for spf in successfully_processed_files:
            print(spf)
        print("\n")
    if len(partially_processed_files) > 0:
        print(f"{len(partially_processed_files)}/{n_files} files only partially processed (see above for details, written to {issues_dir}).:")
        for ppf in partially_processed_files:
            print(ppf)
