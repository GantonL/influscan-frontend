import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
  const data = await event.request.formData();
  const scanData = data.get('data');
  const response = {success: false};
  // create new scans objects
  return json(response);
}
