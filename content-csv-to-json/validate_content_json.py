#!/usr/bin/env python

import json
import pathlib
import sys
import urllib.request


BASE_URL = "https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev/query/2011?cols={}&rows=all&geotype=LAD"

CODES_WITH_ERRORS = []

def content_crawler(content):
    # if list, feed all into self
    if isinstance(content, list):
        for nested_content in content:
            content_crawler(nested_content)
    else:
        for k, v in content.items():
            
            # if dict, feed single into self
            if isinstance(v, dict):
                content_crawler(v)
            
            # if list, feed all into self
            elif isinstance(v, list):
                for nested_content in v:
                    content_crawler(nested_content)
            
            # if single value, check
            elif is_requestable_code(k, v):
                if not check_requestable_code(v):
                    CODES_WITH_ERRORS.append(v)


def is_requestable_code(key, value):
    return key == "code" and len(value) == 11


def check_requestable_code(code):
    print(".", end = '', flush=True)
    request_url = BASE_URL.format(code)
    resp = urllib.request.urlopen(request_url)
    if resp.status != 200:
        return False
    return True


def main(fp):
    # load JSON
    with open(fp) as f:
        content_json = json.load(f)

    # crawl through all categories, sub-categories and totals
    print("Checking all census data codes are available from API", end = '', flush=True)
    content_crawler(content_json)

    # report
    print("")
    if len(CODES_WITH_ERRORS) > 0:
        print(f"These census data codes returnd non-200 status when requested from the API: {CODES_WITH_ERRORS}")
    else:
        print("All census data codes in the content JSON were found on the API.")

if __name__=="__main__":
    fp = pathlib.PurePath(sys.argv[1])
    main(fp)