import type { PageServerLoad } from './$types';
import { getScan, type CastScanResult } from '$lib/server/database/scans';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals?.session?.id) {
    return;
  }
  const userId = locals.session.id;
  const scanResult: CastScanResult | undefined = await getScan(userId, params.scan_id);
  if (!scanResult) {
    error(404);
  } 
  return {
    scanResult,
  }
}
