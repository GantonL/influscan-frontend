<script lang="ts">
	import type { ScanResult } from "$lib/models/scan";
	import * as Tooltip from "../ui/tooltip";

  let { explanation }: {explanation: ScanResult['explanation']} = $props();
</script>
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <div class="text-start italic max-lg:w-96 max-lg:truncate">{explanation}</div>
    </Tooltip.Trigger>
    <Tooltip.Content>{explanation}</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>