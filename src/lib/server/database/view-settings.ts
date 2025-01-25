import type { ScansViewSettings } from "$lib/models/view-settings";
import { db, Tables } from ".";

export const getScansViewSettings = async (user_id: string): Promise<Omit<ScansViewSettings, 'user_id'>> => {
  const {data, error} = await db.from(Tables.ScansViewSettings)
    .select('page_size')
    .eq('user_id', user_id)
    .maybeSingle();
  if (error) {
    console.error('[getScansViewSettings]', error)
  }
  return data ?? {};
};

export const updateScansViewSettings = async (user_id: string, updateObject: Partial<Omit<ScansViewSettings, 'user_id'>>): Promise<boolean> => {
  const { error } = await db.from(Tables.ScansViewSettings)
    .update(updateObject)
    .eq('user_id', user_id)
  if (error) {
    console.error('[updateScanViewSettings]', error);
    return false;
  }
  return true
};
