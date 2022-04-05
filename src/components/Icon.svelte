<script context="module" lang="ts">
  export type IconType = "facebook" | "twitter" | "linkedin" | "email" | "logo" | "chevron-right" | "close" | "info";
</script>

<script lang="ts">
  import Facebook from "./icons/Facebook.svelte";
  import Twitter from "./icons/Twitter.svelte";
  import Linkedin from "./icons/Linkedin.svelte";
  import Email from "./icons/Email.svelte";
  import Logo from "./icons/Logo.svelte";
  import ChevronRight from "./icons/ChevronRight.svelte";
  import Close from "./icons/Close.svelte";
  import Information from "./icons/Information.svelte";

  export let type: IconType;
  export let onClick: () => void = undefined;

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
    {
      id: "info",
      component: Information,
    },
  ];

  $: icon = icons.find(({ id }) => id === type);
</script>

<div on:click={onClick}>
  <svelte:component this={icon.component} />
</div>
