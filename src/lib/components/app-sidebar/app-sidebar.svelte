<script lang="ts">
  import Settings from "@lucide/svelte/icons/settings";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import Radar from "@lucide/svelte/icons/radar";
	import CircleHelp from "@lucide/svelte/icons/circle-help";
	import Send from "@lucide/svelte/icons/send";
	import { page } from "$app/stores";
	import { Plan } from "$lib/enums/plan";
	import { Button } from "../ui/button";
	import { PlansDisplayConfiguartion } from "$lib/configurations/plans";
	import { ChartColumn, Workflow } from "@lucide/svelte";
	import { useSidebar } from "$lib/components/ui/sidebar";
  
  let { plan }: {plan?: Plan} = $props();

  const groups = [
    {
      label: "Application",
      items: [
        {
          title: "Scans",
          url: "/scans",
          icon: Radar,
        },
        {
          title: "Stats",
          url: "/stats",
          icon: ChartColumn,
        },
        {
          title: "Integrations",
          url: "/integrations",
          icon: Workflow,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ]
    },
    {
      label: "Help",
      collapsible: true,
      items: [
        {
          title: "Support",
          url: "/support",
          icon: CircleHelp,     
          disabled: true,
        },
        {
          title: "Feedback",
          url: "/feedback",
          icon: Send,
          disabled: true,
        },
      ]
    }
  ];
  let currentPath = $derived($page.url.pathname);
  const sidebar = useSidebar();

  function onSidebarLink() {
    if (!sidebar.isMobile) { return; }
    sidebar.toggle();
  }
 </script>
  
 <Sidebar.Root collapsible="icon">
  <Sidebar.Content>
    {#each groups as group (group.label)}
    <Sidebar.Group>
      <Sidebar.GroupLabel>
        {group.label}
      </Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
        {#each group.items as item (item.title)}
          <Sidebar.MenuItem>
            <Sidebar.MenuButton 
              isActive={currentPath.startsWith(item.url)}>
              {#snippet child({ props })}
              <a href={item.url} {...props} onclick={onSidebarLink}>
                <item.icon />
                <span>{item.title}</span>
              </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
    {/each}
  </Sidebar.Content>
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton>
          {#snippet child({ props })}
            {@const planConfig = PlansDisplayConfiguartion[plan ?? Plan.None]}
            <a href="/plan">
              <Button variant="outline" {...props} class={'w-full ' + planConfig.class}>
                <planConfig.icon size=20 class={planConfig.iconClass} />
                {#if sidebar.open}
                  <span>{planConfig.name} plan</span>
                {/if}
              </Button>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
 </Sidebar.Root>
