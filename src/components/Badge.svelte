<script lang="ts">
	export let className: string;
</script>

<div class={`text-sm font-bold text-white px-1.5 py-0.5 rounded-sm ${className}`}>
	<slot />
</div>
