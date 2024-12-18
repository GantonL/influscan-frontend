import type { User } from "$lib/models/user";
import { db, Tables } from ".";

export const getUser = async (id: User['id']): Promise<User | undefined> => {
  const {data, error} = await db.from(Tables.Users)
    .select('id, name')
    .eq('id', id)
  if (error) {
    console.error('[getUser]', error)
  }
  return data && data?.length > 0 ? data.pop() : undefined;
};

export const createUser = async (user: User): Promise<boolean> => {
  const { error } = await db.from(Tables.Users)
    .insert(user);
  if (error) {
    console.error('[createUser]', error);
    return false;
  }
  return true;
};
