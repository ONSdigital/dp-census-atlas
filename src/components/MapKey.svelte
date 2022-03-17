<script lang="ts">
	import { vizStore } from '../stores/stores';
	import { choroplethColours } from '../helpers/choroplethHelpers';
</script>

{#if $vizStore}
	<div class={`flex justify-center absolute bottom-8 left-1/2 -translate-x-1/2`}>
		<div
			class="z-abovemap bg-white px-8 pb-2.5 pt-3.5 border-[1px] border-slate-500 flex flex-col gap-1.5 items-center"
		>
			<div class="flex items-center gap-1">
				<div class="text-sm mr-1">Low</div>
				{#each choroplethColours as colour}
					<div class="h-6 w-6" style={`background-color: ${colour};`} />
				{/each}
				<div class="text-sm ml-1">High</div>
			</div>
			<div class="text-center">
				Proportion of {$vizStore.params.variable.units.toLowerCase()}
				with {$vizStore.params.category.name}
				{$vizStore.params.variable.name}.
			</div>
		</div>
	</div>
{/if}
