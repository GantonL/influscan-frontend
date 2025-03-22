<script lang="ts">
	import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
	import type { User } from "$lib/models/user";
	import { title } from "$lib/stores";
	import Shopify from "$lib/components/icons/shopify.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { PlansDisplayConfiguartion } from "$lib/configurations/plans";
	import type { PlanDisplayConfigration } from "$lib/models/plan";
	import { Plan, PlanFeatures } from "$lib/enums/plan";
  title.set('Integrations');
  const user: User = $state($page.data.user);
	const plan: PlanDisplayConfigration = PlansDisplayConfiguartion[user?.plan ?? Plan.None];
	const integrations = {
		'shopify': {
			active: false,
		}
	}
	const options = [
		{
			icon: Shopify,
			title: 'Shopify',
			description: 'Integrate Influsacn as a Shopify App, to automatically scan customers as they purchase, comming soon...',
			active: integrations.shopify.active,
		}
	]
</script>

<div class="flex flex-col gap-4 items-center ">
  <h2 class="text-2xl">Integrations</h2>
  <div class="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr));]">
    {#each options as integration}
    <Card.Root>
			<Card.Header>
				<div class="flex flex-row items-center gap-2">
					<div class="p-2 border rounded-full bg-secondary shadow-md">
						<integration.icon size=24/>
					</div>
					<h3 class="font-semibold text-lg">{integration.title}</h3>
				</div>
			</Card.Header>
			<Card.Content>{integration.description}</Card.Content>
			{#if user}
				{@const notInPlan = !plan.features.includes(PlanFeatures.Integrations)}
				<Card.Footer>
					<div class="flex flex-row gap-4 align-items">
						<Button 
						disabled={notInPlan || true}
						variant={integration.active ? "secondary": "default"}>{integration.active ? 'Deactivate' : 'Activate'}</Button>
						{#if notInPlan}
							<span class="font-light italic">*Upgrade plan to enable integrations</span>
						{/if}
					</div>
				</Card.Footer>
			{/if}
    </Card.Root>
    {/each}
  </div>
</div>