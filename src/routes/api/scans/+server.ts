import { error, json, type RequestHandler } from "@sveltejs/kit";
import { createScans, deleteScans, updateScan } from "$lib/server/database/scans";

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

export const PUT: RequestHandler = async ({request, locals}) => {
  const data = await request.formData();
  const userId = locals.session?.id;
  const id = data.get('id')?.toString();
  const updateObject = data.get('updateObject')?.toString();
  const response = {success: false};
  if (!userId || !id || !updateObject) { error(400); }
  const updateScanRes = await updateScan(userId, id, JSON.parse(updateObject));
  response.success = !!updateScanRes;
  return json(response);
}

export const DELETE: RequestHandler = async ({request, locals}) => {
  const data = await request.formData();
  const userId = locals.session?.id;
  const ids = data.get('ids')?.toString();
  const response = {success: false};
  if (!userId || !ids) { error(400); }
  const updateScanRes = await deleteScans(userId, JSON.parse(ids));
  response.success = !!updateScanRes;
  return json(response);
}
