# env vars needed to run locally

export SKADAPTER=""
# allow override of these values with locally set ones
if [ -z ${VITE_GEODATA_BASE_URL+x} ]; then
export VITE_GEODATA_BASE_URL="https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/quads"
else
export VITE_GEODATA_BASE_URL=$VITE_GEODATA_BASE_URL
fi

if [ -z ${VITE_CONTENT_JSONS+x} ]; then
export VITE_CONTENT_JSONS='[
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2011-new-format-content.json"
]'
else
export VITE_CONTENT_JSONS=$VITE_CONTENT_JSONS
fi

export VITE_APP_BASE_PATH=""
