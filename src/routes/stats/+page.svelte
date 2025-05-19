<script lang="ts">
	import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
	import { PlansConfiguration } from "$lib/configurations/plans";
	import { title } from "$lib/stores";
	import { Radar } from "@lucide/svelte";

  title.set('Stats');
  const user = $state($page.data.user);
  const totalMonthlyScans = $state($page.data.totalMonthlyScans);
</script>
<div class="flex flex-col gap-4">
  <Card.Root>
    <Card.Header class="flex flex-row items-center justify-between gap-8">
      <Card.Title class="text-sm font-medium">Total Monthly Scans</Card.Title>
      <Radar class="text-muted-foreground h-4 w-4"/>
    </Card.Header>
    <Card.Content>
      <div class="text-2xl font-bold">{totalMonthlyScans}<span class="text-muted-foreground text-lg">/{PlansConfiguration.get(user.plan)!.monthly_limit}</span></div>
      <a href="/plan" class="text-muted-foreground text-sm">Change plan</a>
    </Card.Content>
  </Card.Root>
</div>