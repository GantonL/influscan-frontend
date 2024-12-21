import { GOOGLE_CUSTOM_SEARCH_API_KEY, GOOGLE_CUSTOM_SEARCH_ENGINE } from "$env/static/private";
import { GoogleCustomSearchUrl } from "$lib/consts";
import type { GoogleCustomSearchEngineResult } from "$lib/models/search";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
  const data = await event.request.formData();
  const scanData = data.get('data');
  if (!scanData) {return error(500)};
  const scanCandidate: {name: string, email: string, address: string} = JSON.parse(scanData.toString());
  const results: unknown[] = [];
  const searchResults = await fetch(`${GoogleCustomSearchUrl}?q="${scanCandidate.name}"&cx=${GOOGLE_CUSTOM_SEARCH_ENGINE}&key=${GOOGLE_CUSTOM_SEARCH_API_KEY}&limit=5`)
  const fromSearch = await searchResults.json();
  if (fromSearch.error) {
    console.error('[Search failed]', fromSearch.error.message);
    return json(fromSearch);
  }
  const totalResults = Number(fromSearch?.searchInformation?.totalResults ?? 0);
  if (totalResults > 0) {
    results.push({
      name: scanCandidate.name,
      results: (fromSearch.items).map((item: GoogleCustomSearchEngineResult) => { 
        return {
          title: item.title,
          snippet: item.snippet,
          link: item.link,
          image: item.pagemap?.cse_thumbnail && item.pagemap?.cse_thumbnail[0]?.src,
        }}
      ),
      totalResults,
    });
  }
  return json(results);
}