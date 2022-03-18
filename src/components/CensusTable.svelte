<script>
	import { vizStore } from '../stores/stores';
	import { page } from '$app/stores';
</script>

{#if $vizStore}
	<table class="ons-table">
		<thead class="ons-table__head">
			<tr class="ons-table__row">
				<th scope="col" class="ons-table__header" />
				<th scope="col" class="ons-table__header ons-table__header--numeric">
					<span>{$vizStore.params.variable.units}</span>
				</th>
				<th scope="col" class="ons-table__header ons-table__header--numeric">
					<span>Percentage</span>
				</th>
			</tr>
		</thead>
		<tbody class="ons-table__body">
			{#each $vizStore.params.variable.categories as category}
				<tr
					class="ons-table__row"
					class:ons-table__row--overlay={category.slug === $page.params.category}
				>
					<td
						class="ons-table__cell "
						class:ons-table__cell--onSelect={category.slug === $page.params.category}
					>
						{#if category.slug !== $page.params.category}
							<a
								href="/2021/{$page.params.topic}/{$page.params
									.variable}/defaul/{category.slug}{$page.url.search}">{category.name}</a
							>
						{:else}
							{category.name}
						{/if}
					</td>
					<td
						class="ons-table__cell  ons-table__cell--numeric"
						class:ons-table__cell--onSelect={category.slug === $page.params.category}
					/>
					<td class="ons-table__cell  ons-table__cell--numeric ons-table__cell--key"
						><span>%</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style>
	.ons-table {
		margin: 0 -18px;
		width: calc(100% + 36px);
	}
	.ons-table__row--overlay {
		background-color: rgba(229, 229, 229, 1);
	}
	.ons-table__header {
		border-bottom: 0;
		color: #222222;
	}
	th {
		font-weight: normal;
	}
	tr td a {
		font-weight: bold;
	}
	.ons-table__cell {
		font-size: 18px;
		line-height: 26px;
		border-bottom: 0;
		color: #595959;
		overflow-wrap: anywhere;
	}
	.ons-table__header:first-of-type,
	.ons-table__cell:first-of-type {
		padding-left: 18px;
	}
	.ons-table__header:last-of-type,
	.ons-table__cell:last-of-type {
		padding-right: 18px;
	}
	.ons-table__cell--onSelect {
		font-weight: bold;
		color: #222222;
	}
	.ons-table__cell--numeric {
		overflow-wrap: initial;
	}
	.ons-table__cell--key {
		font-size: 24px;
		line-height: 24px;
		font-weight: bold;
		color: #222222;
	}
	.ons-table__cell--key span {
		font-size: 20px;
		line-height: 24px;
		font-weight: normal;
	}
</style>
