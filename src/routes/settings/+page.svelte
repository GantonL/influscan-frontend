<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import type { ScansSettings } from "$lib/models/settings";
	import { title } from "$lib/stores";
	import { LoaderCircle } from "lucide-svelte";
	import { ScansSettingsConfigurations } from "./configurations";
  title.set('Settings');
  const scansSettings: ScansSettings = $state($page.data.scansSettings);
  const actionsInProgressStates: Record<string, boolean> = $state({});
  let submmitionInProgress = $state(false);

  function changeScansSettings(path: string) {
    submmitionInProgress = true;
    actionsInProgressStates[path] = true;
  }
</script>
{#if scansSettings}
  <h1 class="text-4xl">{ScansSettingsConfigurations.title}</h1>
  {#each ScansSettingsConfigurations.items as item}
  <Card.Root class="w-full">
    <Card.Header>
      <Card.Title>{item.title}</Card.Title>
      <Card.Description>{item.description}</Card.Description>
    </Card.Header>
    {#if item.action}
      <Card.Footer class="mt-2 w-full">
        {#if item.action.type === 'boolean'}
          <div class="flex flex-row justify-end w-full">
            <Button 
              onclick={() => changeScansSettings(item.path)}
              disabled={submmitionInProgress || actionsInProgressStates[item.path]}
              variant={scansSettings[item.path] ? 'default' : 'secondary'}
              class="flex flex-row items-center gap-2">
              {#if actionsInProgressStates[item.path]}
                <LoaderCircle size=14 class="animate-spin"/>
              {/if}
              {scansSettings[item.path] ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        {/if}
      </Card.Footer>
    {/if}
  </Card.Root>
  {/each}
{/if}