<script>
	import *  as Card from "$lib/components/ui/card";
	import { PlansDisplayConfiguartion } from "$lib/configurations/plans";
	import { Plan } from "$lib/enums/plan";
	import { Code, Radar, Workflow } from "lucide-svelte";

  const features = [
    {
      icon: Radar,
      title: 'Discover Influencers',
      description: 'Scan your customers pool to indentify potential influencers to colaborate with.' ,
    },
    {
      icon: Workflow,
      title: 'Integrations',
      description: 'Automate the discovery process with any of the supported CRMs.' ,
    },
    {
      icon: Code,
      title: 'API',
      description: 'Integrate & automate the discovery process with a simple API into your own backend.' ,
    },
    {
      icon: PlansDisplayConfiguartion[Plan.Pro].icon,
      title: 'Plan Based Usage',
      description: 'Choose the plan that meets your needs.' ,
    },
  ];

</script>
<div class="flex flex-col gap-4 items-center ">
  <h2 class="text-2xl">Features</h2>
  <div class="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr));]">
    {#each features as feature}
      <Card.Root>
        <Card.Header>
          <div class="flex flex-row items-center gap-2">
            <div class="p-2 border rounded-full bg-secondary shadow-md">
              <feature.icon size=20/>
            </div>
            <h3 class="font-semibold text-lg">{feature.title}</h3>
          </div>
        </Card.Header>
        <Card.Content>{feature.description}</Card.Content>
      </Card.Root>
    {/each}
  </div>
</div>