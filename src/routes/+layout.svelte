<script lang="ts">
	import AppSidebar from "$lib/components/app-sidebar/app-sidebar.svelte";
	import Shell from "$lib/components/shell/shell.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import { title } from "$lib/stores";
  import { Toaster } from "$lib/components/ui/sonner";
	import { page } from "$app/stores";
	import type { User } from "$lib/models/user";
  let { children } = $props();
  const user: User | undefined = $state<User | undefined>($page.data.user);
</script>
<svelte:head>
	<title>{$title}</title>
</svelte:head>
<ModeWatcher />
<Sidebar.Provider>
  <SignedIn>
    <AppSidebar plan={user?.plan}/>
  </SignedIn>
  <Shell>
    {@render children?.()}
  </Shell>
</Sidebar.Provider>
<Toaster />