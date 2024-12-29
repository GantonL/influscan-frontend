import { updateScansSettings } from "$lib/server/database/scans-settings";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({request, locals}) => {
  const data = await request.formData();
  const userId = locals.session?.id;
  const updateObject = data.get('updateObject')?.toString();
  const response = {success: false};
  if (!userId || !updateObject) { error(400); }
  const updateScanRes = await updateScansSettings(userId, JSON.parse(updateObject));
  response.success = !!updateScanRes;
  return json(response);
}
