import type { Plan } from "$lib/enums/plan";

export interface User {
  id: string;
  name?: string;
  plan?: Plan;
}

export interface UserStats {
  total_monthly_scans?: number;
}
