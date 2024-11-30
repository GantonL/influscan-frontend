<script>
	import AppSidebar from "$lib/components/app-sidebar/app-sidebar.svelte";
	import Shell from "$lib/components/shell/shell.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar";
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  let { children } = $props();
</script>
<ModeWatcher />
<Sidebar.Provider>
  <AppSidebar />
  <Shell>
    {@render children?.()}
  </Shell>
</Sidebar.Provider>