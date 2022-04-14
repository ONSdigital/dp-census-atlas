<script type="text/javascript" context="module" lang="ts">
  export type IconType =
    | "facebook"
    | "twitter"
    | "linkedin"
    | "email"
    | "logo"
    | "chevron-right"
    | "chevron-up"
    | "close"
    | "info";
</script>

<script type="text/javascript" lang="ts">
  import Facebook from "./icons/Facebook.svelte";
  import Twitter from "./icons/Twitter.svelte";
  import Linkedin from "./icons/Linkedin.svelte";
  import Email from "./icons/Email.svelte";
  import Logo from "./icons/Logo.svelte";
  import ChevronRight from "./icons/ChevronRight.svelte";
  import ChevronUp from "./icons/ChevronUp.svelte";
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
      id: "chevron-up",
      component: ChevronUp,
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
