<script>
	import ThemeSwitcher from "../theme-switcher/theme-switcher.svelte";
	import { Trigger as SidebarTrigger } from "../ui/sidebar";
	import { Badge } from "../ui/badge";
  import UserButton from 'clerk-sveltekit/client/UserButton.svelte'
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte'
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte'
	import Button from "../ui/button/button.svelte";
	import { Radar } from "@lucide/svelte";
</script>
<header class="grid grid-cols-2 w-full p-2 border-b">
  <div class="flex flex-row items-center gap-4">
    <SignedIn>
      <SidebarTrigger />
    </SignedIn>
    <h1 class="flex flex-row items-center gap-3 text-xl">
      <Radar />
      <a href="/">InfluScan</a>
      <Badge variant="secondary">Preview</Badge>
    </h1>
  </div>
  <div class="flex flex-row justify-end items-center gap-2">
    <SignedOut>
      <Button variant="ghost">
        <a href="/sign-in">Sign in</a>
      </Button>
    </SignedOut>
    <ThemeSwitcher />
    <SignedIn>
      <UserButton afterSignOutUrl="/" />
    </SignedIn>
  </div>
</header>