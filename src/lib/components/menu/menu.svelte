<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import type { MenuConfiguration } from "$lib/models/menu";
  
  let { rawData, configuration, event }: { rawData: any, configuration: MenuConfiguration<any>, event: (e: {type: string; data: any}) => void } = $props();
  
</script>

  
<DropdownMenu.Root>
<DropdownMenu.Trigger>
  {#snippet child({ props })}
  <Button
    {...props}
    variant={configuration.buttonVariant ?? "ghost"}
    size={configuration.label ? "default" : "icon"}
    class="flex flex-row gap-2 item-center relative"
  >
    <span class="sr-only">Open menu</span>
    {#if configuration.trigger} 
      <configuration.trigger class={configuration.triggerClass} />
    {:else}
      <Ellipsis class="size-4 rotate-90"/>
    {/if}
    {#if configuration.label}
      <span>{configuration.label}</span>
    {/if}
  </Button>
  {/snippet}
</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    {#each configuration.groups as group, index}
      <DropdownMenu.Group>
        {#if group.header}
        <DropdownMenu.GroupHeading>{group.header}</DropdownMenu.GroupHeading>
        {/if}
        {#each group.items as item}
        <DropdownMenu.Item 
          class={item.class}
          disabled={item.disableIf && item.disableIf(rawData)}
          onclick={() => event({type: item.event, data: rawData})}>
          <div class="flex flex-row gap-2 items-center">
            {#if item.icon}
              <item.icon size=16/>
            {/if}
            {item.title}
          </div>
        </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Group>
      {#if index < configuration.groups.length - 1}
      <DropdownMenu.Separator />
      {/if}
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
