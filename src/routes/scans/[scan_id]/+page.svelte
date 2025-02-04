<script lang="ts">
	import { page } from "$app/stores";
	import Menu from "$lib/components/menu/menu.svelte";
	import * as Card from "$lib/components/ui/card";
	import type { ScanResult } from "$lib/models/scan";
	import { title } from "$lib/stores";
	import { ChartNoAxesColumnIncreasing, ExternalLink, Image, LandPlot, Puzzle, Star } from "lucide-svelte";
	import { actionsMenuConfiguration } from "./configurations";
	import ScanResultRankings from "$lib/components/scan-result-rankings/scan-result-rankings.svelte";
	import Gauge from "$lib/components/gauge/gauge.svelte";

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
		<div class="flex flex-col gap-4">
			<div class="flex flex-row flex-wrap gap-4">
				<div class="flex flex-col gap-4 border rounded-md p-4 w-fit">
					<div class="flex flex-row items-center gap-2">
						<ChartNoAxesColumnIncreasing />
						<h3>Latest Estimation</h3>
					</div>
					<Gauge value={scanResult.estimation ?? 0}/>
				</div>
				<div class="flex flex-col gap-4 border rounded-md p-4 w-fit">
					<div class="flex flex-row items-center gap-2">
						<LandPlot />
						<h3>Domain</h3>
					</div>
					<span class="font-semibold">{scanResult.domain}</span>
				</div>
				<div class="flex flex-col gap-4 border rounded-md p-4 w-fit">
					<div class="flex flex-row items-center gap-2">
						<Puzzle />
						<h3>Niche</h3>
					</div>
					<span class="font-semibold">{scanResult.niche}</span>
				</div>
				{#if scanResult.rankings && scanResult.rankings.length > 0}
				<div class="flex flex-col gap-4 border rounded-md p-4 w-fit">
					<div class="flex flex-row items-center gap-2">
						<Star />
						<h3>Rankings</h3>
					</div>
					<span class="font-semibold"><ScanResultRankings rankings={scanResult.rankings}/></span>
				</div>
				{/if}
			</div>
			{#if scanResult.images && scanResult.images.length > 0}
			<div class="flex flex-col gap-4 border rounded-md p-4 w-fit">
				<div class="flex flex-row items-center gap-2">
					<Image />
					<h3>Images</h3>
				</div>
				<div class="flex flex-row gap-2 flex-wrap">
					{#each scanResult.images as image}
						<img src={image} alt="">
					{/each}
				</div>
			</div>
			{/if}
			{#if scanResult.sources && scanResult.sources.length > 0}
			<div class="flex flex-col gap-4 border rounded-md p-4 w-fit">
				<div class="flex flex-row items-center gap-2">
					<ExternalLink />
					<h3>Sources</h3>
				</div>
				<div class="flex flex-col gap-2 flex-wrap">
					{#each scanResult.sources as source}
						<a href={source}>{source}</a>
					{/each}
				</div>
			</div>
			{/if}
		</div>
  </Card.Content>
  <Card.Footer>
		<!-- Danger zone: Delete, Reset -->
  </Card.Footer>
</Card.Root>
