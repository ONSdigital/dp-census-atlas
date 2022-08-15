const isNotUrl = (urlString) => {
  try {
    new URL(urlString);
    return false;
  } catch (e) {
    return true;
  }
};

// contentJsonUrls must be valid JSON array containing valid URLS
let contentJsonUrls;
try {
  contentJsonUrls = JSON.parse(import.meta.env.VITE_CONTENT_JSONS);
} catch (e) {
  throw new Error(
    `Error parsing array of content JSON urls from env var VITE_CONTENT_JSONS='${contentJsonUrls}': ${e}`,
  );
}
for (const jsonUrl of contentJsonUrls) {
  if (isNotUrl(jsonUrl)) {
    throw new Error(`Content JSON url '${jsonUrl}' in VITE_CONTENT_JSONS array is not valid.`);
  }
}
export { contentJsonUrls };

// s3GeodataBaseUrl must be set to a valid URL
const geodataBaseUrl = import.meta.env.VITE_GEODATA_BASE_URL;
if (isNotUrl(geodataBaseUrl)) {
  throw new Error(`Env var VITE_S3_GEODATA_BASE_URL='${geodataBaseUrl}' must be set to a valid URL.`);
}
export { geodataBaseUrl };

// appBasePath can be either a blank string or a string that begins with '/'
const appBasePath = import.meta.env.VITE_APP_BASE_PATH;
if (appBasePath != "" && appBasePath[0] != "/") {
  throw new Error(`Env var VITE_APP_BASE_PATH='${appBasePath}' must be either blank or start with a '/'.`);
}
export { appBasePath };

// isPublishing is an optional boolean that defaults to false
const isPublishing = import.meta.env.VITE_IS_PUBLISHING === "true" ? true : false;
export { isPublishing };

// publishingDownloadUrlw must be a valid URL if isPublishing is true
const publishingDownloadUrl = import.meta.env.VITE_PUBLISHING_DOWNLOAD_URL;
if (isPublishing && isNotUrl(publishingDownloadUrl)) {
  throw new Error(
    `Env var VITE_PUBLISHING_DOWNLOAD_URL='${publishingDownloadUrl}' must be set to a valid URL if IS_PUBLISHING='true'.`,
  );
}
export { publishingDownloadUrl };
