# env vars needed to build for ONS envs

export SKADAPTER="node"
export VITE_GEODATA_BASE_URL="https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/newquads"
export VITE_CONTENT_JSONS='[
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2011-new-format-content.json"
]'
export VITE_APP_BASE_PATH="/census-atlas"