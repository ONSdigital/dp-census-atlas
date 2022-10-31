export const getEmbedCode = (url: URL, embedParams: EmbedParams) => {
  // delete bounding box properties to avoid long urls if not embedding in viewport mode
  if (embedParams.embedView != "viewport") {
    delete embedParams.embedEast;
    delete embedParams.embedNorth;
    delete embedParams.embedWest;
    delete embedParams.embedSouth;
  }

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

export type EmbedParams = {
  embed: boolean;
  embedAreaSearch: boolean;
  embedInteractive: boolean;
  embedView: "viewport" | "geography";
  embedEast?: number;
  embedNorth?: number;
  embedWest?: number;
  embedSouth?: number,
};


// type PickByType<T, Value> = {
//   [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P]
// }
