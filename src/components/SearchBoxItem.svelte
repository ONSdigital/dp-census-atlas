<script lang="ts">
  export let link: string;
</script>

<li class="tw-mb-1 tw-border-b-[1px] tw-border-b-slate-300 ">
  <a href={link} class="tw-block tw-py-2 tw-px-1 tw-custom-ring">
    <slot />
  </a>
</li>
