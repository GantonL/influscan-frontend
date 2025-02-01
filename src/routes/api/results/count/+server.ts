import { countScans } from "$lib/server/database/scans";
import { getDatabaseFiltersFromClientFilters } from "$lib/server/database/utils";
import { parseUrlFilters } from "$lib/utils";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({locals, url}) => {
  const userId = locals.session?.id;
  const filtersInSearchParams = url.searchParams.get('filters');
  if (!userId) { error(400); }
  const scanResults = await countScans(userId, {
    filters: getDatabaseFiltersFromClientFilters(parseUrlFilters(filtersInSearchParams ?? []) ?? []),
  });
  return json(scanResults);
}