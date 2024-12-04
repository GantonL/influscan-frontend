<script lang="ts">
	import type { ScanResult } from "$lib/models/scan";
  import * as Tooltip from "$lib/components/ui/tooltip";

  let { estimation }: { estimation: Required<ScanResult['estimation']> } = $props();
  const colorConfiguration: string[] = [
    "bg-red-500 h-[0.5rem]",
    "bg-orange-500 h-[0.6rem]",
    "bg-yellow-500 h-[0.7rem]",
    "bg-yellow-400 h-[0.8rem]",
    "bg-lime-400 h-[0.9rem]",
    "bg-lime-300 h-[1rem]",
    "bg-green-300 h-[1.1rem]",
    "bg-green-400 h-[1.2rem]",
    "bg-green-500 h-[1.3rem]",
    "bg-green-600 h-[1.4rem]", 
  ];
</script>
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {@render estimationScale(estimation)}
    </Tooltip.Trigger>
    <Tooltip.Content>{estimation}</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
{#snippet estimationScale(est: typeof estimation)}
  {@const scaleElements = new Array(Math.ceil(est!/10))}
  <div class="flex flex-row gap-1 items-end">
    {#each scaleElements as _, index}
      <div class="w-2 rounded-lg {colorConfiguration[index]}"></div>
    {/each}
  </div>
{/snippet}