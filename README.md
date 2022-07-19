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

## Publishing architecture

There are two areas of deployment concern:

(1) Frontend. The web app _must_ live under the production website, and therefore there's no real alternative to the DP publishing system. But we've already proved we can deploy to `develop` (now `sandbox`), and we're assured that the production environment is extremely similar. So this is low risk

(2) Backend. 'Static data tiles' + DP Download Service

                PRE-PROD (Publishing)    ‖        PROD
                                         ‖
      ===========       content.json?    ‖
      | PostGIS |      tilelist (quads)  ‖
      | loading |            ↓           ‖
      |   DB    |   -->   ~~~~~~~~       ‖
      ===========        |        |      ‖
                         | Script |      ‖
      ???????????   -->  |        |      ‖
     ? Cantabular ?       ~~~~~~~~       ‖
      ???????????            ↓           ‖
                         collection      ‖
                      e.g. "0000000038"  ‖
                             ↓           ‖
                     -------------------------------------------
                    |  DP Download Service ("data tiles" on S3) |
                    | "0000000004","0000000023","0000000038"... |
                     -------------------------------------------
                      Publishing mode    ‖       Web mode
                             |           ‖          |
                 --------------------    ‖      -----------
                | preview web app(s) |   ‖     |  web app  |
                 --------------------    ‖      -----------
                                         ‖

### Advantages and disadvantages of static data files

- 😀 removes shipping dependency on DP infra - Plan B, we can publish the whole app + data manually to any CDN.
- 😀 reliability (will not go down)
- 😀 scalability (will handle any load or spike)
- 😀 simplicity (no moving parts)
- 😀 running cost (nearly free)
- 😀 zero maintenance (no developers needed for long-term support)
- 😕 time to generate / upload data tiles? (no, very quick)
- 😕 publishing is a manual process, at least initally (no, see PoC 2 below)
- 😕 where to host these tiles? (see Poc 2 below)

### PoC 2 - proving the "publishing with Download Service" approach

A collection uploaded to the File Service contains a set of files:

    content.json  <-- the content.json that has been created for this publishing collection - it has the category codes
    data/         <-- the set of data files
    breaks/       <-- the set of breaks files
    geo/          <-- the set of geography files, although this could be stored elsewhere

Proposal: imagine we have a small list of “DP Collection ID”s committed into the front end code, like this:

    let dpCollections = [
      "0000000004",  // published
      "0000000023",  // published
      "0000000038",  // not published until 9.30am on 1 November
    ];

On startup, we fetch all the `content.json` files, since we can make their URLs (in parallel, with `Promise.all()`):

    GET .../atlas/0000000004/content.json --> 200 (or 301 once decrypted)
    GET .../atlas/0000000023/content.json --> 200 (or 301 once decrypted)
    GET .../atlas/0000000038/content.json --> 404

The Download Service will ensure that files in any unpublished collections will 40x, so we just _ignore_ them.

We then “merge” the 200-returning `content.json` files, so they’re _additive_ — the later ones contain new classifications (and possibly corrections). The content tree is built by addition. (Even simpler would to just be to use the latest / last in the list, but addition gives us a couple of very desirable properties...)

Finally (since we've made sure that the collection ID is in the URL of our files on upload) we can also build the API URLs, e.g:

    GET .../atlas/0000000004/data/msoa/1-23-456/QS12345.csv

- 😀 the Download Service is fully responsible for auth / publishing (places responsibility for digital publishing with... DP)
- 😀 content will be published "at 9.30am" with no intervention needed (solves "9.30" problem)
- 😀 collections can be previewed and signed off in pre-release (solves pre-release "sign-off" problem)
- 😀 only authorised people can see “their” collections in pre-release (solves "auth" problem)
- 😀 mechanism for removing / correcting published data (could simply start again with a single, replacement collection)

### Publishing pocess

1. a publishing "collection" is created manually on Zebedee (or its successor)
2. someone runs the Script, supplying the `Collection ID` as an argument
   - the input source (ie. which classifications) to the script could be database or Cantabula
     - this will be a manual data-munging task
     - or it could be built from a `content.json` file
   - the output of the Script can be a full set of new data, or a partial addition to existing data
   - the Script adds the output to the `Download Service` via the `Upload Client`
3. the `Collection ID` is added to the frontend array and deployed (at least to sandbox).
4. the `content.json` file for this collection is crafted, and tested, and uploaded
5. the collection is signed off, being visible to appropriately auth'd personnel in publishing env
6. the publishing date & time is configured in Zebedee
7. the frontend code is deployed
8. at the configured time, Zebedee sends a signal to the Download Service to publish the collection
9. the `content.json` becomes visible to anyone who loads or refreshes the app

### Thoughts

- if we can make the `content.json` first, knowing the category codes, this would be ideal -- the script could then upload this along with the data
- where to put the `geo` API (it could just be repeated per-collection, or could be hosted once, elsewhere, if we're sure is stable)
- the Script will need rewriting as we get first access to real data in Cantabula -- it could be done before that, though, as there is an example Cantubula instance?

### Next steps

- use the DP Upload client in our magic Script instead of writing output locally
- use the DP Download Service URLs in the front end

### Questions for DP

- mime types - file extension? set?
- caching - we want to cache - it was unknown whether Download Service would be behind Cloudfront or what HTTP caching would be enabled
- CORS - doens't look like we need to host `.js`, but...
- there is no autoscaling on the Download Service -- it's a long-running server in a single instance
- will it be live and tested before the univariate census release?

### Notes from PM

- files must be smaller than 50GB (no probs)
- lots of small files is fine (good for our use case)
- there's an HTTP API, but Go library ("upload client") easier to use, and handles chunking
- we supply the `path` and the `filename`, so we can add the Collection ID to the path e.g.
  - path: `atlas/0000000004/data/msoa/1-23-456` // let's use `atlas` as our "namespace"
  - filename: `QS12345.csv`

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for details.

## License

Copyright © 2022, Office for National Statistics (https://www.ons.gov.uk)

Released under MIT license, see [LICENSE](LICENSE.md) for details.
