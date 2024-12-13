<script>
	import ThemeSwitcher from "../theme-switcher/theme-switcher.svelte";
	import { Trigger as SidebarTrigger } from "../ui/sidebar";
  import UserButton from 'clerk-sveltekit/client/UserButton.svelte'
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte'
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte'
</script>
<header class="grid grid-cols-2 w-full p-2 border-b">
  <div class="flex flex-row items-center gap-4">
    <SidebarTrigger />
    <h1 class="text-xl">
      <a href="/">InfluScan</a>
    </h1>
  </div>
  <div class="flex flex-row justify-end gap-2">
    <SignedOut>
      <a href="/sign-in">Sign in</a>
    </SignedOut>
    <ThemeSwitcher />
    <SignedIn>
      <UserButton afterSignOutUrl="/" />
    </SignedIn>
  </div>
</header>