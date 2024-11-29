<script lang="ts">
  import House from "lucide-svelte/icons/house";
  import Settings from "lucide-svelte/icons/settings";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import Radar from "lucide-svelte/icons/radar";
	import CircleHelp from "lucide-svelte/icons/circle-help";
	import Send from "lucide-svelte/icons/send";
	import { Collapsible } from "bits-ui";
  
  const groups = [
    {
      label: "Application",
      items: [
        {
          title: "Home",
          url: "#",
          icon: House,
        },
        {
          title: "Scans",
          url: "#",
          icon: Radar,
        },
        {
          title: "Settings",
          url: "#",
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
          url: "#",
          icon: CircleHelp,
        },
        {
          title: "Feedback",
          url: "#",
          icon: Send,
        },
      ]
    }
  ];
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
          <Sidebar.MenuButton>
            {#snippet child({ props })}
            <a href={item.url} {...props}>
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
