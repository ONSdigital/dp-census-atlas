
<script lang="ts">
  export let link: string
</script>

<li class="mb-1 border-b-[1px] border-b-slate-300 ">
  <a href={link} class="block py-2 px-1 custom-ring">
    <slot></slot>
  </a>
</li>
