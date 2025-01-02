<script lang="ts">
  import Settings from "lucide-svelte/icons/settings";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import Radar from "lucide-svelte/icons/radar";
	import CircleHelp from "lucide-svelte/icons/circle-help";
	import Send from "lucide-svelte/icons/send";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
  
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
          title: "Settings",
          url: "/settings",
          icon: Settings,
          disabled: true,
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

  let sidebar: { isMobile: boolean, toggle: () => void };
  onMount(() => {
    sidebar = Sidebar.useSidebar();
  });

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
 </Sidebar.Root>
