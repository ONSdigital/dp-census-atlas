#!/usr/bin/env bash
JSON_DIR="../../src/data/staticContentJsons"
# scrape the timestamp from the first content json (assumed to be on third line)
created_at=$(head -3 ${JSON_DIR}/2021-MASTER.json | tail -1 | cut -d \" -f 4)

# MASTER goes in the censusmapsmasterconfig visualisation
echo "Zipping MASTER for censusmapsmasterconfig visualisation"
pushd $JSON_DIR > /dev/null
    zipname="censusmapsmasterconfig-${created_at}.zip"
    (zip "$zipname" \
        2021-MASTER.json > /dev/null 2>&1 \
        && mv "$zipname" $OLDPWD) > /dev/null 2>&1 \
        || echo "censusmapsmasterconfig content not found, skipping.."
popd > /dev/null

# DEM, MIG, ARM and EILR go in the censusmapsconfig visualisation
echo "Zipping DEM, MIG, ARM and EILR for censusmapsconfig visualisation"
pushd $JSON_DIR > /dev/null
    zipname="censusmapsconfig-${created_at}.zip"
    (zip "$zipname" \
        2021-DEM.json \
        2021-MIG.json \
        2021-ARM.json \
        2021-EILR.json > /dev/null 2>&1 \
        && mv "$zipname" $OLDPWD) > /dev/null 2>&1 \
        || echo "censusmapsmasterconfig content not found, skipping.."
popd > /dev/null

# LAB, TTW and WELSH-SKILLS go in the censusmapsconfiglab visualisation
echo "Zipping LAB, TTW, and WELSH-SKILLS for censusmapsconfiglab visualisation"
pushd $JSON_DIR > /dev/null
    zipname="censusmapsconfiglab-${created_at}.zip"
    (zip "$zipname" \
        2021-LAB.json \
        2021-TTW.json \
        2021-WELSH-SKILLS.json > /dev/null 2>&1 \
        && mv "$zipname" $OLDPWD) > /dev/null 2>&1 \
        || echo "censusmapsconfiglab content not found, skipping.."
popd > /dev/null

# HOU goes in the censusmapsconfighou visualisation
echo "Zipping HOU for censusmapsconfighou visualisation"
pushd $JSON_DIR > /dev/null
    zipname="censusmapsconfighou-${created_at}.zip"
    (zip "$zipname" \
        2021-HOU.json > /dev/null 2>&1 \
        && mv "$zipname" $OLDPWD) > /dev/null 2>&1  \
        || echo "censusmapsconfighou content not found, skipping.."
popd > /dev/null

# SOGI goes in the censusmapsconfigsogi visualisation
echo "Zipping SOGI for censusmapsconfigsogi visualisation"
pushd $JSON_DIR > /dev/null
    zipname="censusmapsconfigsogi-${created_at}.zip"
    (zip "$zipname" \
        2021-SOGI.json > /dev/null 2>&1 \
        && mv "$zipname" $OLDPWD) > /dev/null 2>&1 \
        || echo "censusmapsconfigsogi content not found, skipping.."
popd > /dev/null

# EDU goes in the censusmapsconfigedu visualisation
echo "Zipping EDU for censusmapsconfigedu visualisation"
pushd $JSON_DIR > /dev/null
    zipname="censusmapsconfigedu-${created_at}.zip"
    (zip "$zipname" \
        2021-EDU.json > /dev/null 2>&1 \
        && mv "$zipname" $OLDPWD) > /dev/null 2>&1 \
        || echo "censusmapsconfigedu content not found, skipping.."
popd > /dev/null

# HUC goes in the censusmapsconfighuc2 visualisation
echo "Zipping HUC for censusmapsconfighuc2 visualisation"
pushd $JSON_DIR > /dev/null
    zipname="censusmapsconfighuc2-${created_at}.zip"
    (zip "$zipname" \
        2021-HUC.json > /dev/null 2>&1 \
        && mv "$zipname" $OLDPWD) > /dev/null 2>&1 \
        || echo "censusmapsconfighuc2 content not found, skipping.."
popd > /dev/null