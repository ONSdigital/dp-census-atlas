<script lang="ts">
  export let className: string;
</script>

<div class={`tw-text-sm tw-font-bold tw-text-white tw-px-1.5 tw-py-0.5 tw-rounded-sm ${className}`}>
  <slot />
</div>
