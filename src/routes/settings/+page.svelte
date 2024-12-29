<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import type { ScansSettings } from "$lib/models/settings";
	import { title } from "$lib/stores";
	import { LoaderCircle } from "lucide-svelte";
	import { ScansSettingsConfigurations } from "./configurations";
	import { updateScansSettings } from "./utilities";
	import Combobox from "$lib/components/combobox/combobox.svelte";
  title.set('Settings');
  const scansSettings: Omit<ScansSettings, 'user_id'> = $state($page.data.scansSettings);
  const actionsInProgressStates: Record<string, boolean> = $state({});
  let submmitionInProgress = $state(false);

  function setInProgress(path: keyof Omit<ScansSettings, 'user_id'>, value: boolean) {
    submmitionInProgress = value;
    actionsInProgressStates[path] = value;
  }

  function changeScansSettings(path: keyof Omit<ScansSettings, 'user_id'>, value: any) {
    setInProgress(path, true);
    const updateObject: Partial<Omit<ScansSettings, 'user_id'>> = {};
    updateObject[path] = value;
    updateScansSettings(updateObject)
      .then((res) => {
        setInProgress(path, false)
        if (res.success) {
          scansSettings[path] = value;
        }
      }, () => setInProgress(path, false));
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
          <div class="flex flex-row justify-start w-full">
            <Button 
              onclick={() => changeScansSettings(item.path, !scansSettings[item.path])}
              disabled={submmitionInProgress || actionsInProgressStates[item.path]}
              variant={scansSettings[item.path] ? 'default' : 'secondary'}
              class="flex flex-row items-center gap-2 min-w-20">
              {#if actionsInProgressStates[item.path]}
                <LoaderCircle size=14 class="animate-spin"/>
              {:else}
                {scansSettings[item.path] ? 'Enabled' : 'Disabled'}
              {/if}
            </Button>
          </div>
        {:else if item.action.type === 'choises'}
          <Combobox 
            disabled={submmitionInProgress || actionsInProgressStates[item.path]}
            inProgress={actionsInProgressStates[item.path]}
            configuration={{options: item.action.options}} 
            selectedOption={scansSettings[item.path] as string}
            event={(e) => changeScansSettings(item.path, e.data)}/>
        {/if}
      </Card.Footer>
    {/if}
  </Card.Root>
  {/each}
{/if}