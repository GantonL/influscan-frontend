<script lang="ts">
	import { page } from "$app/stores";
	import AppTable from "$lib/components/app-table/app-table.svelte";
	import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import type { ScanResult } from "$lib/models/scan";
	import { columns, emptyResultsConfiguration, scanActionsMenuEvents } from "./configurations";

  

  const scans: ScanResult[] = $state($page.data.scansResults ?? []);

  function onAddScan(event: string) {
    
  }
	const unsubscriber = scanActionsMenuEvents.subscribe((event) => {
		console.log(event)
	})
</script>
{#if scans.length === 0}
<EmptyResults configuration={emptyResultsConfiguration} action={onAddScan}/>
{:else}
<AppTable { columns } data={scans} />
{/if}