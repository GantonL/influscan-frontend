<script>
	import AppSidebar from "$lib/components/app-sidebar/app-sidebar.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar";
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  let { children } = $props();
</script>
<ModeWatcher />
<Sidebar.Provider>
  <AppSidebar />
  {@render children?.()}
</Sidebar.Provider>