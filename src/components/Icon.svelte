<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import Facebook from "./icons/Facebook.svelte";
  import Twitter from "./icons/Twitter.svelte";
  import Linkedin from "./icons/Linkedin.svelte";
  import Email from "./icons/Email.svelte";
  import Logo from "./icons/Logo.svelte";
  import ChevronRight from "./icons/ChevronRight.svelte";
  import ChevronUp from "./icons/ChevronUp.svelte";
  import Close from "./icons/Close.svelte";
  import Information from "./icons/Information.svelte";
  import FormatListNumbered from "./icons/FormatListNumbered.svelte";
  import Image from "./icons/Image.svelte";
  import FileDownload from "./icons/FileDownload.svelte";
  import Code from "./icons/Code.svelte";
  import Share from "./icons/Share.svelte";
  import Leaderboard from "./icons/Leaderboard.svelte";
  import Edit from "./icons/Edit.svelte";
  export let type: // | "facebook"
  // | "twitter"
  // | "linkedin"
  // | "email"
  // | "logo"
  // | "chevron-right"
  // | "chevron-up"
  // | "close"
  // | "info"
  "formatListNumbered" | "image" | "fileDownload" | "code" | "share" | "leaderboard" | "edit";
  export const onClick: () => void = undefined;

  const icons: Record<typeof type, typeof SvelteComponent> = {
    // facebook: Facebook,
    // twitter: Twitter,
    // linkedin: Linkedin,
    // email: Email,
    // logo: Logo,
    // "chevron-right": ChevronRight,
    // "chevron-up": ChevronUp,
    // close: Close,
    // info: Information,
    formatListNumbered: FormatListNumbered,
    image: Image,
    fileDownload: FileDownload,
    code: Code,
    share: Share,
    leaderboard: Leaderboard,
    edit: Edit,
  };
</script>

<div on:click={onClick}>
  <svelte:component this={icons[type]} />
</div>
