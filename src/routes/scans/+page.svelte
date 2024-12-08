<script lang="ts">
	import { page } from "$app/stores";
	import AppTable from "$lib/components/app-table/app-table.svelte";
	import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import type { ScanResult } from "$lib/models/scan";
	import { columns, emptyResultsConfiguration } from "./configurations";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { Label } from "$lib/components/ui/label";
	import { LoaderCircle } from "lucide-svelte";
	import { analyze, buildScanResultObjectFromParsedRawData, search } from "./utilities";

  let scans: ScanResult[] = $state($page.data.scansResults ?? []);
	let addScanDialogOpened = $state(false);
	let submitMutipleInprogress = $state(false);

  function setScanDialogOpenState(state: boolean) {
		addScanDialogOpened = state;
	}
	let files: FileList | undefined = $state();
	function onMultipleDetailsSubmit() {
		if (!files) { return; }
		submitMutipleInprogress = true;
		const body = new FormData();
		body.append('file', files[0]);
		fetch('/api/file-handler/parse-csv', {method: 'POST', body})
			.then((res) => {
				res.json().then((parsedData: {Name: string, Email: string, Address: string}[]) => {
					scans = parsedData.map((d) => buildScanResultObjectFromParsedRawData(d));
					scans.forEach((scanRes, index) => {
						scan(scanRes.id, parsedData[index]);
					})
				})
			})
			.finally(() => {
				files = undefined;
				submitMutipleInprogress = false;
				setScanDialogOpenState(false);
			})
	}

	async function scan(id: string, rawData: {Name: string, Email: string, Address: string}) {
		const searchResults = await search(rawData);
		let analysisDetails = rawData.Name;
		if (rawData.Email) {
			analysisDetails.concat(`, ${rawData.Email}`);
		}
		if (rawData.Address) {
			analysisDetails.concat(`, ${rawData.Address}`);
		}
		const analysisResult = await analyze(analysisDetails , searchResults);
		const scanToUpdate = scans.find((scan) => scan.id === id);
		if (!scanToUpdate) {
			// error
			return;
		}
		scanToUpdate.estimation = analysisResult.estimation; 
		scanToUpdate.explanation = analysisResult.explanation;
		scanToUpdate.status = 'completed';
	}

</script>
<AppTable { columns } data={scans} addData={() => setScanDialogOpenState(true)}/>

<Dialog.Root open={addScanDialogOpened} controlledOpen={true} onOpenChange={setScanDialogOpenState}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add scan details</Dialog.Title>
      <Dialog.Description>
			The details of potential influencers.    
      </Dialog.Description>
    </Dialog.Header>
		<Tabs.Root value="multiple" class="flex flex-col gap-2">
			<Tabs.List class="w-full">
				<Tabs.Trigger class="flex-grow" value="multiple">Multiple</Tabs.Trigger>
				<Tabs.Trigger class="flex-grow" value="single">Single</Tabs.Trigger>
			</Tabs.List>
			<div class="p-2 border rounded-md">
				<Tabs.Content value="multiple">
					<div class="grid w-full items-center gap-1.5">
						<Label for="csv">Details list</Label>
						<input id="csv" type="file" accept="text/csv" bind:files={files}/>
						<Button onclick={onMultipleDetailsSubmit}
							disabled={!files || submitMutipleInprogress}>
							<div class="flex flex-row gap-2 items-center">
								{#if submitMutipleInprogress}
									<LoaderCircle class="animate-spin"/>
								{/if}
								<span>Submit</span>
							</div>
						</Button>
					</div>
				</Tabs.Content>
				<Tabs.Content value="single"></Tabs.Content>
			</div>
		</Tabs.Root>
  </Dialog.Content>
</Dialog.Root>