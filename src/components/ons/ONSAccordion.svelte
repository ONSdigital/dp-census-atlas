<script>
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
  
    export let showAll = true;
  </script>
  
  <div id="accordion" class="ons-accordion">
    {#if showAll}
      <button
        type="button"
        class="ons-btn ons-js-collapsible-all ons-u-mb-s ons-u-d-no ons-btn--secondary ons-btn--small"
        data-close-all="Hide all"
        data-group="accordion"
      >
        <span class="ons-btn__inner ons-js-collapsible-all-inner">Show all</span>
      </button>
    {/if}
    <slot />
  </div>
  