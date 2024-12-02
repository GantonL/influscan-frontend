<script lang="ts">
  import CircleOff from "lucide-svelte/icons/circle-off";
  import { Button } from "$lib/components/ui/button";
  import { type EmptyResultsConfiguration } from "$lib/models/common";

  const baseConfiguration: EmptyResultsConfiguration = {
    label: 'No Results',
    icon: CircleOff,
  }
  let { action, configuration }: {
      action: (event: string) => void;
      configuration: EmptyResultsConfiguration
    } = $props();
  $effect.pre(() => {
    configuration = {
      ...baseConfiguration,
      ...configuration,
    }
  });
</script>

<div class="border rounded-md p-4 flex flex-col gap-2 items-center justify-center {configuration.class ?? ''}">
  <div class="flex flex-col gap-2 items-center justify-center text-muted-foreground">
    <configuration.icon />
    <span>{configuration.label}</span>
  </div>
  {#if configuration?.action}
    <Button variant="secondary"
      onclick={() => configuration.action && action(configuration.action.event)}>
      {configuration.action.label}
    </Button>
  {/if}
</div>