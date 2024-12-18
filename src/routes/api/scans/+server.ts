import { error, json, type RequestHandler } from "@sveltejs/kit";
import { createScans } from "$lib/server/database/scans";

export const POST: RequestHandler = async ({request, locals}) => {
  const data = await request.formData();
  const userId = locals.session?.id;
  const scanData = data.get('data')?.toString();
  const response = {success: false};
  if (!userId || !scanData) { error(400); }
  const createScanRes = await createScans(userId, [JSON.parse(scanData)]);
  response.success = !!createScanRes;
  return json(response);
}
