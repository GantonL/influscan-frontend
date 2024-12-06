import { error, json, type RequestHandler } from "@sveltejs/kit";
import parse from "csv-simple-parser";

export const POST: RequestHandler = async ({request}) => {
  const form = await request.formData();
  const file = form.get('file') as File | null;
  
  if (!file) {
    error(400, 'No file provided');
  }

  const text = await file.text();
  const results = parse(text, {header: true});
  
  return json(results);
}