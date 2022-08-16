# Infrastructure requirements for Census Maps (né Census Atlas)

A brief explainer. For more detail, see https://github.com/ONSdigital/dp-census-atlas#publishing-architecture

## Components

- Web app server (Node server)
- Data prep EC2 (Go script)

## Dependencies

- Florence + Zebedee (for auth and publishing)
- Static Files API (for hosting our data)

## Explanation

- Our web app requests all its data from the Static Files API.
- ONS staff publish app data in collections with Florence.
- The Static Files API makes these collections available as scheduled.
- In _publishing_, our web app requests its files and we expect to see all the collections we've published.
- In _web_, not-yet-published collections will be invisible.

We currently have our Data Prep script running on local Dockerised DP code. It uploads files to the Static Files Service with Download Service.

## Minimum requirements for testing

1. We need a staging env that fully replicates the prod environment.

   - Florence / Zebedee
   - Static Files service
   - App server EC2
   - Data prep EC2

   We need to be able to publish as many collections as we like, test, troubleshoot and debug our Data Prep script and our Web App.

2. Very soon (mid-September) we need to have **in prod**:

   - Collection 0 (a published collection containing essentially empty app data)
   - Collection 1 (an unpublished collection containing the first release of Census maps data)

   So:

   - In publishing, our app will be able to download both collections 0 and 1.
   - In web, our app will only be able to see collection 0 until Zebedee makes collection 1 go live on the morning Oct 4th.
