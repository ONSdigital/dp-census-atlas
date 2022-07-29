# env vars needed to build for ONS sandbox env

export SKADAPTER="node"
export VITE_GEODATA_BASE_URL="https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/quads"
export VITE_CONTENT_JSONS='[
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/population-content.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/education-content.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/housing-content.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/work-content.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/health-content.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/identity-content.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/does-not-exist.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/quads/lad/ew/KS103EW0002.csv"
]'
export VITE_APP_BASE_PATH="/census-atlas"
