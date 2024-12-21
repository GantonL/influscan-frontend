<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { title } from "$lib/stores";
	import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";
	import SignedOut from "clerk-sveltekit/client/SignedOut.svelte";
  title.clear();
</script>
<div class="flex flex-col gap-6 align-start max-w-[400px]">
  <h1 class="text-4xl text-balance">Discover your customers influencial footprint</h1>
  <p class="text-base text-balance">Grow your business by increasing engagement with local influencenres</p>
  <div class="flex flex-row gap-4">
    <SignedIn>
      <Button><a href="/scans">Get started</a></Button>
    </SignedIn>
    <SignedOut>
      <Button variant="outline"><a href="/sign-in">Sign in</a></Button>
      <Button><a href="/support/demo">Request a demo</a></Button>
    </SignedOut>
  </div>
</div>