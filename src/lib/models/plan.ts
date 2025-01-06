import type { PlanFeatures } from "$lib/enums/plan";

export interface PlanConfiguration {
  monthly_limit?: number;
  price: number;
};

export interface PlanDisplayConfigration {
  name: string;
  icon: ConstructorOfATypedSvelteComponent;
  iconClass?: string;
  description?: string;
  price: number;
  features: PlanFeatures[];
  excludedFeatures?: PlanFeatures[];
  class?: string;
};
