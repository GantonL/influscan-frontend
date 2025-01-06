<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { title } from "$lib/stores";
	import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";
	import SignedOut from "clerk-sveltekit/client/SignedOut.svelte";
	import FunnyAvatars from "./funny-avatars.svelte";
	import Plans from "./plans.svelte";
	import type { User } from "$lib/models/user";
	import { page } from "$app/stores";
	import { Plan } from "$lib/enums/plan";
  title.clear();
  const user: User | undefined = $state<User | undefined>($page.data.user); 
</script>
<div class="flex flex-row flex-wrap gap-8">
  <div class="flex flex-col gap-6 align-start max-w-[400px]">
    <h1 class="text-4xl text-balance">Discover your customers influencial footprint</h1>
    <p class="text-base text-balance">Grow your business by increasing engagement with local influenceres</p>
    <div class="flex flex-row gap-4">
      <SignedIn>
        <Button><a href="/scans">Get started</a></Button>
      </SignedIn>
      <SignedOut>
        <Button variant="outline"><a href="/sign-in">Sign in</a></Button>
        <Button>Try for free</Button>
      </SignedOut>
    </div>
  </div>
  <FunnyAvatars />
</div>
{#if (!user?.plan || user?.plan === Plan.None )}
<Plans />
{/if}