<script lang="ts">
	import { page } from "$app/stores";
	import AppTable from "$lib/components/app-table/app-table.svelte";
	import type { ScanResult } from "$lib/models/scan";
	import { columns, tableConfiguration } from "./configurations";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { Label } from "$lib/components/ui/label";
	import { HelpCircle, LoaderCircle } from "lucide-svelte";
	import { analyze, buildScanResultObjectFromParsedRawData, search } from "./utilities";

  let scans: ScanResult[] = $state($page.data.scansResults ?? []);
	let addScanDialogOpened = $state(false);
	let submitMutipleInprogress = $state(false);
	let fileStructureInstructionsDialogOpened = $state(false);

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

	function onBulkActions(e: {type: string; data: any}) {
		console.log(e)
	}

</script>
<AppTable { columns } data={scans} configuration={tableConfiguration} addData={() => setScanDialogOpenState(true)} bulkActions={onBulkActions}/>

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
					<div class="grid w-full items-center gap-2">
						<Label for="csv">Details list</Label>
						<input id="csv" type="file" accept="text/csv" bind:files={files}/>
						<Button variant="ghost" class="italic text-sm text-muted-foreground flex flex-row gap-2 items-center w-fit"
							onclick={() => fileStructureInstructionsDialogOpened = true}>
							<span>File structure instructions</span>
							<HelpCircle size=12/>
						</Button>
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

<Dialog.Root bind:open={fileStructureInstructionsDialogOpened}>
  <Dialog.Content class="max-w-[800px]">
    <Dialog.Header>
      <Dialog.Title>File structure instructions</Dialog.Title>
      <Dialog.Description>
			Currenly we support only .csv files with a specific structure. Submitting different structures will result in unwanted behavior.
      </Dialog.Description>
    </Dialog.Header>
		<div class="flex flex-col gap-2 border rounded-md p-2 overflow-auto max-h-[50vh]">
			<h4 class="text-lg">Requirements:</h4>
			<ul class="list-inside list-disc pb-2 border-b border-b-muted-foreground">
				<li>Supported columns are: Name, Email & Address.</li>
				<li>Only the Name column is mandatory.</li>
			</ul>
			<h4 class="text-lg">File content example</h4>
			<article class="italic rounded-md p-1 bg-accent text-wrap">
				Name,Email,Address<br>
				David Cohen,david.cohen@example.com,123 Herzl St, Tel Aviv, Israel<br>
				Yael Levy,yael.levy@example.com,456 Ben Yehuda St, Haifa, Israel<br>
				Avi Shapiro,avi.shapiro@example.com,789 Rothschild Blvd, Jerusalem, Israel<br>
				Noa Abramov,noa.abramov@example.com,101 Hillel St, Eilat, Israel<br>
			</article>
		</div>
  </Dialog.Content>
</Dialog.Root>