<script lang="ts">
  import { page } from "$app/stores";
  import { content } from "../stores/content";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
</script>

<div>
  <div class="flex flex-wrap gap-x-8 gap-y-2 mb-5">
    {#each $content.variableGroups as variableGroup}
      <a
        class="flex-none w-48 flex-grow-[1] pb-3 border-b-[1px] border-b-slate-300 group custom-ring"
        href={buildHyperlink($page.url, {
          variableGroup: variableGroup.slug,
        })}
      >
        <div class="flex justify-between mb-0.5">
          <div class="hyperlink text-xl">{variableGroup.name}</div>
          <div class="text-onsblue stroke-2 group-hover:stroke-[2px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div class="pr-10">{variableGroup.desc}</div>
      </a>
    {/each}
  </div>
</div>
