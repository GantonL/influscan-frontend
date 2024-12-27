import type { ScansSettings } from '$lib/models/settings';
import { getScansSettings } from '$lib/server/database/scans-settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals?.session?.id) {
    return;
  }
  const userId = locals.session.id;
  const scansSettings: Omit<ScansSettings, 'user_id'> | undefined = await getScansSettings(userId); 
  return {
    scansSettings,
  }
}
