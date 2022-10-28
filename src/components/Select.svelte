<script>
  import { onMount, createEventDispatcher } from "svelte";
  import Select from "svelte-select";
  const searchIcon = `<svg viewBox="0 0 20 20" fill-rule="evenodd"><path d="M0,8a8,8,0,1,0,16,0a8,8,0,1,0,-16,0ZM3,8a5,5,0,1,0,10,0a5,5,0,1,0,-10,0Z"/><path d="M18,20L20,18L14,12L12,14Z"/></svg>`;
  const chevronIcon = `<svg viewBox="0 0 20 20"><path d="M1,6L19,6L10,15Z"/></svg>`;
  const dispatch = createEventDispatcher();

  export let id = "";
  export let container = undefined;
  export let mode = "default";
  export let items;
  export let placeholder = "Select one...";
  export let value = null;
  export let filterText = "";
  export let isSearchable = true;
  export let isClearable = true;
  export let autoClear = false;
  export let idKey = "value";
  export let labelKey = "label";
  export let groupKey = null;
  export let groupItems = false;
  export let loadOptions = undefined;
  export let fontSize = "1.1em";
  export let fontSizeInput = ".91em";
  export let height = 48;
  export let maxSelected = 4;
  export let colors = ["#206095", "#a8bd3a", "#871a5b", "#27a0cc"];
  export let darkMode = false;
  export let borderColor = darkMode ? "white" : "#206095";

  const getOptionLabel =
    groupKey && !groupItems
      ? (option) => `${option[labelKey]}${option[groupKey] ? `<span class="group">${option[groupKey]}</span>` : ""}`
      : (option) => option[labelKey];
  export let getSelectionLabel = (option) => {
    if (option) return getOptionLabel(option);
    else return null;
  };
  const groupBy = groupItems && groupKey ? (item) => item[groupKey] : undefined;
  const indicatorSvg = mode == "search" ? searchIcon : chevronIcon;
  const containerStyles = `--inputFontSize: ${fontSizeInput}; --groupTitleFontSize: ${fontSize}; --height: ${height}px; font-size: ${fontSize};`;

  const ariaValues = (values) => `${values}, selected.`;
  const ariaListOpen = (label, count) => `You are currently focused on ${label}. There are ${count} results available.`;
  const ariaFocused = () => `Select is focused, type to refine list, press down to open the menu.`;

  $: noOptionsMessage = isWaiting
    ? "Loading..."
    : mode == "search" && filterText.length < 3
    ? "Enter 3 or more characters for suggestions"
    : `No results match ${filterText}`;
  $: itemFilter =
    (Array.isArray(value) && value.length >= maxSelected) || (mode == "search" && filterText.length < 3)
      ? (label, filterText, option) => false
      : (label, filterText, option) =>
          `${label}`.split("<")[0].toLowerCase().slice(0, filterText.length) == filterText.toLowerCase();

  let el;
  let isFocused;
  let listOpen;
  let isWaiting;
  let handleClear;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function doSelect(e) {
    dispatch("select", e.detail);
    if (autoClear) {
      handleClear();
    } else if (isClearable) {
      // Hack to allow selection to be cleared by keyboard
      await sleep(10);
      let clearSelect = el.getElementsByClassName("clearSelect")[0];
      if (clearSelect) {
        clearSelect.tabIndex = 0;
        clearSelect.onkeypress = (e) => {
          if (e.key == "Enter") handleClear();
        };
        clearSelect.removeAttribute("aria-hidden");
        clearSelect.setAttribute("aria-label", "Clear selection");
      }
    }
  }
</script>

<div class="selectbox" class:focused={isFocused} class:selected={value && !listOpen} bind:this={el}>
  <Select
    {id}
    {container}
    {items}
    {placeholder}
    {isSearchable}
    {groupBy}
    {loadOptions}
    {getSelectionLabel}
    {getOptionLabel}
    {itemFilter}
    {ariaValues}
    {ariaListOpen}
    {ariaFocused}
    {noOptionsMessage}
    {indicatorSvg}
    {containerStyles}
    {isClearable}
    optionIdentifier={idKey}
    bind:isFocused
    bind:value
    bind:listOpen
    bind:filterText
    bind:isWaiting
    bind:handleClear
    on:select={doSelect}
    on:clear
    on:loaded
    on:error
    showIndicator
  />
</div>

<style>
  .selectbox {
    box-sizing: border-box;
    margin: 0;
    border: 0;
  }
  .selectbox {
    --border: 2px solid var(--borderColor, #206095);
    --borderRadius: 0;
    --listBorderRadius: 0;
    --itemFirstBorderRadius: 0;
    --padding: 0 8px;
    --clearSelectBottom: auto;
    --clearSelectRight: 8px;
    --clearSelectTop: auto;
    --clearSelectWidth: 24px;
    --clearSelectColor: #206095;
    --indicatorWidth: 22px;
    --indicatorHeight: 22px;
    --indicatorRight: 11px;
    --borderHoverColor: var(--borderColor, #206095);
    --borderFocusColor: var(--borderColor, #206095);
    --inputColor: #206095;
    --itemColor: #206095;
    --placeholderColor: #9ca3af;
    --itemIsActiveBG: #206095;
    --itemHoverBG: #3875d7;
    --itemHoverColor: white;
    --clearSelectColor: white;
    --clearSelectFocusColor: white;
    --clearSelectHoverColor: white;
    --indicatorColor: white;
    --spinnerColor: rgba(255, 255, 255, 0);
  }
  :global(.selectbox, .selectbox input, .selectbox .item, .selectbox svg) {
    cursor: pointer !important;
  }
  :global(.selectbox input:focus) {
    cursor: default !important;
  }
  :global(.selectbox > .selectContainer) {
    box-shadow: inset -46px 0px #206095;
  }
  :global(.selectbox.focused > .selectContainer) {
    outline: 4px solid #fbc900;
  }
  :global(.selectbox.selected > .selectContainer) {
    background-color: #206095 !important;
  }
  :global(.selectbox.selected .selectedItem) {
    color: white !important;
    font-weight: bold;
  }
  :global(.selectbox .selectedItem .group) {
    display: none;
  }
  :global(.selectbox .item > .group) {
    color: white;
    background-color: rgb(144, 32, 130);
    padding: 0 4px;
    margin: 0 4px;
    border-radius: 2px;
    font-weight: bold;
    font-size: smaller;
    opacity: 0.7;
  }
  :global(.selectbox .indicator svg) {
    fill: white;
  }
  :global(.selectbox .clearSelect) {
    height: 24px;
  }
  :global(.selectbox .clearSelect:focus) {
    outline: 4px solid #fbc900;
  }
  :global(.selectbox .indicator) {
    width: 24px;
    height: 24px;
    line-height: 1;
  }
</style>
