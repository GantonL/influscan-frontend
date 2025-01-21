<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import type { ScansSettings, SettingsChoisesAction, SettingsItemConfiguration, SettingsTextAction } from "$lib/models/settings";
	import { title } from "$lib/stores";
	import { LoaderCircle } from "lucide-svelte";
	import { ScansSettingsConfigurations } from "./configurations";
	import { updateScansSettings } from "./utilities";
	import Combobox from "$lib/components/combobox/combobox.svelte";
	import type { User } from "$lib/models/user";
	import { Plan } from "$lib/enums/plan";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
  title.set('Settings');
  const scansSettings: Omit<ScansSettings, 'user_id'> = $state($page.data.scansSettings);
  const user: User = $state($page.data.user);
  const actionsInProgressStates: Record<string, boolean> = $state({});
  let submmitionInProgress = $state(false);
  let configurations = ScansSettingsConfigurations;
  
  $effect.pre(() => {
    configurations.items.forEach(item => {
      const isInPlan = !item.plans || item.plans.includes(user.plan ?? Plan.None);
      item.disabled = !isInPlan;
      item.requiresUpgrade = !isInPlan;
      if (item.action?.type === 'choises') {
        item.action.options.forEach((option) => {
          option.disabledIfArgs = user;
        })
      }
    })
  });

  function setInProgress(path: keyof Omit<ScansSettings, 'user_id'>, value: boolean) {
    submmitionInProgress = value;
    actionsInProgressStates[path] = value;
  }

  function changeScansSettings(path: keyof Omit<ScansSettings, 'user_id'>, value: any) {
    if (scansSettings[path] === value) { return; }
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
  <h1 class="text-4xl">{configurations.title}</h1>
  {#each configurations.items as item}
  <Card.Root class="w-full">
    <Card.Header>
      <Card.Title>{item.title}</Card.Title>
      <Card.Description>{item.description}</Card.Description>
    </Card.Header>
    {#if item.action}
      <Card.Footer class="mt-2 flex flex-col items-start gap-2">
        {@render action(item)}
        {#if item.children}
          <div class="flex flex-col gap-4 p-2 border rounded-md">
            {#each item.children as child}
              {@render action(child)}
            {/each}
          </div>
        {/if}
      </Card.Footer>
    {/if}
  </Card.Root>
  {/each}
{/if}

{#snippet combobox(item: SettingsItemConfiguration<Omit<ScansSettings, "user_id">>)}
  <Combobox 
    disabled={submmitionInProgress || actionsInProgressStates[item.path]}
    inProgress={actionsInProgressStates[item.path]}
    configuration={{options: (item.action as SettingsChoisesAction).options}} 
    selectedOption={scansSettings[item.path] as string}
    event={(e) => changeScansSettings(item.path, e.data)}/>
{/snippet}

{#snippet boolean(item: SettingsItemConfiguration<Omit<ScansSettings, "user_id">>)}
  <Button 
    onclick={() => changeScansSettings(item.path, !scansSettings[item.path])}
    disabled={submmitionInProgress || actionsInProgressStates[item.path] || item.disabled}
    variant={scansSettings[item.path] ? 'default' : 'secondary'}
    class="flex flex-row items-center gap-2 min-w-20">
    {#if actionsInProgressStates[item.path]}
      <LoaderCircle size=14 class="animate-spin"/>
    {:else}
      {scansSettings[item.path] ? 'Enabled' : 'Disabled'}
    {/if}
  </Button>
{/snippet}

{#snippet text(item: SettingsItemConfiguration<Omit<ScansSettings, "user_id">>)}
  <div class="flex w-full max-w-sm flex-col gap-2">
    <Label for={item.title}>{item.title}</Label>
    <Input type="text" id={item.title} 
      onchange={(e: Event) => changeScansSettings(item.path, e.target.value)}
      bind:value={scansSettings[item.path]}
      placeholder={(item.action as SettingsTextAction).placeholder} 
      disabled={submmitionInProgress || actionsInProgressStates[item.path] || item.disabled}/>
    <p class="text-muted-foreground text-sm italic">{item.description}</p>
  </div>
{/snippet}

{#snippet action(item: SettingsItemConfiguration<Omit<ScansSettings, "user_id">>)}
<div class="flex flex-row items-center gap-2">
  {#if item.action.type === 'boolean'}
    {@render boolean(item)}
  {:else if item.action.type === 'choises'}
    {@render combobox(item)}
  {:else if item.action.type === 'text'}
    {@render text(item)}
  {/if}
  {#if item.requiresUpgrade}
    <Button variant='link'><a href="/plan" class="italic text-muted-foreground">*Upgrade plan to enbable</a></Button>
  {/if}
</div>
{/snippet}