<script type="text/javascript">
  import { onMount } from "svelte";

  onMount(async () => {
    const collapsibleComponents = [...document.querySelectorAll(".ons-js-collapsible")];

    if (collapsibleComponents.length) {
      const toggleAllButtons = [...document.querySelectorAll(".ons-js-collapsible-all")];

      const Collapsible = (
        await import("./../../../node_modules/@ons/design-system/components/collapsible/collapsible")
      ).default;
      const collapsibles = collapsibleComponents.map((element) => new Collapsible(element));

      if (toggleAllButtons.length) {
        const CollapsibleGroup = (
          await import("./../../../node_modules/@ons/design-system/components/collapsible/collapsible.group")
        ).default;

        toggleAllButtons.forEach((button) => {
          new CollapsibleGroup(button, collapsibles);
        });
      }
    }
  });

  export let title, isRegularFontWeightTitle;
  export let id = "collapsible";
  /* Fix WCAG A "Illogical headings", custom logic (not apart of ONS design system) 
    to convert h2 title to h3 only used if parent component contains h2 */
  export let a11yHeading = false;
</script>

<div {id} class="ons-collapsible ons-js-collapsible" data-btn-close="Hide this">
  <div class="ons-collapsible__heading ons-js-collapsible-heading">
    <div class="ons-collapsible__controls">
      {#if a11yHeading}
        <h3 class="ons-collapsible__title" class:ons-collapsible__title--regular={isRegularFontWeightTitle}>
          {title}
        </h3>
      {:else}
        <h2 class="ons-collapsible__title">{title}</h2>
      {/if}
      <span class="ons-collapsible__icon">
        <svg
          class="ons-svg-icon "
          viewBox="0 0 8 13"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
          fill="currentColor"
        >
          <path
            d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z"
            transform="translate(-5.02 -1.59)"
          />
        </svg>
      </span>
    </div>
  </div>
  <div id="{id}-content" class="ons-collapsible__content ons-js-collapsible-content">
    <slot />
    <button
      type="button"
      class="ons-btn ons-js-collapsible-button ons-u-d-no ons-btn--secondary ons-btn--small"
      aria-hidden="true"
    >
      <span class="ons-btn__inner ons-js-collapsible-button-inner">Hide this</span>
      <span class="ons-btn__context ons-u-vh">{title}</span>
    </button>
  </div>
</div>

<style lang="scss">
  .ons-collapsible__icon {
    display: flex;
    align-items: flex-end;
  }

  .ons-collapsible__title--regular {
    font-weight: normal;
  }
</style>
