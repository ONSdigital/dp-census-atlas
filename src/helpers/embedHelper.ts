export const getEmbedCode = (url: URL) => {
  const params = new URLSearchParams({ embed: "true", ...Object.fromEntries(url.searchParams) });
  const embedUrl = url.origin + url.pathname + "?" + params.toString();
  return `<iframe height="100%" width="100%" title="ONS Census Maps" frameborder="0" src="${embedUrl}" />`;
};
