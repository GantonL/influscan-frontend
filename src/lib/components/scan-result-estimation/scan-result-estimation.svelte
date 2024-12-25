<script lang="ts">
	import type { ScanResult } from "$lib/models/scan";
  import * as Tooltip from "$lib/components/ui/tooltip";
	import Gauge from "../gauge/gauge.svelte";
  let { estimation, size }: { estimation: Required<ScanResult['estimation']>, size?: number } = $props();
</script>
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
       <Gauge value={estimation ?? 0}/>
    </Tooltip.Trigger>
    <Tooltip.Content>{estimation}%</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>