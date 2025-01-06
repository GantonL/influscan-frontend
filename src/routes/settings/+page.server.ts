import type { ScansSettings } from '$lib/models/settings';
import { getScansSettings } from '$lib/server/database/scans-settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.session;
  if (!user?.id) {return;}
  const scansSettings: Omit<ScansSettings, 'user_id'> | undefined = await getScansSettings(user.id); 
  return {
    scansSettings,
    user,
  }
}
