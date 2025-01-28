import type { ScanResult } from "$lib/models/scan";
import type { SortingState } from "@tanstack/table-core";
import { db, Tables } from ".";
import type { DatabaseFilter } from "$lib/models/filter";

export type CastScanResult = Pick<ScanResult, 'id' | 'created_at' | 'details' | 'estimation' | 'explanation' | 'status' | 'rankings' | 'images' | 'sources'>;

export const getScans = async (user_id: string, options?: {sortBy?: SortingState, filters?: DatabaseFilter[]}): Promise<CastScanResult[]> => {
  const query = db.from(Tables.Scans)
    .select('id, created_at, status, details, estimation, explanation, rankings')
    .eq('user_id', user_id)
  if (options?.filters) {
    options.filters.forEach((filter) => {
      query.filter(filter.column, filter.operator, filter.value);
    })
  }
  if (options?.sortBy) {
    options.sortBy.forEach((sortState) => {
      query.order(sortState.id, {ascending: !sortState.desc}); 
    });
  } else {
    query.order('created_at', { ascending: false });
  }
  const {data, error} = await query;
  if (error) {
    console.error('[getScans]', error)
  }
  return data ?? [];
};

export const getScan = async (user_id: string, id: ScanResult['id']): Promise<CastScanResult | undefined> => {
  const {data, error} = await db.from(Tables.Scans)
    .select('id, created_at, status, details, estimation, explanation, domain, niche, rankings, images, sources')
    .eq('user_id', user_id)
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('[getScan]', error)
  }
  return data ?? undefined;
};

export const createScans = async (user_id: string, scans: (ScanResult | Pick<ScanResult, 'status' | 'details' | 'id'>)[]): Promise<boolean> => {
  const { error } = await db.from(Tables.Scans)
    .insert(
      scans.map((scan) => {
        return {
          id: scan.id,
          user_id,
          status: scan.status,
          details: scan.details,
        }
      })
    );
  if (error) {
    console.error('[createScans]', error);
    return false;
  }
  return true;
};

export const updateScan = async (user_id: string, id: ScanResult['id'], updateObject: Partial<Pick<ScanResult, 'details' | 'estimation' | 'explanation' | 'status' | 'domain' | 'niche' | 'rankings' | 'images' | 'sources'>>): Promise<boolean> => {
  const { error } = await db.from(Tables.Scans)
    .update(updateObject)
    .eq('user_id', user_id)
    .eq('id', id);
  if (error) {
    console.error('[updateScan]', error);
    return false;
  }
  return true
};

export const deleteScans = async (user_id: string, ids: string[]): Promise<boolean> => {
  const { error } = await db.from(Tables.Scans)
    .delete()
    .eq('user_id', user_id)
    .in('id', ids);
  if (error) {
    console.error('[deleteScan]', error);
    return false;
  }
  return true;
};

export const totalMonthlyScansCount = async (user_id: string): Promise<number> => {
  const { data, error } = await db.from(Tables.UsersStats)
    .select('total_monthly_scans')
    .eq('user_id', user_id)
    .single()
  if (error) {
    console.error('[countScans]', error);
    return 0;
  }
  return data?.total_monthly_scans ?? 0;
}

export const updateTotalMonthlyScanCount = async (user_id: string): Promise<boolean> => {
  const { error: incrementError } = await db.rpc('increment_total_monthly_scans_count', {userid: user_id});
  if (incrementError) { return false; }
  return true;
}
