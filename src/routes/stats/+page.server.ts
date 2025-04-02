import type { PageServerLoad } from "./$types";
import { totalMonthlyScansCount } from "$lib/server/database/scans";

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.session;
  if (!user?.id) {return;}
  const totalMonthlyScans: number | undefined = await totalMonthlyScansCount(user.id); 
  return {
    user,
    totalMonthlyScans,
  }
}