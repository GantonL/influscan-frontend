<script>
	import Footer from "./footer.svelte";
	import Header from "./header.svelte";

  let { children } = $props();
</script>

<div class="h-screen overflow-hidden">
  <Header />
  <div class="h-[calc(100%-3.55rem)] flex flex-col items-center flex-grow relative overflow-y-auto overflow-x-hidden">
    <main class="flex flex-col items-center gap-8 p-4 flex-auto w-full max-w-[1200px]">
      {@render children()}
    </main>
    <Footer />
  </div>
</div>
