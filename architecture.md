# Architectural proposal

There are two areas of deployment concern:

(1) Frontend. The web app _must_ live under the production website, and therefore there's no good alternative to the DP publishing system. But we've already proved we can deploy to `develop` (now `sandbox`), and we're assured that the production environment is extremely similar. So this is low risk

(2) Backend. We don't have sight of the proposed / eventual DP publishing infrastructure solution.

## Solution - 'static data tiles' + DP Download Service

                PRE-PROD (Publishing)    ‖        PROD
                                         ‖
      ===========       content.json?    ‖
      | PostGIS |      tilelist (quads)  ‖
      | loading |            ↓           ‖
      |   DB    |   -->   ~~~~~~~~       ‖
      ===========        |        |      ‖
                         | Script |      ‖
      ???????????   -->  |        |      ‖
     ? Cantabula ?        ~~~~~~~~       ‖
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

## PoC 1 - proving the static data tiles approach

- [x] spike a PoC
  - [x] check our assumption is that the quadtree tilelist is good / suitable
  - [x] generate filesets, perhaps:
    - `/geotype/tilename/classification.csv`, e.g.
    - `/msoa/3-23-125/QS012345.csv`
  - [x] check this is feasible
  - [x] find out how much data is involved (especially at OA level)
  - [ ] explain / tell a detailed story abut how publishing new data and corrections would work
- [x] hack the front end to show this working - check performance

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

### Outcome

We have working output files, plus a hacked front-end working demo, using three 'flat file APIs', eg.:

    - .../data/msoa/62-42-7/QS501EW0002.csv <-- data API (get the viz data for a category, for one tile)
    - .../breaks/msoa/QS501EW0002.json      <-- breaks API (get the breaks for a category, at a geotype level)
    - .../geo/msoa/W02000139.geojson        <-- geography API (get info about a geography, eg name)

NB. Front end is a now a bit of a mess, preventing UI work from merging.

## PoC 2 - proving the "publishing with Download Service" approach

A collection uploaded to the File Service contains a set of files:

    content.json  (the content.json that has been created for the this publishing collection - it has the category codes)
    data/         (the set of data files)
    breaks/       (the set of breaks files)
    geo/          (the set of geography files, although this could be stored elsewhere)

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

### Process

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

- the exact order of collection creation/testing is open to improvement -- there's a bit of a chicken & egg with the `content.json`
  - if we can make the `content.json` first, knowing the category codes, this would be ideal -- the script could then upload this along with the data
- where to put the `geo` API (it could just be repeated per-collection, or could be hosted once, elsewhere, if we're sure is stable)
- the Script will need rewriting as we get first access to real data in Cantabula -- it could be done before that, though, as there is an example Cantubula instance?
- 😕 we still will want to keep track of which categories have been published - still feels like this might be a job for a DB

### Next steps

- use the DP Upload client in our magic Script instead of writing output locally
- use the DP Download Service URLs in the front end

### Questions for DP

- mime types - file extension? set?
- caching - we want to cache - it was unknown whether Download Service would be behind Cloudfront or what HTTP caching would be enabled
- CORS - doens't look like we need to host `.js`, but...
- there is no autoscaling on the Download Service -- it's a long-running server in a single instance
  - will it be live and testes before the univariate census release?

### Notes from PM

- files must be smaller than 50GB (no probs)
- lots of small files is fine (good for our use case)
- there's an HTTP API, but Go library ("upload client") easier to use, and handles chunking
- we supply the `path` and the `filename`, so we can add the Collection ID to the path e.g.
  - path: `atlas/0000000004/data/msoa/1-23-456` // let's use `atlas` as our "namespace"
  - filename: `QS12345.csv`

### Notes from VA

- there are docs! (starting from the static files service seems a reasonable place to start): https://github.com/ONSdigital/dp-static-files-compose
- when up, its invoked from (for develop): https://api.develop.onsdigital.co.uk/v1/downloads-new/<path to file>
- the api router should check all the auth etc for you
- it does a 301 redirect for public files, so we’d need to make sure we handle that
