import { addMessages, init, getLocaleFromQueryString } from "svelte-i18n";
import en from "./locales/en.json";

addMessages("en", en);

/* 
  
  How to switch language, include ?lang= in the url with a language code e.g cy, 
  if specified language doesn't exist within src/i18n/locales it will fallback to english.
  The AutoSuggest list used in the Search Component must have key's that reflects the specified langauge 
  as the component looks up the html lang tag.

  Example: 
  
  {
    en: "England and Wales"
  }

  or
   
  {
    cy: "England and Wales"
  }

*/

init({
  fallbackLocale: "en",
  initialLocale: getLocaleFromQueryString("lang"),
});
