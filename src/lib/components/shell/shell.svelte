<script>
	import Footer from "./footer.svelte";
	import Header from "./header.svelte";

  let { children } = $props();
</script>

<div class="flex flex-col items-center min-h-screen overflow-hidden">
  <Header />
  <div class="flex flex-col items-center gap-8 p-4 flex-auto w-full max-w-[1200px]">
    <main class="container mx-auto flex-grow">
      {@render children()}
    </main>
    <Footer />
  </div>
</div>
