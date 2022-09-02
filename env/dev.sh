# env vars needed to run locally

export SKADAPTER=""
# allow override of these values with locally set ones
if [ -z $VITE_GEODATA_BASE_URL]; then
export VITE_GEODATA_BASE_URL="https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/newquads"
else
export VITE_GEODATA_BASE_URL=$VITE_GEODATA_BASE_URL
fi

if [ -z $VITE_CONTENT_JSONS]; then
export VITE_CONTENT_JSONS='[
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2011-TEST-PLACEHOLDER-VAR-DESCS-all-atlas-content-2022-09-02-11-58-45.json"
]'
else
export VITE_CONTENT_JSONS=$VITE_CONTENT_JSONS
fi

export VITE_APP_BASE_PATH=""
