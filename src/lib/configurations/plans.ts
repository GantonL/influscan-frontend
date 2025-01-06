import { Plan, PlanFeatures } from "$lib/enums/plan";
import type { PlanConfiguration, PlanDisplayConfigration } from "$lib/models/plan";
import { CircleOff, Heart, Spade, Sparkle } from "lucide-svelte";

export const PlansConfiguration = new Map<Plan, PlanConfiguration>([
  [Plan.None, { monthly_limit: 0, price: 0 }],
  [Plan.Lite, { monthly_limit: 250, price: 5 }],
  [Plan.Plus, { monthly_limit: 1000, price: 25 }],
  [Plan.Pro,  { monthly_limit: 10000, price: 250 }],
]);

export const PlansDisplayConfiguartion: Record<Plan, PlanDisplayConfigration> = {
  [Plan.None]: {
    name: 'None',
    icon: CircleOff,
    price: PlansConfiguration.get(Plan.Lite)!.price,
    features: [],
  },
  [Plan.Lite]: {
    name: 'Lite',
    icon: Heart,
    iconClass: 'group-hover:animate-ping',
    description: 'For individuals',
    price: PlansConfiguration.get(Plan.Lite)!.price,
    features: [
      PlanFeatures.LiteScans,
      PlanFeatures.CSVUpload,
      PlanFeatures.StrictCSVParser,
    ],
    excludedFeatures: [
      PlanFeatures.APIKey,
      PlanFeatures.Integrations,
    ]
  },
  [Plan.Plus]: {
    name: 'Plus',
    icon: Spade,
    iconClass: 'group-hover:animate-bounce',
    description: 'For small businesses',
    price: PlansConfiguration.get(Plan.Plus)!.price,
    features: [
      PlanFeatures.PlusScans,
      PlanFeatures.CSVUpload,
      PlanFeatures.DynamicCSVParser,
      PlanFeatures.APIKey,
      PlanFeatures.Integrations,
    ],
    class: 'border-2 border-primary',
  },
  [Plan.Pro]: {
    name: 'Pro',
    icon: Sparkle,
    iconClass: 'group-hover:animate-spin',
    description: 'For large companies',
    price: PlansConfiguration.get(Plan.Pro)!.price,
    features: [
      PlanFeatures.ProScans,
      PlanFeatures.CSVUpload,
      PlanFeatures.DynamicCSVParser,
      PlanFeatures.APIKey,
      PlanFeatures.Integrations,
    ],
  },
};
