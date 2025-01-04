import type { Plan } from "$lib/enums/plan";

export interface User {
  id: string;
  name?: string;
  plan?: Plan;
}