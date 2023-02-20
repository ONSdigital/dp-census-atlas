import csv
import json
from pathlib import Path
import sys

from slugify import slugify


BASE_URL = "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/ESS"


def mkfilename(str) -> str:
    return str.lower().replace(" ", "_")


def get_output_name(str) -> str:
    return {
        "Boosting productivity, pay, jobs and living standards by growing the private sector": "Productivity, pay, jobs and living standards",
        "Spreading opportunity and improving public services": "Opportunities and public services",
    }[str]


if __name__ == "__main__":
    input_csv = Path(sys.argv[1])
    geotypes_json = Path(sys.argv[2])
    output = {}
    ess_vars_skeleton = []
    content_json_skeleton = {
        "content": ess_vars_skeleton
    }
    with open(geotypes_json, "r") as f:
        geotypes = json.load(f)

    for geotype, geocodes in geotypes.items():
        geotypes[geotype] = set(geocodes)

    with open(input_csv, "r", encoding="latin1") as f:
        reader = csv.DictReader(f)
        for row in reader:

            # append to output

            if not row["real"].isnumeric():
                continue

            id = mkfilename(row["id"])

            row_geotype = "unrecognised"
            for geotype, geocodes in geotypes.items():
                if row["unique"].upper() in geocodes:
                    row_geotype = geotype

            output_row = {
                "geography_code": row["unique"].upper(),
                id: row["real"]
            }

            if id in output:
                if row_geotype in output[id]:
                    output[id][row_geotype].append(output_row)
                else:
                    output[id][row_geotype] = [output_row]
            else:
                output[id] = {}
                output[id][row_geotype] = [output_row]

            # append to content json rough draft

            vg_name = row["Category"]
            vg_output_name = get_output_name(vg_name)

            # append variable group if not present
            vg_in_skeleton = next((vg for vg in ess_vars_skeleton if vg["name"] == vg_output_name), False)
            if not vg_in_skeleton:
                vg_in_skeleton = {
                    "name": vg_output_name,
                    "code": mkfilename(vg_output_name),
                    "slug": slugify(vg_output_name),
                    "desc": "",
                    "variables": [],
                }
                ess_vars_skeleton.append(vg_in_skeleton)

            # append variable if not present. NB one var / classification / cat for everything, so add multiple nestings
            # here!
            v_in_skeleton = next(
                (v for v in vg_in_skeleton["variables"] if v["name"] == row["Indicator"]), False)
            if not v_in_skeleton:
                v_in_skeleton = {
                    "name": row["Indicator"],
                    "slug": slugify(id),
                    "code": id,
                    "desc": row["Indicator"],
                    "long_desc": row["Indicator"],
                    "units": row["unit"],
                    "topic_code": "",
                    "base_url_2021": BASE_URL,
                    "classifications": [
                        {
                            "code": id,
                            "slug": slugify(id),
                            "desc": row["Indicator"],
                            "available_geotypes": [row_geotype] if row_geotype != "unrecognised" else [],
                            "choropleth_default": True,
                            "dot_density_default": True,
                            "categories": [
                                {
                                    "name": row["Indicator"],
                                    "slug": slugify(id),
                                    "code": id,
                                    "legend_str_1": f"of {row['Measure']} in {{location}}",
                                    "legend_str_2": "",
                                    "legend_str_3": "",
                                }
                            ]
                        }
                    ]
                }
                vg_in_skeleton["variables"].append(v_in_skeleton)

            # append row geotype to those for current classification if not present
            cls_in_skeleton = next((c for c in v_in_skeleton["classifications"] if c["code"] == id), False)
            if not row_geotype in v_in_skeleton["classifications"][0]["available_geotypes"] and row_geotype != "unrecognised":
                v_in_skeleton["classifications"][0]["available_geotypes"].append(row_geotype)

    with open("ess_content.json", "w") as f:
        json.dump(content_json_skeleton, f)
    try:
        for fn, contents in output.items():
            for geotype, geotype_contents in contents.items():
                output_filename = input_csv.parent.joinpath("ESS", geotype, f"{fn}.csv")
                output_filename.parent.mkdir(parents=True, exist_ok=True)
                with open(output_filename, "w") as f:
                    writer = csv.DictWriter(f, fieldnames=geotype_contents[0].keys())
                    writer.writeheader()
                    writer.writerows(geotype_contents)
    except:
        breakpoint()
