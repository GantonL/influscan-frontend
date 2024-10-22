<script lang="ts">
	import { page } from "$app/stores";

  let form: {results: unknown[]} = { results: [] };
  let scanResults: unknown[] = [];

  page.subscribe((pageRes) => {
    form.results = pageRes?.form?.results ?? [];
  });
  
  function scan() {
    const body = new FormData();
    body.append('data', JSON.stringify(form.results));
    fetch('./api/scan', {method: 'POST', body})
      .then((res) => {
        res.json().then((res) => {
          scanResults = res.results;
        })
      })
  }
</script>
<div class="flex items-center justify-center h-[75vh]">
  <div class="flex flex-col items-center gap-2">
    <h1 class="text-4xl font-bold">InfluScan</h1>
    <p class="text-lg">Identify your customers influencial footprint</p>
    <form method="POST" enctype="multipart/form-data">
      <input type="file" name="file" accept="text/csv" />
      <button>Submit</button>
    </form>
    <div class="max-h-96 overflow-auto">
      {#if form.results.length > 0}
        <pre>{JSON.stringify(form.results, null, 2)}</pre>
      {/if}
    </div>
    {#if form.results.length > 0}
      <button on:click={scan}>Scan</button>
    {/if}
    <div class="max-h-96 overflow-auto">
      {#if scanResults.length > 0}
        <pre>{JSON.stringify(scanResults, null, 2)}</pre>
      {/if}
    </div>
  </div>
</div>
