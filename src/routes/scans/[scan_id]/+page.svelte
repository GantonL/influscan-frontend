<script>
	import { page } from "$app/stores";
	import { title } from "$lib/stores";
  title.set(`${$page.data.scanResult.details.name} | Scan Result`);
</script>
