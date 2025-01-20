import type { ScansSettings } from "$lib/models/settings";
import { db, Tables } from ".";

export const getScansSettings = async (user_id: string): Promise<Omit<ScansSettings, 'user_id'> | undefined> => {
  const {data, error} = await db.from(Tables.ScansSettings)
    .select('start_scans_immediately, csv_parser, narrowed_analysis, prioritized_platform, prioritized_domain, prioritized_niche')
    .eq('user_id', user_id)
    .maybeSingle();
  if (error) {
    console.error('[getScans]', error)
  }
  return data ?? undefined;
};

export const updateScansSettings = async (user_id: string, updateObject: Partial<Omit<ScansSettings, 'user_id'>>): Promise<boolean> => {
  const { error } = await db.from(Tables.ScansSettings)
    .update(updateObject)
    .eq('user_id', user_id)
  if (error) {
    console.error('[updateScanSettings]', error);
    return false;
  }
  return true
};
