<script lang="ts">
	import { page } from "$app/stores";
	import type { User } from "$lib/models/user";
	import { title } from "$lib/stores";

  title.set('Integrations');
  const user: User = $state($page.data.user);
</script>