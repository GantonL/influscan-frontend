import { CLERK_JWT, CLERK_SECRET_KEY } from "$env/static/private";
import type { Plan } from "$lib/enums/plan";
import { updatePlan } from "$lib/server/database/users";
import { createClerkClient } from "@clerk/backend";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({request, locals}) => {
  const data = await request.formData();
  const userId = locals.session?.id;
  const newPlan = data.get('plan')?.toString() as Plan;
  const response = {success: false};
  if (!userId || !newPlan) { error(400); }
  const updateScanRes = await updatePlan(userId, newPlan);
  const client = createClerkClient({
    secretKey: CLERK_SECRET_KEY,
    jwtKey: CLERK_JWT,
  });
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      plan: newPlan,
    }
  });
  const restSessions = await client.sessions.getSessionList({userId});
  if (restSessions?.totalCount > 0) {
    for await (const session of restSessions.data) {
      await client.sessions.revokeSession(session.id);
    }
  }
  response.success = !!updateScanRes;
  return json(response);
}
