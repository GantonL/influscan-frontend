import { PlansConfiguration } from "$lib/configurations/plans";
import type { Plan } from "$lib/enums/plan";
import type { User } from "$lib/models/user";
import { db, Tables } from ".";

export const getUser = async (id: User['id']): Promise<User | undefined> => {
  const {data, error} = await db.from(Tables.Users)
    .select('id, name, plan')
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
  const { error: userStatsError } = await db.from(Tables.UsersStats)
    .insert({user_id: user.id});
  if (userStatsError) {
    console.error('[createUser | default user stats]', userStatsError);
  }
  const { error: userScansViewSettingsError } = await db.from(Tables.ScansViewSettings)
    .insert({user_id: user.id});
  if (userScansViewSettingsError) {
    console.error('[createUser | default user scans view settings]', userScansViewSettingsError);
  }
  return true;
};

export const planMonthlyLimit = async (user_id: string): Promise<number> => {
  const {data, error} = await db.from(Tables.Users)
    .select('plan')
    .eq('id', user_id)
    .maybeSingle();
  if (error) {
    console.error('[getPlanMonthlyLimit]', error);
    return 0;
  }
  if (!data || !data.plan) {
    return 0;
  }
  return PlansConfiguration.get(data.plan)?.monthly_limit ?? 0;
}

export const updatePlan = async (user_id: string, plan: Plan): Promise<boolean> => {
  const { error } = await db.from(Tables.Users)
    .update({plan})
    .eq('id', user_id);
  if (error) {
    console.error('[updatePlan]', error);
    return false;
  }
  return true;
} 