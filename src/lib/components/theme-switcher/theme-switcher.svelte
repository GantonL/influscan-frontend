<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Sun, Moon } from "@lucide/svelte";
  import { toggleMode } from "mode-watcher";
</script>
<Button onclick={toggleMode} variant="outline" size="icon" class="aspect-square">
  <Sun
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-0 transition-all dark:-rotate-90 dark:scale-100 hidden dark:block"
  />
  <Moon
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0 dark:hidden block"
  />
  <span class="sr-only">Toggle theme</span>
</Button>
