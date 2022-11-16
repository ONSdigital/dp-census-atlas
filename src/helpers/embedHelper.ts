import { isNumeric } from "../util/numberUtil";
import { GeoTypes, type NumberQuadruple } from "../types";

export const getEmbedCode = (url: URL, embedParams: EmbedUrlParams) => {
  const params = new URLSearchParams({
    ...Object.fromEntries(url.searchParams),
    ...Object.fromEntries(Object.entries(embedParams)),
    embedView: embedParams.embedView, // avoid type error
  });

  const embedUrl = url.origin + url.pathname + "?" + params.toString();

  return {
    url: embedUrl,
    html: `<iframe height="600px" width="100%" title="ONS Census Maps" frameborder="0" src="${embedUrl}" />`,
  };
};

export type EmbedUrlParams = {
  embed: boolean;
  embedCarousel: boolean;
  embedAreaSearch: boolean;
  embedInteractive: boolean;
  embedView: "viewport" | "geography";
  embedBounds?: NumberQuadruple;
};

export const getPageUrlNoGeoParam = (pageUrl) => {
  const pageUrlNoGeoParam = new URL(pageUrl);
  GeoTypes.forEach((geoParam) => {
    if (pageUrlNoGeoParam.searchParams.has(geoParam)) {
      pageUrlNoGeoParam.searchParams.delete(geoParam);
    }
  });
  return pageUrlNoGeoParam;
};

export const parseEmbedParams = (params: URLSearchParams) => {
  const view = params.get("embedView") === "viewport" ? "viewport" : "geography";
  return {
    embed:
      params.get("embed") === "true"
        ? {
            interactive: params.get("embedInteractive") === "true",
            carousel: params.get("embedCarousel") === "true",
            areaSearch: params.get("embedAreaSearch") === "true",
            view: view as typeof view,
            bounds: view === "viewport" ? parseBounds(params) : undefined,
          }
        : undefined,
  };
};

export type EmbedParams = ReturnType<typeof parseEmbedParams>["embed"];

function parseBounds(params: URLSearchParams) {
  const array = params
    .get("embedBounds")
    ?.split(",")
    ?.map((b) => parseFloat(b));

  return isNumberQuadruple(array) ? array : undefined;
}

export function isNumberQuadruple(input: unknown): input is NumberQuadruple {
  return Array.isArray(input) && input.length === 4 && input.every((x) => isNumeric(x));
}
