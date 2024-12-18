import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { createUser, getUser } from "$lib/server/database/users";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals?.session?.id) {
    redirect(300, '/sign-in/unauthorized');
  }
  const maybeUser = locals.session; 
  getUser(maybeUser.id)
    .then((user) => {
      if (user) { return; }
      createUser(maybeUser);
    });
  redirect(300, '/');
}