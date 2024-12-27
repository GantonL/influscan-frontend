import type { ScansSettings } from "$lib/models/settings";
import { db, Tables } from ".";

export const getScansSettings = async (user_id: string): Promise<Omit<ScansSettings, 'user_id'> | undefined> => {
  const {data, error} = await db.from(Tables.ScansSettings)
    .select('start_scans_immediately, parse_csv_with_ai')
    .eq('user_id', user_id);
  if (error) {
    console.error('[getScans]', error)
  }
  return data?.pop() ?? undefined;
};