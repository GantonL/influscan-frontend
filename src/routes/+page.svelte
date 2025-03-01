<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { title } from "$lib/stores";
	import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";
	import SignedOut from "clerk-sveltekit/client/SignedOut.svelte";
	import Plans from "./plans.svelte";
	import type { User } from "$lib/models/user";
	import { page } from "$app/stores";
	import { Plan } from "$lib/enums/plan";
	import { LogIn, Zap } from "lucide-svelte";
	import Features from "./features.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
  title.clear();
  const user: User | undefined = $state<User | undefined>($page.data.user); 
</script>
<div class="flex flex-row flex-wrap gap-8">
  <div class="flex flex-col gap-6 items-center max-w-[400px]">
    <h1 class="text-4xl text-balance text-center">Discover your customers influencial footprint</h1>
    <p class="text-base text-balance text-center">Grow your business by increasing engagement with local influenceres</p>
    <div class="flex flex-row gap-4">
      <SignedIn>
        <Button><a href="/scans" class="flex flex-row items-center gap-2"><Zap size=16/><span>Get started</span></a></Button>
      </SignedIn>
      <SignedOut>
        <Button variant="secondary"><a href="/sign-in" class="flex flex-row items-center gap-2"><LogIn size=16/><span>Sign in</span></a></Button>
      </SignedOut>
    </div>
  </div>
</div>
<Separator />
<Features />
{#if (!user?.plan || user?.plan === Plan.None )}
<Separator />
<Plans />
{/if}