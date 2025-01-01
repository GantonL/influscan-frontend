import type { User } from "$lib/models/user";
import { db, Tables } from ".";

export const getUser = async (id: User['id']): Promise<User | undefined> => {
  const {data, error} = await db.from(Tables.Users)
    .select('id, name')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('[getUser]', error)
  }
  return data ?? undefined;
};

export const createUser = async (user: User): Promise<boolean> => {
  const { error } = await db.from(Tables.Users)
    .insert(user);
  if (error) {
    console.error('[createUser]', error);
    return false;
  }
  const { error: scanSettingsError } = await db.from(Tables.ScansSettings)
    .insert({user_id: user.id});
  if (scanSettingsError) {
    console.error('[createUser | default scan settings]', scanSettingsError);
  }
  return true;
};
