// values set from the env at build time

// appBasePath can be either a blank string or a string that begins with '/'
const envBasePath = import.meta.env.VITE_APP_BASE_PATH;
const appBasePath = envBasePath ? envBasePath : "";
if (appBasePath != "" && appBasePath[0] != "/") {
  throw new Error(`Env var VITE_APP_BASE_PATH='${appBasePath}' must be either blank or start with a '/'.`);
}
export { appBasePath };
