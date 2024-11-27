<script>

	import ThemeSwitcher from "../theme-switcher/theme-switcher.svelte";

</script>
<header class="grid grid-cols-2 w-full p-2 border-b">
  <div class="flex flex-row items-center gap-4">
    <h1 class="text-xl">InfluScan</h1>
  </div>
  <div class="flex flex-row justify-end gap-2">
    <ThemeSwitcher />
  </div>
</header>