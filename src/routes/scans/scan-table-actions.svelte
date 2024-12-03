<script lang="ts">
	import Menu from "$lib/components/menu/menu.svelte";
	import { type AppCustomEvent } from "$lib/models/common";
	import type { ScanResult } from "$lib/models/scan";
	import { actionsMenu } from "./configurations";
  let {data} = $props();

  function onActions(e: AppCustomEvent<ScanResult>) {
    console.log(e);
  }
</script>
<Menu rawData={data} configuration={actionsMenu} event={onActions}/>