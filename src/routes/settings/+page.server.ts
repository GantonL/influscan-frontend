import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals?.session?.id) {
    return;
  }
  const userId = locals.session.id;
  // const settings: Settings = await getSettings(userId); 
  return {
    // settings,
  }
}
