<script lang="ts">
	import type { ScanResult } from "$lib/models/scan";

  let { explanation }: {explanation: ScanResult['explanation']} = $props();
</script>
<span class="italic">{explanation}</span>