import type { ScanResult } from "$lib/models/scan";
import { db, Tables } from ".";

export type CastScanResult = Pick<ScanResult, 'id' | 'created_at' | 'details' | 'estimation' | 'explanation' | 'status'>;

export const getScans = async (user_id: string): Promise<CastScanResult[]> => {
  const {data, error} = await db.from(Tables.Scans)
    .select('id, created_at, status, details, estimation, explanation, rankings')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[getScans]', error)
  }
  return data ?? [];
};

export const getScan = async (user_id: string, id: ScanResult['id']): Promise<CastScanResult | undefined> => {
  const {data, error} = await db.from(Tables.Scans)
    .select('id, created_at, status, details, estimation, explanation, domain, niche, rankings')
    .eq('user_id', user_id)
    .eq('id', id)
  if (error) {
    console.error('[getScan]', error)
  }
  return data?.pop() ?? undefined;
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

export const updateScan = async (user_id: string, id: ScanResult['id'], updateObject: Partial<Pick<ScanResult, 'details' | 'estimation' | 'explanation' | 'status' | 'domain' | 'niche' | 'rankings'>>): Promise<boolean> => {
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
