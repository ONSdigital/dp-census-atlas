<script lang="ts">
  import { page } from "$app/stores";
  export let title: string = "";
  export let label: string;
  export let type;
  let href;

  switch (type) {
    case "facebook":
      href = `https://www.facebook.com/sharer/sharer.php?u=${$page.url}`;
      break;
    case "twitter":
      href = `https://twitter.com/intent/tweet?original_referer&amp;text=A page to share&amp;url=${$page.url}`;
      break;
    case "linkedin":
      href = `https://www.linkedin.com/sharing/share-offsite/?url=${$page.url}`;
      break;
    case "email":
      href = `mailto:?subject=${title}&body=${$page.url}`;
    default:
      break;
  }
</script>

<li class="ons-list__item tw-relative tw-w-3/6">
  <span class="ons-list__prefix" aria-hidden="true">
    <slot />
  </span>
  <a {href} class="ons-list__link" target="_blank" rel="noreferrer external">
    {label}
    <span class="ons-u-vh">this link will open in a new tab</span>
  </a>
</li>
