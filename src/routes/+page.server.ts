import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import parse from "csv-simple-parser";

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const file = form.get('file') as File | null;

    if (!file) {
      return error(400, 'No file provided');
    }
    const text = await file.text();
    const results = parse(text, {header: true});
    return { results, done: true };
  }
} satisfies Actions;