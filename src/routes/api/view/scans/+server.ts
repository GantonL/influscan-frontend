import { error, json, type RequestHandler } from "@sveltejs/kit";
import { updateScansViewSettings } from '$lib/server/database/view-settings';

export const PUT: RequestHandler = async ({request, locals}) => {
  const data = await request.formData();
  const userId = locals.session?.id;
  const viewSettings = data.get('data')?.toString();
  const response: { success: boolean } = { success: false };
  if (!userId || !viewSettings) { error(400); }
  const parsedViewSettings = JSON.parse(viewSettings);
  response.success  = await updateScansViewSettings(userId, parsedViewSettings);
  return json(response);
}