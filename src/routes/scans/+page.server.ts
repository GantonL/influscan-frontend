import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { singleScanformSchema } from './configurations';
import { zod } from 'sveltekit-superforms/adapters';
import { getScans, totalMonthlyScansCount, type CastScanResult } from '$lib/server/database/scans';
import { getScansSettings } from '$lib/server/database/scans-settings';
import type { ScansSettings } from '$lib/models/settings';
import { getScansViewSettings } from '$lib/server/database/view-settings';
import type { ScansViewSettings } from '$lib/models/view-settings';
import { CalendarDate } from '@internationalized/date';
import { getDatabaseFiltersFromClientFilters } from '$lib/server/database/utils';
import { parseUrlFilters, parseUrlSort } from '$lib/utils';

const defaultPageFilter = () => {
  const now = new Date();
  const calendar7DaysAgo = new CalendarDate(now.getFullYear(), now.getMonth(), now.getDate()).subtract({days: 7});
  return {column: 'created_at', operator: 'gte', value: `${calendar7DaysAgo.year}-${calendar7DaysAgo.month}-${calendar7DaysAgo.day}`};
}

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals?.session?.id) {
    return;
  }
  const user = locals.session;
  const scansSettings: Omit<ScansSettings, 'user_id'> | undefined = await getScansSettings(user.id);
  const totalMonthlyScans = await totalMonthlyScansCount(user.id);
  const viewSettings: Omit<ScansViewSettings, 'user_id'> = {};
  const { page_size, sort_by, filters } = await getScansViewSettings(user.id);
  const pageSizeInSearchParams = url.searchParams.get('pageSize');
  const sortInSearchParams = url.searchParams.get('sortBy');
  const filtersInSearchParams = url.searchParams.get('filters');
  viewSettings.page_size = pageSizeInSearchParams ? Number(pageSizeInSearchParams) : page_size;
  viewSettings.sort_by = sortInSearchParams ? parseUrlSort(sortInSearchParams) : sort_by;
  viewSettings.filters = filtersInSearchParams ? parseUrlFilters(filtersInSearchParams) : filters;
  const scansResults: CastScanResult[] = await getScans(user.id, {
    sortBy: viewSettings.sort_by,
    filters: viewSettings.filters ? getDatabaseFiltersFromClientFilters(viewSettings.filters) : [defaultPageFilter()],
  });
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
