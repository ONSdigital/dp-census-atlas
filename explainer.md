# Infrastructure requirements for Census Maps (né Census Atlas)

A brief explainer. For more detail, see https://github.com/ONSdigital/dp-census-atlas#publishing-architecture

## Components

- Web app server (Node server)
- Data prep EC2 (Go script)

## Dependencies

- Florence + Zebedee (for auth and publishing)
- Static Files API (for hosting our data)

## Explanation

- Our web app requests all its data from the Static Files Download-Service API.
- ONS staff publish app data (a collection of several thousand csv + json files) using a script that calls the Static Files Upload-Service API, uploading these files and associating them with a collection ID that has already been created with Florence.
- The Static Files service makes these collections available (published) as scheduled.
- In _publishing_, our web app requests its files and we expect to see all the collections, whether they are published or not. The web app therefore needs a way to authorise requests for un-published data from the Static Files Download-Service API.
- In _web_, the atlas does not need to authorise requests, and data from not-yet-published collections will be invisible.

We currently have our Data Prep script running on local Dockerised DP code (a tweaked version of the [dp-static-files-compose](https://github.com/ONSdigital/dp-static-files-compose) docker compose setup). We uploads test files to the local Static Files Service using the Upload-Service API, and the atlas uses the Download-Service API to fetch them.

## Minimum requirements for testing

1. We need a staging env that fully replicates the prod environment.

   - Florence / Zebedee (and/or the identity API, if that is how authorisation is to be done in prod)
   - Static Files service (both publishing and web instances, to test the atlas getting access to pre-published data and to published data)
   - App server EC2 (this is the NOMAD-managed box the atlas server runs on, so should be available in most envs)
   - Data prep EC2 (this is something we semi-manually provision ourselves - a decent-specced EC2 instance setup for producing the atlas data files, and knocked down when not in use)

   We need to be able to publish as many collections as we like, test, troubleshoot and debug our Data Prep script and our Web App.

2. Very soon (mid-September) we need to have **in prod**:

   - Collection 0 (a published collection containing essentially empty app data - this will not be fake/test data, but placeholder config for the production atlas while it waits for the real thing)
   - Collection 1 (an unpublished collection containing the first release of Census maps data)

   So:

   - In publishing, our app will be able to download both collections 0 and 1.
   - In web, our app will only be able to see collection 0 until Zebedee makes collection 1 go live on the morning Oct 4th.
