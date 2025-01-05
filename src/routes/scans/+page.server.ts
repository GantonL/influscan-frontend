import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { singleScanformSchema } from './configurations';
import { zod } from 'sveltekit-superforms/adapters';
import { getScans, totalMonthlyScansCount, type CastScanResult } from '$lib/server/database/scans';
import { getScansSettings } from '$lib/server/database/scans-settings';
import type { ScansSettings } from '$lib/models/settings';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals?.session?.id) {
    return;
  }
  const user = locals.session;
  const scansResults: CastScanResult[] = await getScans(user.id);
  const scansSettings: Omit<ScansSettings, 'user_id'> | undefined = await getScansSettings(user.id);
  const totalMonthlyScans = await totalMonthlyScansCount(user.id);
  return {
    scansResults,
    scansSettings,
    user,
    totalMonthlyScans,
  }
}

export const actions = {
  dataFromInput: async (event) => {
    const form = await superValidate(event, zod(singleScanformSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    return {
      form,
    };
  }
} satisfies Actions;
