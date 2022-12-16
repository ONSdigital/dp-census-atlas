#!/usr/bin/env bash

# scrape the timestamp from the first content json (assumed to be on third line)
created_at=$(head -3 output_content_jsons/2021-ARM.json | tail -1 | cut -d \" -f 4)

# DEM, MIG, ARM and EILR go in the censusmapsconfig visualisation
echo "Zipping DEM, MIG, ARM and EILR for censusmapsconfig visualisation"
pushd output_content_jsons
    zipname="censusmapsconfig-${created_at}.zip"
    zip "$zipname" \
        2021-DEM.json \
        2021-MIG.json \
        2021-ARM.json \
        2021-EILR.json \
        && mv "$zipname" ..
popd

# LAB, TTW and WELSH-SKILLS go in the censusmapsconfiglab visualisation
echo "Zipping HOU for censusmapsconfighou visualisation"
pushd output_content_jsons
    zipname="censusmapsconfiglab-${created_at}.zip"
    zip "$zipname" \
        2021-LAB.json \
        2021-TTW.json \
        2021-WELSH-SKILLS.json \
        && mv "$zipname" ..
popd

# HOU goes in the censusmapsconfighou visualisation
echo "Zipping HOU for censusmapsconfighou visualisation"
pushd output_content_jsons
    zipname="censusmapsconfighou-${created_at}.zip"
    zip "$zipname" \
        2021-HOU.json \
        && mv "$zipname" ..
popd

# SOGI goes in the censusmapsconfigsogi visualisation
echo "Zipping HOU for censusmapsconfighou visualisation"
pushd output_content_jsons
    zipname="censusmapsconfigsogi-${created_at}.zip"
    zip "$zipname" \
        2021-SOGI.json \
        && mv "$zipname" ..
popd