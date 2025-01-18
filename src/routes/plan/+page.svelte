<script lang="ts">
	import { page } from "$app/stores";
	import { title } from "$lib/stores";
  import { type PlanDisplayConfigration } from "$lib/models/plan";
	import * as Card from "$lib/components/ui/card";
	import type { User } from "$lib/models/user";
	import { Plan } from "$lib/enums/plan";
	import { Check, X } from "lucide-svelte";
	import { PlansDisplayConfiguartion } from "$lib/configurations/plans";
	import Button from "$lib/components/ui/button/button.svelte";
  title.set('Plan');

  const user: User | undefined = $state<User | undefined>($page.data.user);
  const plan: PlanDisplayConfigration = PlansDisplayConfiguartion[user?.plan ?? Plan.None];
</script>
<Card.Root class="{plan.class} w-full">
  <Card.Header class="flex flex-col">
    <Card.Title class="flex flex-row gap-2 items-center">You are on the <span class="group bg-primary text-primary-foreground rounded-md p-2 flex flex-row gap-2"><plan.icon size=24 class={plan.iconClass}/> <span>{plan.name}</span></span> plan</Card.Title>
    <Card.Description>{plan.description}</Card.Description>
  </Card.Header>
  <Card.Content class="flex flex-col gap-4">
    <div class="flex flex-col">
      <h3 class="text-xl text-bold">You are paying </h3><p class="text-3xl text-bold">&dollar;{plan.price}<span class="text-muted-foreground text-sm">/month</span></p>
    </div>
    <div class="flex flex-col">
      <h3 class="text-xl text-bold">Your features:</h3>
      <ul class="flex flex-col gap-4 items-start p-2 w-full">
        {#each plan.features as feature}
        <li class="flex flex-row gap-2 items-center"><Check size=12/>{feature}</li>
        {/each}
        {#each (plan.excludedFeatures ?? []) as exfeature}
        <li class="flex flex-row gap-2 items-center text-muted-foreground"><X size=12/>{exfeature}</li>
        {/each}
      </ul>
    </div>
  </Card.Content>
  <Card.Footer class="flex flex-row flex-wrap gap-2 items-center">
    {#each plan.actions ?? [] as action}
    <Button class="flex flex-row gap-2 items-center" variant={action.variant}>
      <action.icon size=12/>
      <span>{action.title}</span>
    </Button>
    {/each}
  </Card.Footer>
</Card.Root>
