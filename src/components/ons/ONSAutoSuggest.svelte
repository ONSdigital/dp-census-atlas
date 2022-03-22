<script>
  import { onMount } from "svelte";
  export let labelText, id, autosuggestValue, autosuggestData, header, invertTextColor, renderError;
  let n;
  let inverted = invertTextColor ? "input--with-white-description" : "";
  let inputContainer = header || renderError ? "header-input-container" : "non-header-input-container";

  onMount(async () => {
    const autosuggests = [...document.querySelectorAll(".ons-js-autosuggest")];

    if (autosuggests.length) {
      const Autosuggest = (
        await import("./../../../node_modules/@ons/design-system/components/autosuggest/autosuggest")
      ).default;

      autosuggests.forEach((autosuggest) => new Autosuggest(autosuggest));
    }
  });

  function onClick({ target }) {
    autosuggestValue = target.innerText;
  }

  function onKeyUp(e) {
    if (e.keyCode === 13) {
      const input = document.querySelector(".ons-autosuggest-input__option--focused");
      if (input) {
        autosuggestValue = input.innerText;
      }
    }
  }
</script>

<div class="ons-grid ons-grid--gutterless">
  <div class="ons-grid__col ons-col-8@m {inputContainer}">
    <div
      id="{id}-container"
      class="ons-js-autosuggest   ons-autosuggest-input"
      data-instructions="Use up and down keys to navigate suggestions once you&#39;ve typed more than two characters. Use the enter key to select a suggestion. Touch device users, explore by touch or with swipe gestures."
      data-aria-you-have-selected="You have selected"
      data-aria-min-chars="Enter 3 or more characters for suggestions."
      data-aria-one-result="There is one suggestion available."
      data-aria-n-results="There are {n} suggestions available."
      data-aria-limited-results="Results have been limited to 10 suggestions. Type more characters to improve your search"
      data-more-results="Continue entering to improve suggestions"
      data-results-title="Suggestions"
      data-no-results="No suggestions were found. Enter the name of a local council."
      data-type-more="Continue entering to get suggestions"
      data-autosuggest-data={autosuggestData}
    >
      <div class="ons-field">
        <label class="ons-u-fs-s ons-label  {inverted}" for={id} id="{id}-label">{labelText} </label>
        <input
          type="text"
          {id}
          bind:value={autosuggestValue}
          on:keyup={onKeyUp}
          class="ons-input ons-input--text ons-input-type__input ons-js-autosuggest-input "
          autocomplete="off"
          aria-describedby="{id}-label"
        />
      </div>
      <div class="ons-autosuggest-input__results ons-js-autosuggest-results">
        <header id="{id}-suggestions" class="ons-autosuggest-input__results-title ons-u-fs-s">Suggestions</header>
        <ul
          on:click={onClick}
          class="ons-autosuggest-input__listbox ons-js-autosuggest-listbox"
          role="listbox"
          id="{id}-listbox"
          aria-labelledby="{id}-suggestions"
          tabindex="-1"
        />
      </div>
      <div
        class="ons-autosuggest-input__instructions ons-u-vh ons-js-autosuggest-instructions"
        id="{id}-instructions"
        tabindex="-1"
      >
        Use up and down keys to navigate suggestions once you&#39;ve typed more than two characters. Use the enter key
        to select a suggestion. Touch device users, explore by touch or with swipe gestures.
      </div>
      <div
        class="ons-autosuggest-input__status ons-u-vh ons-js-autosuggest-aria-status"
        aria-live="assertive"
        role="status"
        tabindex="-1"
      />
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../../node_modules/@ons/design-system/scss/vars/_index.scss";

  .input--with-white-description {
    color: $color-white;
  }

  @media only screen and (min-width: map-get($grid-bp, s)) {
    .ons-input--select:not(.ons-input--block):not(.ons-input-search):not([class*="input--w-"]),
    .ons-input--text:not(.ons-input--block):not(.ons-input-search):not([class*="input--w-"]) {
      width: 100%;
    }
  }

  @media only screen and (min-width: map-get($grid-bp, m)) {
    .ons-col-8\@m {
      max-width: 100%;
    }
  }

  .header-input-container {
    width: 100%;
  }

  .non-header-input-container {
    width: 90%;
  }
</style>
