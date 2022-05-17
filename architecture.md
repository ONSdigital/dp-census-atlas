# Architectural proposal

There are two areas of deployment concern:

(1) Frontend. This is necessary to ship the product. The web app must live under the production website, and therefore there's no alternative to the DP publishing system. We've already proved we can deploy to `develop`, and we're led to believe that the production environment is extremely similar.

(2) Backend. We don't have sight of the proposed / eventual DP publishing infrastructure solution.

## Solution - 'static data tiles'

                PRE-PROD (Publishing)              ‖       PROD
                                                   ‖
      ===========        ---------     tilelist    ‖     ---------
      | PostGIS |       |         |       ↓        ‖    |   S3    |
      |         | ----> | Go API  | ->  script ->  ‖    |         |
      | loading |       |         |                ‖    | "data   |
      |   DB    |        ---------                 ‖    |  tiles" |
      ===========            |                     ‖     ---------
    ("logical", or           |                     ‖        |
      "top-copy"             |                              |
       database)             |                              |
                        ------------                    -----------
                       | web app(s) |                  |  web app  |
                        ------------                    -----------

## Advantages

- removes shipping dependency on DP infra
- scalability (will handle any load or spike)
- reliability
- simplicity (no moving parts)
- no maintenance (of production system)
- running cost (nearly free)

## Disadvantages

- time to generate / upload data tiles
- publishing is a manual process, at least initally
- where to host these tiles?

## How to do this

- spike a PoC
  - assumption is that the quadtree tilelist is suitable
  - generate filesets, perhaps:
    - `/geotype/tilename/classification.csv`, e.g.
    - `/msoa/3-23-125/QS012345.csv`
  - check this is feasible
  - find out how much data is involved (especially at OA level)
  - explain / tell a detailed story abut how publishing new data and corrections would work
- enable the front end to switch between 'Go API' or 'Data Tile' mode depending on target build environment (relatively trivial)
