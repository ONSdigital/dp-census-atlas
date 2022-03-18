
<script>
  import '../app.css'
  import Layout from '../components/Layout.svelte';
</script>

<Layout>
  <slot></slot>
</Layout>

<style lang="scss" global>
/* XXX: Replicate main.scss in order to work around some bugs on upstream lulz */
@import "normalize";
  $static: "";
  @import "./../../node_modules/@ons/design-system/scss/vars/colors";
  @import "./../../node_modules/@ons/design-system/scss/vars/typography";
  @import "./../../node_modules/@ons/design-system/scss/vars/grid";
  @import "./../../node_modules/@ons/design-system/scss/vars/forms";
  @import "./../../node_modules/@ons/design-system/scss/helpers/index";
  @import "./../../node_modules/@ons/design-system/scss/base/index";
  @import "./../../node_modules/@ons/design-system/scss/objects/index";
  /* Update when adding ONS components */
  @import "./../../node_modules/@ons/design-system/components/collapsible/collapsible";
  @import "./../../node_modules/@ons/design-system/components/button/button";
  @import "./../../node_modules/@ons/design-system/components/icons/icons";


  @import "./../../node_modules/@ons/design-system/scss/utilities/index";
  // Right to left
  @import "./../../node_modules/@ons/design-system/scss/overrides/rtl";
  // High Contrast Mode
  @import "./../../node_modules/@ons/design-system/scss/overrides/hcm";

  /* TODO: Replace with the following once [this bug](https://github.com/ONSdigital/design-system/issues/1750) is fixed. */
  /* $static: ""; */
  /* @import "./../../node_modules/@ons/design-system/scss/main.scss"; */

  /* TODO: Better yet, only include vars here (with overridden $static variable) and include component specific SCSS on per component basis */
</style>
