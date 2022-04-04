<script context="module" lang="ts">
  export type IconType = "facebook" | "twitter" | "linkedin" | "email" | "logo" | "chevron-right" | "close";
</script>

<script lang="ts">
  import Facebook from "./icons/Facebook.svelte";
  import Twitter from "./icons/Twitter.svelte";
  import Linkedin from "./icons/Linkedin.svelte";
  import Email from "./icons/Email.svelte";
  import Logo from "./icons/Logo.svelte";
  import ChevronRight from "./icons/ChevronRight.svelte";
  import Close from "./icons/Close.svelte";

  export let type: IconType;

  const icons = [
    {
      id: "facebook",
      component: Facebook,
    },
    {
      id: "twitter",
      component: Twitter,
    },
    {
      id: "linkedin",
      component: Linkedin,
    },
    {
      id: "email",
      component: Email,
    },
    {
      id: "logo",
      component: Logo,
    },
    {
      id: "chevron-right",
      component: ChevronRight,
    },
    {
      id: "close",
      component: Close,
    },
  ];

  $: icon = icons.find(({ id }) => id === type);
</script>

<svelte:component this={icon.component} />
