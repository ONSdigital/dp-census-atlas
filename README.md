# Census Atlas

Explore neighbourhood-level Census data on a map.

## State ownership

In this app, there are three 'owners' of state:

- URL (app state)
- Map instance (transitory map state, eg exact zoom and position)
- Svelte components (transistory, local UI state, eg a [details](https://design-system.service.gov.uk/components/details/) component)

All _important_ state flows in one direction from the URL to the UI. This is a fundamental principle of web design and UX on the web. It enables link sharing and makes apps work on the web.

- When a URL is shared, the app opens in the same state as when it was shared _in every important way_
- The Back (and Forward) buttons should work completely correctly
- Embedding is a special case of sharing - again, the URL needs to contain all the relevant state needed to show the embeddable content

## URL structure

    /population/sex/default/female          ? msoa=E02006827
                    |                               |
                    |                               |
    /topic/variable/classification/category ? geotype=geocode
                    |                               |
          `path` picks a node                `query` selects
          in the content tree                 the geography

## Localization

TODO: clean this up:

All hard-coded text should be added to the en.json file within the i18n locales folder. Each translation can be created under it's own file e.g cy.json.
The structure of the file is pages and hard-coded text relevant to those pages and custom components and text relevant to those components.

## Developing

    npm install
    npm run dev

## Building

    npm run build

You can preview the production build with `npm run preview`.
TODO: is this still the case?

To build specifically for node (required for production deployment), use `npm run build-node`. This is as above, but first sets an env var (`SKADAPTER=node`) that controls the adapter used to build.

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

We generally call this "percentage" a _ratio_ in the app, and it's expressed as a decimal. (We format it as a percentage in the UI.)

### 'Breaks' API

- Get the breaks for a category, for a geotype
- E.g. `atlas/breaks/msoa/QS501EW0002.json`

This API represents the "five colours" - otherwise known as the breaks, or "buckets", of the choropleth.

Logically, this is just 6 numbers between 0 and 1. (The output is split into two for historical reasons, with the highest and lowest numbers in a separate array. The property names here can otherwise be ignored).

Now we know how to colour an area! (We know which bucket its value belongs to.)

    "MSOA": [
        0.14306061085614813,
        0.2033898305084746,
        0.2640757349277529,
        0.33841721742077613,
        0.5066721412440978
    ],
    "MSOA_min_max": [
        0.01660255112370925,
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
