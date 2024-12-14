import type { ScanResult } from "$lib/models/scan";
import { db, Tables } from ".";

export const getScans = async (): Promise<ScanResult[]> => {
  const {data, error} = await db.from(Tables.Scans).select();
  if (error) {
    console.error('[getScans]', error.details)
  }
  return data ?? [];
};
export const createScans = async (): Promise<boolean> => {
  return true;
};
export const updateScans = async (): Promise<boolean> => {
  return true;
};
export const deleteScans = async (): Promise<boolean> => {
  return true;
};
