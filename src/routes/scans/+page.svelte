<script lang="ts">
	import { page } from "$app/stores";
	import AppTable from "$lib/components/app-table/app-table.svelte";
	import type { ScanResult } from "$lib/models/scan";
	import { columns, singleScanformSchema, tableConfiguration } from "./configurations";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { Label } from "$lib/components/ui/label";
	import { HelpCircle, LoaderCircle } from "lucide-svelte";
	import { analyze, buildScanResultObjectFromParsedRawData, createScanObject, search } from "./utilities";
	import * as Form from "$lib/components/ui/form";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Input } from "$lib/components/ui/input";
	import { goto } from "$app/navigation";

	type OmittedScanResult = Omit<ScanResult, 'user_id' | 'created_at'>; 
  let scans = $state<OmittedScanResult[]>($page.data.scansResults ?? []);
	let addScanDialogOpened = $state(false);
	let submitInprogress = $state(false);
	let fileStructureInstructionsDialogOpened = $state(false);

	const singleScanForm = superForm({name: '', email: '', address: ''}, {
		validators: zodClient(singleScanformSchema),
		onSubmit: () => submitInprogress = true,
		onUpdated: ({form}) => {
			submitInprogress = false;
			if (form.valid) {
				setScanDialogOpenState(false);
				const newScan = buildScanResultObjectFromParsedRawData(form.data);
				scans = [newScan, ...scans];
				scan(newScan);
			}
		},
		onError: () => {
			submitInprogress = false;
		},
 	});

 	const { form: singleScanFormData, enhance: singleScanFormEnhance } = singleScanForm;

  function setScanDialogOpenState(state: boolean) {
		addScanDialogOpened = state;
	}
	let files: FileList | undefined = $state();
	function onMultipleDetailsSubmit() {
		if (!files) { return; }
		submitInprogress = true;
		const body = new FormData();
		body.append('file', files[0]);
		fetch('/api/file-handler/parse-csv', {method: 'POST', body})
			.then((res) => {
				res.json().then((parsedData: {name: string, email: string, address: string}[]) => {
					const newScans = parsedData.map((d) => buildScanResultObjectFromParsedRawData(d));
					scans = [...newScans, ...scans];
					newScans.forEach((scanRes) => {
						scan(scanRes);
					})
				})
			})
			.finally(() => {
				files = undefined;
				submitInprogress = false;
				setScanDialogOpenState(false);
			})
	}

	async function scan(preScan: OmittedScanResult) {
		preScan.status = 'in_progress';
		
		const scanToUpdate = scans.find((scan) => scan.id === preScan.id);
		if (!scanToUpdate) {
			// error
			return;
		}
		const createScanObjectRes = await createScanObject(preScan);
		if (!createScanObjectRes) {
			// error
			return; 
		}
		const searchResults = await search(preScan.details);
		if (searchResults.error) {
			scanToUpdate.status = 'failed';
			// update scan;
			return;
		}
		let analysisDetails = preScan.details.name;
		const analysisResult = await analyze(analysisDetails , searchResults);
		
		scanToUpdate.estimation = analysisResult.estimation; 
		scanToUpdate.explanation = analysisResult.explanation;
		scanToUpdate.status = 'completed';
		// update scan
	}

	function onBulkActions(e: {type: string; data: any}) {
		switch (e?.type) {
			case 'delete':
				e.data.forEach((item: ScanResult) => {
					const scanToDeleteIndex = scans.findIndex((scan) => scan.id === item.id);
					if (scanToDeleteIndex > -1) {
						scans.splice(scanToDeleteIndex, 1);
						scans = [...scans];
					}
				})
				// Delete from db
				break;
			case 'scan':
				console.log(e.data)
				break;
			default:
				break;
		}
	}

	function onRowClick(e: {type: string; data: any}) {
		if (e.type === 'navigate') {
			goto(`scans/${e.data.id}`);
		}
	}

</script>
<AppTable { columns } data={scans} 
	configuration={tableConfiguration} 
	addData={() => setScanDialogOpenState(true)} 
	bulkActions={onBulkActions}
	rowClick={onRowClick}/>

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
							disabled={!files || submitInprogress}>
							<div class="flex flex-row gap-2 items-center">
								{#if submitInprogress}
									<LoaderCircle class="animate-spin"/>
								{/if}
								<span>Submit</span>
							</div>
						</Button>
					</div>
				</Tabs.Content>
				<Tabs.Content value="single">
					<form method="POST" action="?/dataFromInput" use:singleScanFormEnhance>
						<Form.Field form={singleScanForm} name="name">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Name</Form.Label>
									<Input {...props} bind:value={$singleScanFormData.name} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field form={singleScanForm} name="email">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Email</Form.Label>
									<Input {...props} bind:value={$singleScanFormData.email} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field form={singleScanForm} name="address">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Address</Form.Label>
									<Input {...props} bind:value={$singleScanFormData.address} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Button
							disabled={submitInprogress}>
							<div class="flex flex-row gap-2 items-center">
								{#if submitInprogress}
									<LoaderCircle class="animate-spin"/>
								{/if}
								<span>Submit</span>
							</div>
						</Form.Button>
					</form>
				</Tabs.Content>
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
				name,email,address<br>
				David Cohen,david.cohen@example.com,123 Herzl St, Tel Aviv, Israel<br>
				Yael Levy,yael.levy@example.com,456 Ben Yehuda St, Haifa, Israel<br>
				Avi Shapiro,avi.shapiro@example.com,789 Rothschild Blvd, Jerusalem, Israel<br>
				Noa Abramov,noa.abramov@example.com,101 Hillel St, Eilat, Israel<br>
			</article>
		</div>
  </Dialog.Content>
</Dialog.Root>