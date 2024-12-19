<script>
	import { title } from "$lib/stores";
	import { ShieldCheck } from "lucide-svelte";
  title.set('Successful sign-in');
</script>
<div class="flex flex-col items-center gap-4">
  <ShieldCheck size=40/>
  <h1 class="text-2xl">You are in!</h1>
</div>