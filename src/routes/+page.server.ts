import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import parse from "csv-simple-parser";
import { GoogleCustomSearchUrl } from '$lib/consts';
import { GOOGLE_CUSTOM_SEARCH_API_KEY, GOOGLE_CUSTOM_SEARCH_ENGINE } from '$env/static/private';

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const file = form.get('file') as File | null;

    if (!file) {
      return error(400, 'No file provided');
    }
    const text = await file.text();
    const results = parse(text, {header: true}) as {Name: string, Email: string, Address: string}[];
    const searchResults = await fetch(`${GoogleCustomSearchUrl}?q=${results[0].Name.replaceAll(' ', '+')}+${results[0].Email}+${results[0].Address}&cx=${GOOGLE_CUSTOM_SEARCH_ENGINE}&key=${GOOGLE_CUSTOM_SEARCH_API_KEY}`)
    const fromSearch = await searchResults.json();
    console.log(fromSearch)
    return { results, done: true };
  }
} satisfies Actions;