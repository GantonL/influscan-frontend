<script lang="ts">
	import { page } from "$app/stores";
	import Menu from "$lib/components/menu/menu.svelte";
	import ScanResultEstimation from "$lib/components/scan-result-estimation/scan-result-estimation.svelte";
	import * as Card from "$lib/components/ui/card";
	import type { ScanResult } from "$lib/models/scan";
	import { title } from "$lib/stores";
	import { ChartNoAxesColumnIncreasing } from "lucide-svelte";
	import { actionsMenuConfiguration } from "./configurations";

	let scanResult: ScanResult = $page.data.scanResult;
  title.set(`${scanResult.details.name} | Scan Result`);

	function onMenuActionClicked(event: {type: string; data: any}) {

	}
</script>
<Card.Root class="w-full">
  <Card.Header>
    <Card.Title class="flex flex-row justify-between items-center">
			<h1>{scanResult.details.name}</h1>
			<Menu rawData={scanResult} configuration={actionsMenuConfiguration} event={onMenuActionClicked}/>
		</Card.Title>
    <Card.Description>{scanResult.explanation}</Card.Description>
  </Card.Header>
  <Card.Content>
		<!-- Additional data: images, sources, links, domains -->
		 <div class="flex flex-col gap-4 border rounded-md p-4 w-fit">
			<div class="flex flex-row items-center gap-2">
				<ChartNoAxesColumnIncreasing />
				<h3>Latest Estimation</h3>
			</div>
			<div class="flex flex-row items-start gap-4">
				<span>{scanResult.estimation}%</span>
				<ScanResultEstimation estimation={scanResult.estimation}/>
			</div>
		 </div>		
  </Card.Content>
  <Card.Footer>
		<!-- Danger zone: Delete -->
  </Card.Footer>
</Card.Root>
