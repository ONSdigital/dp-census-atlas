
import * as dsv from 'd3-dsv'; // https://github.com/d3/d3/issues/3469
import type { Bbox, GeoType } from '../types';
import { vizStore } from '../stores/stores'
import { getBboxString } from '../helpers/spatialHelper';
import { getCategoryInfo } from '../helpers/categoryHelper';

const apiBaseUrl = `https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev`;

export const fetchVizData = async (args: {
  totalCode    : string,
  categoryCode : string,
  categoryCodes: string[],
  geoType      : GeoType,
  bbox         : Bbox,
}) => {

  let vizData = await Promise.all([
    fetchQuery(args),
    fetchBreaks(args)
  ]);

  vizStore.set({
    breaks: vizData[1][args.categoryCode],
    places: vizData[0].map(row => ({ geoCode: row.geography_code, value: parseInt(row[args.categoryCode]) })),
    params: getCategoryInfo(args.categoryCode),
  });

  return Promise.resolve();
}

const fetchQuery = async (args: {
  totalCode   : string,
  categoryCode: string,
  geoType     : GeoType,
  bbox        : Bbox,
}) => {

  let bboxParam = getBboxString(args.bbox);
  let url = `${apiBaseUrl}/query/2011?bbox=${bboxParam}&cols=geography_code,${args.totalCode},${args.categoryCode}&geotype=${args.geoType}`;
  let response = await fetch(url);
  let csv = await response.text();
  return dsv.csvParse(csv);
}

const fetchBreaks = async (args: {
  totalCode    : string,
  categoryCodes: string[],
  geoType      : GeoType,
}) => {

  const breakCount = 5;

  let url = `${apiBaseUrl}/ckmeans/2011?cat=${args.totalCode},${args.categoryCodes.join(',')}&geotype=${args.geoType}&k=${breakCount}`;
  let response = await fetch(url);
  let parsed = await response.json();

  // (ignore data from the API that we don't need)
  return Object.fromEntries(
    Object.keys(parsed).map(code => ([
      code,
      parsed[code][args.geoType.toUpperCase()]
    ]))
  );
}
