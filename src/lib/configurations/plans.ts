import { Plan } from "$lib/enums/plan";
import type { PlanConfiguration } from "$lib/models/plan";

export const PlansConfiguration = new Map<Plan, PlanConfiguration>([
  [Plan.None, { monthly_limit: 0 }],
  [Plan.Lite, { monthly_limit: 250 }],
  [Plan.Plus, { monthly_limit: 1000 }],
  [Plan.Pro,  { monthly_limit: 10000 }],
]);
