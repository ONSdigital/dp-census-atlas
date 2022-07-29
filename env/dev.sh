# env vars needed to run locally / on netlify

export SKADAPTER=""
export VITE_GEODATA_BASE_URL="https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/quads"
export VITE_CONTENT_JSONS='[
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/population-content.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/education-content.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/housing-content.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/work-content.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/health-content-pt1.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/health-content-pt2.json",
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/identity-content.json"
]'
export VITE_APP_BASE_PATH=""
