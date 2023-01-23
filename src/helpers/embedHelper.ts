import { isNumeric } from "../util/numberUtil";
import { GeoTypes, type GeoType, type NumberQuadruple } from "../types";

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
  embedAreaSearch: boolean;
  embedInteractive: boolean;
  embedCategorySelection: boolean;
  embedView: "viewport" | "geography";
  embedBounds?: NumberQuadruple;
};

export const cleanUnusedParams = (pageUrl: URL, embedSelectGeo: boolean, doGeoLock: boolean): URL => {
  const cleanedUrl = new URL(pageUrl);
  if (!embedSelectGeo) {
    GeoTypes.forEach((geoParam) => {
      if (cleanedUrl.searchParams.has(geoParam)) {
        cleanedUrl.searchParams.delete(geoParam);
      }
    });
  }
  if (!doGeoLock) {
    if (cleanedUrl.searchParams.has("geoLock")) {
      cleanedUrl.searchParams.delete("geoLock");
    }
  }
  return cleanedUrl;
};

export const parseEmbedParams = (params: URLSearchParams) => {
  const view = params.get("embedView") === "viewport" ? "viewport" : "geography";
  return {
    embed:
      params.get("embed") === "true"
        ? {
            interactive: params.get("embedInteractive") === "true",
            areaSearch: params.get("embedAreaSearch") === "true",
            categorySelection: params.get("embedCategorySelection") === "true",
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

export const isAppInteractive = (embedParams: EmbedParams) => {
  return !embedParams || embedParams.interactive;
};
