<script lang="ts">
	import { page } from "$app/stores";

  $: form = $page.form;
  $: inProgress = !form?.done;

</script>
<div class="flex items-center justify-center h-[75vh]">
  <div class="flex flex-col items-center gap-2">
    <h1 class="text-4xl font-bold">InfluScan</h1>
    <p class="text-lg">Identify your customers influencial footprint</p>
    <form method="POST" enctype="multipart/form-data">
      <input type="file" name="file" accept="text/csv" />
      <button on:click={() => inProgress = true}>Submit</button>
    </form>
    <div class="max-h-96  overflow-auto">
      {#if form?.results && !inProgress}
        <pre>{JSON.stringify(form.results, null, 2)}</pre>
      {/if}
    </div>
  </div>
</div>
