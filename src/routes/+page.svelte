<script lang="ts">
	import { page } from "$app/stores";

  let form: {results: unknown[]} = $state({ results: [] });
  let scanResults: unknown[] = $state([]);
  let analysisResults: unknown = $state();
  
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

  function analyze() {
    const body = new FormData();
    body.append('details', JSON.stringify(scanResults[1].name));
    body.append('results', JSON.stringify(scanResults[1].results));
    fetch('./api/analyze', {method: 'POST', body})
      .then((res) => {
        res.json().then((res) => {
          analysisResults = res.result;
        })
      })
  }
</script>
<div class="flex items-center justify-center h-[100vh] overflow-auto">
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
      <button onclick={scan}>Scan</button>
    {/if}
    <div class="max-h-96 max-w-xl overflow-auto">
      {#if scanResults.length > 0}
        <pre class="text-wrap">{JSON.stringify(scanResults, null, 2)}</pre>
      {/if}
    </div>
    {#if scanResults.length > 0}
      <button onclick={analyze}>Analyze</button>
    {/if}
    <div class="max-h-96 max-w-xl overflow-auto">
      {#if analysisResults}
        <pre class="text-wrap">{JSON.stringify(analysisResults, null, 2)}</pre>
      {/if}
    </div>
  </div>
</div>
