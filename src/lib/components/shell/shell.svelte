<script>
	import Footer from "./footer.svelte";
	import Header from "./header.svelte";

  let { children } = $props();
</script>

<div class="flex flex-col flex-grow h-screen overflow-hidden">
  <Header />
  <div class="h-[calc(100%-3.55rem)] flex flex-col items-center flex-grow relative overflow-y-auto overflow-x-hidden">
    <div class="flex flex-col items-center flex-grow gap-8 p-4 w-full max-w-[1200px]">
      {@render children()}
    </div>
    <Footer />
  </div>
</div>
