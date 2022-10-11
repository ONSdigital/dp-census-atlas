// values set from the env at build time

// appBasePath can be either a blank string or a string that begins with '/'
const appBasePath = import.meta.env.VITE_APP_BASE_PATH;
if (appBasePath !== "" && appBasePath[0] !== "/") {
  throw new Error(`Env var VITE_APP_BASE_PATH='${appBasePath}' must be either blank or start with a '/'.`);
}
export { appBasePath };
