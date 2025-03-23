<script lang="ts">
  import type { ComponentProps } from "svelte";
  import ArrowUpDown from "@lucide/svelte/icons/arrow-up-down";
  import { Button } from "$lib/components/ui/button/index.js";
 
  let { label, variant = "ghost", ...restProps }: {label: string} & ComponentProps<typeof Button> = $props();
</script>
 
<Button {variant} {...restProps} class="flex flex-row items-center gap-2">
  <span>{label}</span>
  <ArrowUpDown size=14/>
</Button>