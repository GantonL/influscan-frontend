<script lang="ts">
	import { page } from "$app/stores";
	import AppTable from "$lib/components/app-table/app-table.svelte";
	import type { ScanResult } from "$lib/models/scan";
	import { columns, singleScanformSchema, tableConfiguration } from "./configurations";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { Button } from "$lib/components/ui/button";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { Label } from "$lib/components/ui/label";
	import { HelpCircle, LoaderCircle } from "lucide-svelte";
	import { buildScanResultObjectFromParsedRawData, createScanObject, deleteScanObject, type OmittedScanResult } from "./utilities";
	import * as Form from "$lib/components/ui/form";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Input } from "$lib/components/ui/input";
	import { goto, replaceState } from "$app/navigation";
	import { title } from "$lib/stores";
	import { toast } from "svelte-sonner";
	import type { ScansSettings } from "$lib/models/settings";
	import { onDestroy, onMount } from "svelte";
	import { browser } from "$app/environment";
	import { PlansConfiguration } from "$lib/configurations/plans";
	import type { SortingState } from "@tanstack/table-core";
	import type { DateFilter } from "$lib/models/filter";

  let scans = $state<OmittedScanResult[]>($page.data.scansResults ?? []);
  let scansSettings = $state<ScansSettings>($page.data.scansSettings ?? {});
	let addScanDialogOpened = $state(false);
	let submitInprogress = $state(false);
	let fileStructureInstructionsDialogOpened = $state(false);
	let deleteScansDialogOpened = $state(false);
	let deleteCandidates: ScanResult[] = [];
	let deleteInProgress = $state(false);
	let table: any;
	let worker: Worker;
	let scansMonthlyLimit = $state<number>(PlansConfiguration.get($page.data.user.plan)?.monthly_limit ?? 0);
	let totalMonthlyScansCount = $state<number>($page.data.totalMonthlyScans);
	let limitReachedDialogOpened = $state(false);
	let filters: DateFilter[] = $state($page.data.viewSettings.filters ?? []);

	title.set('Scans');

	$effect.pre(() => {
		const configuredPageSize = $page.data.viewSettings.page_size;
		if (configuredPageSize) {
			tableConfiguration.pageSize = configuredPageSize;
		}
		const configuredSortBy = $page.data.viewSettings.sort_by;
		if (configuredSortBy) {
			tableConfiguration.sortingState = configuredSortBy;
		}
		const configuredFilters = $page.data.viewSettings.filters;
		if (configuredFilters) {
			if (tableConfiguration.dateFilter?.enabled) {
				const dateFilter = configuredFilters.find((f: DateFilter) => f.type === 'date');
				tableConfiguration.dateFilter.initialState = {
					start: new Date(dateFilter.start),
					end: new Date(dateFilter.end),
				}
			}
		}
	});

	onMount(() => {
		initializeWorker();
	});

	onDestroy(() => {
		worker?.terminate();
	});

	async function initializeWorker() {
    if (!browser) { return; }
		if (!window.Worker) { return; }
		const workerFile = await import('./worker.ts?worker');
		worker = new workerFile.default;
    worker.onmessage = ({ data }) => {
			if (data.message) {
				toast.error(data.message);
			}
			const result = data.scanResult;
			const scanToUpdate = scans.find(scan => scan.id === result?.id);
			if (!scanToUpdate) { return; }
			if (data.success === false || !result) {
				scanToUpdate.status = 'failed';
				return;
			}
			scanToUpdate.estimation = result.estimation; 
			scanToUpdate.explanation = result.explanation;
			scanToUpdate.status = result.status;
			scanToUpdate.rankings = result.rankings;
		}
	}

	const singleScanForm = superForm({name: '', email: '', address: ''}, {
		validators: zodClient(singleScanformSchema),
		onSubmit: () => submitInprogress = true,
		onUpdated: ({form}) => {
			submitInprogress = false;
			if (form.valid) {
				setScanDialogOpenState(false);
				const newScan = buildScanResultObjectFromParsedRawData(form.data);
				const proceed = () => {
					scans = [newScan, ...scans];
					if (!scansSettings?.start_scans_immediately) { 
						createScanObject(newScan);
						return;
					}
					newScan.status = 'in_progress';
					worker?.postMessage({task: 'scan', items: [newScan], settings: $state.snapshot(scansSettings)});
				}
				handleMonthlyLimitation(1, {
					proceed
				});
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
					const newScans = parsedData
						.filter((pd) => pd?.name)
						.map((d) => buildScanResultObjectFromParsedRawData(d));
					if (newScans?.length === 0) { 
						toast.error('This file has invalid structure or it is empty, no scans to execute.');
						return; 
					}
					const proceed = () => {
						if (parsedData.length > newScans.length) {
							toast.info(`${parsedData.length - newScans.length} items are invalid and has been filtered out.`);
						}
						scans = [...newScans, ...scans];
						if (!scansSettings?.start_scans_immediately) {
							newScans.forEach((scanRes) => {
								createScanObject(scanRes);
							});
							return;
						}
						newScans.forEach(scan => scan.status = 'queued');
						worker?.postMessage({task: 'scan', items: newScans, settings: $state.snapshot(scansSettings)});
					}
					handleMonthlyLimitation(newScans.length, {
						proceed
					});
				})
			})
			.finally(() => {
				files = undefined;
				submitInprogress = false;
				setScanDialogOpenState(false);
			})
	}

	function onBulkActions(e: {type: string; data: any}) {
		switch (e?.type) {
			case 'delete':
				deleteScansDialogOpened = true;
				deleteCandidates = e.data;
				break;
			case 'scan':
				const idsOfCandidates = (e.data as OmittedScanResult[]).map(i => i.id);
				const toRescan = scans
													.filter(scan => idsOfCandidates.includes(scan.id))
													.filter(scan => scan.status !== 'queued' && scan.status !== 'in_progress');
				if (toRescan.length < idsOfCandidates.length) {
					toast.info(`${idsOfCandidates.length - toRescan.length} items are already in progress or queued and has been filtered out.`);
				}
				toRescan.forEach(scan => scan.status = 'queued');
				worker?.postMessage({task: 'rescan', items: e.data, settings: $state.snapshot(scansSettings)});
				table?.resetSelection && table?.resetSelection();
				break;
			default:
				break;
		}
	}

	function onDelete(items: ScanResult[]) {
		const idsToDelete = items.map((item: ScanResult) => item.id);
		deleteInProgress = true;
		const finalized = () => {
			deleteCandidates = [];
			deleteScansDialogOpened = false;
			table?.resetSelection && table?.resetSelection();
		}
		deleteScanObject(idsToDelete)
			.then((deleteRes) => {
				deleteInProgress = false;
				if (deleteRes) {
					idsToDelete.forEach((id: ScanResult['id']) => {
						const scanToDeleteIndex = scans.findIndex((scan) => scan.id === id);
						if (scanToDeleteIndex > -1) {
							scans.splice(scanToDeleteIndex, 1);
							scans = [...scans];
						}
					});
					toast.success(`Successfully deleted selected items.`)
				} else {
					toast.error('Failed to delete selected items.')
				}
				finalized();
			}, _ => finalized());
	}

	function onRowClick(e: {type: string; data: any}) {
		if (e.type === 'navigate') {
			goto(`scans/${e.data.id}`);
		}
	}

	function handleMonthlyLimitation(amountToAdd: number, options: {proceed: () => void}) {
		if ((totalMonthlyScansCount + amountToAdd) > scansMonthlyLimit) { 
			limitReachedDialogOpened = true;
			return;
		}
		options.proceed();
	}

	function onPageSizeChanged(newPageSize: number) {
		$page.url.searchParams.set('pageSize', String(newPageSize));
		replaceState($page.url, $page.state);
		const body = new FormData();
		body.append('data', JSON.stringify({page_size: newPageSize}));
		const onError = () => toast.error('Failed to update selected page size');
		fetch('/api/view/scans', {method: 'PUT', body})
			.then((res) => {
				res.json().catch(onError);
			}, onError)
	}

	function onSortingChanged(state: SortingState) {
		$page.url.searchParams.set('sortBy', JSON.stringify(state));
		replaceState($page.url, $page.state);
		const body = new FormData();
		body.append('data', JSON.stringify({sort_by: state}));
		const onError = () => toast.error('Failed to update page sorting');
		fetch('/api/view/scans', {method: 'PUT', body})
			.then((res) => {
				res.json().catch(onError);
			}, onError)
	}

	function onFilterChanged(filter: DateFilter) {
		switch (filter.type) {
			case 'date':
				let dateFilter = filters?.find((f: DateFilter) => f.type === 'date');
				if (!dateFilter) {
					dateFilter = { type: 'date', path: filter.path };
					filters.push(dateFilter);
				}
				if (filter.start) {
					dateFilter.start = filter.start;
				}
				if (filter.end) {
					dateFilter.end = filter.end;
					const body = new FormData();
					body.append('data', JSON.stringify({filters}));
					const onError = () => toast.error('Failed to update page filters');
					fetch('/api/view/scans', {method: 'PUT', body})
						.then((res) => {
							res.json().catch(onError);
						}, onError);
				}
				$page.url.searchParams.set('filters', JSON.stringify(filters));
				replaceState($page.url, $page.state);
				break;
			default:
				break;
		}
	}

</script>
<AppTable { columns } data={scans}
	bind:this={table}
	configuration={tableConfiguration} 
	addData={() => setScanDialogOpenState(true)} 
	bulkActions={onBulkActions}
	rowClick={onRowClick}
	pageSizeChanged={onPageSizeChanged}
	sortingChanged={onSortingChanged}
	filterChanged={onFilterChanged}/>

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

<AlertDialog.Root bind:open={deleteScansDialogOpened}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the selected scan results.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action 
				disabled={deleteInProgress || submitInprogress}
				onclick={() => onDelete(deleteCandidates)} 
				class="bg-destructive text-destructive-foreground hover:bg-destructive/50 flex flex-row gap-2 items-center">
				{#if deleteInProgress}
					<LoaderCircle size=14 class="animate-spin"/>
				{/if}
				<span>DELETE</span>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={limitReachedDialogOpened}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Beware! You cannot exceed your monthly limit</AlertDialog.Title>
			<AlertDialog.Description>
				Please reduce the amount of scans to meet the monthly limit set by your current plan.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action onclick={() => limitReachedDialogOpened = false}>I understand</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>