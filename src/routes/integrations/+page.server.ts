import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.session;
  if (!user?.id) {return;}
  return {
    user,
  }
}
