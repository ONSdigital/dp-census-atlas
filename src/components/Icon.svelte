<script>
  export let type;
  import Facebook from "./icons/Facebook.svelte";
  import Twitter from "./icons/Twitter.svelte";
  import Linkedin from "./icons/Linkedin.svelte";
  import Email from "./icons/Email.svelte";
  import Logo from "./icons/Logo.svelte";

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
  ];

  $: icon = icons.find(({ id }) => id === type);
</script>

<svelte:component this={icon.component} />
