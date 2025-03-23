
import { PlansDisplayConfiguartion } from "$lib/configurations/plans";
import { Plan } from "$lib/enums/plan";
import { Code, Radar, Workflow } from "@lucide/svelte";

export const AppFeatures = [
  {
    icon: Radar,
    title: 'Discover Influencers',
    description: 'Scan your customers pool to indentify potential influencers to colaborate with.' ,
    link: '/scans',
  },
  {
    icon: Workflow,
    title: 'Integrations',
    description: 'Automate the discovery process with any of the supported platforms.' ,
    link: '/integrations',
  },
  {
    icon: Code,
    title: 'API',
    description: 'Integrate & automate the discovery process with a simple API into your own backend.' ,
    link: '/api/rest',
  },
  {
    icon: PlansDisplayConfiguartion[Plan.Pro].icon,
    title: 'Plan Based Usage',
    description: 'Choose the plan that meets your needs.' ,
    link: '/plan',
  },
];