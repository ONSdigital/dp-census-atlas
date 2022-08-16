# env vars needed to build for ONS publishing env

export SKADAPTER="node"
export VITE_GEODATA_BASE_URL="this will need to be: <publishing atlas url>/files-proxy/<path to data files>"
export VITE_CONTENT_JSONS='[
    "this will need to be: <publishing atlas url>/files-proxy/<path to config jsons>"
]'
export VITE_APP_BASE_PATH="/census-atlas"
export VITE_IS_PUBLISHING="true"
export VITE_PUBLISHING_DOWNLOAD_URL="this will need to be: <publishing API url>/v1/downloads-new"