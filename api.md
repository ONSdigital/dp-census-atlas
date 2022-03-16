
API
===

Get single geography info (for zoom-to, returns bbox )

    curl "https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev/geo/2011?geocode=E01002111"

Get for a Bbox, for LSOA,
QS104EW0002 Sex=Male
QS104EW0001 Totals
(codes in curation.ts)

    curl "https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev/query/2011?bbox=0.1338,51.4635,0.1017,51.4647&cols=geography_code,QS104EW0002,QS104EW0001&geotype=LSOA"

    geoCode,  total number of people (in this case), number in that category
    E01000356,1546,763   763/1546=0.49353169469599, so would go in the third bin
    E01000357,1457,706
    E01000366,1585,756
    E01000392,1646,763
    E01000393,1581,779
    E01000394,1458,694
    E01000400,1547,754
    E01000401,1647,767
    E01000414,1708,842
    E01000455,1705,814
    E01000456,1427,702

To get breaks:

    curl https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev/ckmeans/2011?cat=QS104EW0002&cat=QS104EW0003&cat=QS104EW0001&geotype=LAD&k=5

https://onswebsite.slack.com/archives/C02KR4Y5GDQ/p1646055164034169
