<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
	import { PlansDisplayConfiguartion } from "$lib/configurations/plans";
	import { Plan } from "$lib/enums/plan";
	import type { PlanDisplayConfigration } from "$lib/models/plan";
	import { Check, X } from "lucide-svelte";

  const plans: PlanDisplayConfigration[] = [
    PlansDisplayConfiguartion[Plan.Lite], 
    PlansDisplayConfiguartion[Plan.Plus], 
    PlansDisplayConfiguartion[Plan.Pro]
  ];

</script>
<div class="flex flex-row flex-wrap items-start justify-center gap-4">
  {#each plans as plan}
  <Card.Root class="group {plan.class}">
    <Card.Header class="flex flex-col items-center">
      <Card.Title class="flex flex-row gap-2 items-center"><plan.icon size=24 class={plan.iconClass}/> {plan.name}</Card.Title>
      <Card.Description>{plan.description}</Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col items-center">
      <h3 class="text-3xl text-bold">&dollar;{plan.price}<span class="text-muted-foreground text-sm">/month</span></h3>
      <ul class="flex flex-col gap-4 items-start p-2 w-full">
        {#each plan.features as feature}
        <li class="flex flex-row gap-2 items-center"><Check size=12/>{feature}</li>
        {/each}
        {#each (plan.excludedFeatures ?? []) as exfeature}
        <li class="flex flex-row gap-2 items-center text-muted-foreground"><X size=12/>{exfeature}</li>
        {/each}
      </ul>
    </Card.Content>
    <Card.Footer>
      <Button class="w-full">Let's go!</Button>
    </Card.Footer>
  </Card.Root>
  {/each}
</div>