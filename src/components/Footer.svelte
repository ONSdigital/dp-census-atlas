<script lang="ts">
  import Icon from "./MaterialIcon.svelte";
  import Logo from "./icons/Logo.svelte";
</script>

<footer class="px-6 pt-8 pb-10 bg-ons-grey-100 text-ons-grey-5 justify-self-end">
  <div class="mb-6">
    <Logo fill="fill-ons-white" />
  </div>

  <div class="flex flex-wrap gap-x-6 gap-y-1 mb-8">
    <div class="">
      <a href="https://www.ons.gov.uk/cookies" title="Cookies" class="hyperlink-reverse custom-ring">Cookies</a>
    </div>
    <div class="">
      <a
        href="https://www.ons.gov.uk/help/accessibility"
        title="Accessibility statement"
        class="hyperlink-reverse custom-ring">Accessibility</a
      >
    </div>
    <div class="">
      <a
        href="https://www.ons.gov.uk/help/privacynotice"
        title="Privacy and data protection"
        class="hyperlink-reverse custom-ring">Privacy</a
      >
    </div>
    <div class="">
      <a
        href="https://www.ons.gov.uk/help/termsandconditions"
        title="Terms and conditons"
        class="hyperlink-reverse custom-ring">Terms</a
      >
    </div>
  </div>

  <div class="flex gap-3">
    <div class="">
      <img
        class="fill-ons-grey-5"
        alt="OGL"
        width="45"
        src="https://cdn.ons.gov.uk/assets/images/logo-ogl-footer.svg"
      />
    </div>
  </div>

  <div class="text-sm mt-2 text-ons-grey-35">
    All content is available under the <a
      class="hyperlink-reverse"
      href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
      target="_blank"
      rel="noreferrer">Open Government Licence v3.0</a
    >
    <span class="inline">
      <Icon kind="openInNew" />
    </span>, except where otherwise stated
  </div>
  <div class="flex justify-end mt-1" />

  <div class="text-sm mt-5 text-ons-grey-35">
    House of Commons Library
    <a
      class="hyperlink-reverse"
      href="https://houseofcommonslibrary.github.io/msoanames/"
      target="_blank"
      rel="noreferrer">MSOA names</a
    >

    used under the
    <a
      class="hyperlink-reverse"
      href="https://www.parliament.uk/site-information/copyright-parliament/open-parliament-licence/"
      target="_blank"
      rel="noreferrer">Open Parliament Licence v3.0</a
    >
    <span class="inline">
      <Icon kind="openInNew" />
    </span>
  </div>
</footer>
