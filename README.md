# Census maps (né Atlas)

Explore neighbourhood-level Census data on a map.

## State ownership

In this app, there are three possible 'owners' of state:

- The URL (app state)
- Map instance (transitory map state, eg the exact zoom and position)
- Svelte components (transistory, local UI state, eg whether a modal is open)

All _important_ state flows in one direction from the URL to the UI. This enables link sharing and makes apps work properly on the web.

- When a URL is shared, the app opens in the same state as when it was shared _in every important way_
- The Back (and Forward) buttons work correctly
- Embedding is a special case of sharing - the URL needs to contain all the relevant parameters to show the embeddable content

## URL structure

    /population/sex/sex/female              ? msoa=E02006827
                  |                                |
                  |                                |
    /topic/variable/classification/category ? geotype=geocode
                  |                                |
          `path` picks a node                `query` selects
          in the content tree                 the geography
                                            (and embed parameters, not shown)

## Develop

    npm install
    npm run dev

> If you need to use locally-served content.json files (e.g. to test new or sensitive content metadata without hosting it on s3), you can serve all files found in content content_jsons on localhost:8090 using `npm run serve-local-content-jsons`, and set the dev version of the app to look for them by exporting the env var VITE_CONTENT_JSONS to a JSON string array referencing the content json(s) you want the local app to use, e.g. `export VITE_CONTENT_JSONS='["http://localhost:8090/MY_TEST_CONTENT.json"]' && npm run dev`. This will override the value for VITE_CONTENT_JSONS set in `env/dev.sh`.

## Test

    npm run test   # run unit tests
    npm run e2e    # run UI tests (needs npm run dev first)

## Releases

See the general [DP release process](https://github.com/ONSdigital/dp/blob/main/guides/RELEASES.md), but here are the specific steps for this app:

- see existing releases <https://github.com/ONSdigital/dp-census-atlas/releases> and choose the next release name (if the latest `1.14.0`, the next will be `1.15.0`)
- ensure your `develop` is up-to-date `git checkout develop`, `git pull`
- create a 'release branch' from `develop` with an incremented release number `git checkout -b release/0.0.0` and push to Github
- go to <https://github.com/ONSdigital/dp-census-atlas/branches> and make a PR with a base of `master`
- add a list of changes (release notes) to the description (scan through the commit messages!)
- get the PR approved
- ensure your `master` is up-to-date - `git checkout master`, `git pull`
- merge the release into `master` - `git merge --no-ff release/0.0.0`
- tag the release `git tag -s v0.0.0` and paste in the release notes here too to 'annotate' the tag
- push the release `git push --follow-tags`
- go to <https://github.com/ONSdigital/dp-census-atlas/releases> and 'Draft a new release'
- choose the tag
- add a release title `Release 0.0.0`
- paste in release notes again!
- click 'Publish release'
- go to Concourse
- wait for release to go green
- in 'production-ship-it', trigger a new build
- optionally, go to `#cache` and say `clear cache for https://www.ons.gov.uk/census/maps`

## Content.json

The `content.json` files list the census data that the app will show, and contain metadata (labels etc) for that content.

These are generated from ONS metadata files by python scripts in the `content` directory found in the project root. See `content/README.md` for more details.

## Data

Data is hosted in three 'flat file APIs' - that is, sets of files hosted on S3.

> Note: the data structures returned by the APIs could be simplified slightly - the output has been kept compatible with the earlier dynamic Go API.

### 'Data' API

- Get the values for a category, for all the areas in one 'tile'.
- E.g. `atlas/data/msoa/127-84-8/QS501EW0002.csv`

When the user selects a category, like `education > qualifications > no qualifications`, we need to know the percentage of people who have no qualifications in all of the areas we're currently looking at. If we were looking near Oxford, we'd load a CSV file for any/all of the tiles in the viewport.

This API retrieves the values for the specified category, for all of the areas in the _tile_. We define our own tiles, by breaking up the country into smaller or larger rectangles according to population density. There's a tile set for each significant zoom level (i.e., for each geotype).

> At the top (LAD) level, there's just one tile, covering the whole of England & Wales.

Example data:

    geography_code,QS501EW0002
    ...
    E07000177,0.19688
    E07000178,0.13641   <--- 13.6% of people in Oxford LAD have no qualifications
    E07000179,0.16471
    ...

### 'Breaks' API

- Get the breaks for a category, for a geotype
- E.g. `atlas/breaks/msoa/QS501EW0002.json`

This API represents the "five colours" - otherwise known as the breaks, or "buckets", of the choropleth.

This is just 6 numbers between 0 and 1. (The first one is the minimum value for each category, the next five are the upper bounds of each bucket).

Now we know how to colour an area! (We know which bucket its value belongs to.)

Example data:

    [
        0.01660255112370925,
        0.14306061085614813,
        0.2033898305084746,
        0.2640757349277529,
        0.33841721742077613,
        0.5066721412440978
    ]

### 'Geo' API

- Get the info about the specified geography (area)
- E.g. `atlas/geo/E07000178.geojson`

This simple API gets basic info about an area. For example, Oxford LAD:

    {
        "meta": {
            "name": "Oxford",
            "code": "E07000178",
            "geotype": "LAD"
        },
        "geo_json": {
            ... (the bounding box)
        }
    }

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for details.

## License

Copyright © 2022, Office for National Statistics (https://www.ons.gov.uk)

Released under MIT license, see [LICENSE](LICENSE.md) for details.
