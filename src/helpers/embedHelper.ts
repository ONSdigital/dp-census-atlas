export const getEmbedCode = (url: URL, embedParams: EmbedParams) => {
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
  embedMoveable: boolean;
  embedView: "viewport" | "geography";
};

// type PickByType<T, Value> = {
//   [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P]
// }
