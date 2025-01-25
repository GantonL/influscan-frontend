import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { singleScanformSchema } from './configurations';
import { zod } from 'sveltekit-superforms/adapters';
import { getScans, totalMonthlyScansCount, type CastScanResult } from '$lib/server/database/scans';
import { getScansSettings } from '$lib/server/database/scans-settings';
import type { ScansSettings } from '$lib/models/settings';
import { getScansViewSettings } from '$lib/server/database/view-settings';
import type { ScansViewSettings } from '$lib/models/view-settings';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals?.session?.id) {
    return;
  }
  const user = locals.session;
  const scansSettings: Omit<ScansSettings, 'user_id'> | undefined = await getScansSettings(user.id);
  const totalMonthlyScans = await totalMonthlyScansCount(user.id);
  const viewSettings: Omit<ScansViewSettings, 'user_id'> = {};
  const { page_size, sort_by } = await getScansViewSettings(user.id);
  const pageSizeInSearchParams = url.searchParams.get('pageSize');
  const sortInSearchParams = url.searchParams.get('sortBy');
  viewSettings.page_size = pageSizeInSearchParams ? Number(pageSizeInSearchParams) : page_size;
  viewSettings.sort_by = sortInSearchParams ? JSON.parse(sortInSearchParams) : sort_by;
  const scansResults: CastScanResult[] = await getScans(user.id, {sortBy: viewSettings.sort_by});
  return {
    scansResults,
    scansSettings,
    user,
    totalMonthlyScans,
    viewSettings,
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
