<script lang="ts">
	import { page } from "$app/stores";
	import Shell from "$lib/components/shell/shell.svelte";
  import { Button } from "$lib/components/ui/button/index.js";

  let form: {results: unknown[]} = $state({ results: [] });
  
  page.subscribe((pageRes) => {
    form.results = pageRes?.form?.results ?? [];
  });
      
</script>
<Shell>
  <div class="flex flex-col items-center gap-2">
    <form method="POST" enctype="multipart/form-data">
      <input type="file" name="file" hidden accept="text/csv" />
      <Button variant="secondary">Upload</Button>
    </form>      
  </div>
</Shell>
