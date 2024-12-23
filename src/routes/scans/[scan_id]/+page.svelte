<script lang="ts">
	import { page } from "$app/stores";
	import Menu from "$lib/components/menu/menu.svelte";
	import ScanResultEstimation from "$lib/components/scan-result-estimation/scan-result-estimation.svelte";
	import * as Card from "$lib/components/ui/card";
	import type { ScanResult } from "$lib/models/scan";
	import { title } from "$lib/stores";
	import { ChartNoAxesColumnIncreasing, LandPlot, Puzzle, Star } from "lucide-svelte";
	import { actionsMenuConfiguration } from "./configurations";
	import ScanResultRankings from "$lib/components/scan-result-rankings/scan-result-rankings.svelte";

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
		<div class="flex flex-row flex-wrap gap-4">
			<div class="flex flex-col gap-4 border rounded-md p-4 w-fit">
				<div class="flex flex-row items-center gap-2">
					<ChartNoAxesColumnIncreasing />
					<h3>Latest Estimation</h3>
				</div>
				<div class="flex flex-row gap-4">
					<span>{scanResult.estimation}%</span>
					<ScanResultEstimation estimation={scanResult.estimation}/>
				</div>
			</div>
			<div class="flex flex-row gap-4 border rounded-md p-4 w-fit">
				<div class="p-4 border rounded-md">
					<LandPlot size=24 />
				</div>
				<div class="flex flex-col gap-2">
					<h3 class="font-light">Domain</h3>
					<span class="font-semibold">{scanResult.domain}</span>
				</div>
			</div>
			<div class="flex flex-row gap-4 border rounded-md p-4 w-fit">
				<div class="p-4 border rounded-md">
					<Puzzle size=24 />
				</div>
				<div class="flex flex-col gap-2">
					<h3 class="font-light">Niche</h3>
					<span class="font-semibold">{scanResult.niche}</span>
				</div>
			</div>
			{#if scanResult.rankings && scanResult.rankings.length > 0}
				<div class="flex flex-row gap-4 border rounded-md p-4 w-fit">
					<div class="p-4 border rounded-md">
						<Star size=24 />
					</div>
					<div class="flex flex-col gap-2">
						<h3 class="font-light">Rankings</h3>
						<span class="font-semibold"><ScanResultRankings rankings={scanResult.rankings}/></span>
					</div>
				</div>
			{/if}
		</div>
  </Card.Content>
  <Card.Footer>
		<!-- Danger zone: Delete, Reset -->
  </Card.Footer>
</Card.Root>
