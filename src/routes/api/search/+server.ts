import { GOOGLE_CUSTOM_SEARCH_API_KEY, GOOGLE_CUSTOM_SEARCH_ENGINE } from "$env/static/private";
import { GoogleCustomSearchUrl } from "$lib/consts";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
  const data = await event.request.formData();
  const scanData = data.get('data');
  if (!scanData) {return error(500)};
  const scanCandidate: {name: string, email: string, address: string} = JSON.parse(scanData.toString());
  const results: unknown[] = [];
  const searchResults = await fetch(`${GoogleCustomSearchUrl}?q="${scanCandidate.name}" AND ("${scanCandidate.email}" OR "${scanCandidate.address}")&cx=${GOOGLE_CUSTOM_SEARCH_ENGINE}&key=${GOOGLE_CUSTOM_SEARCH_API_KEY}&limit=5`)
  const fromSearch = await searchResults.json();
  if (fromSearch.error) {
    console.error('[Search failed]', fromSearch.error.message);
    return json(fromSearch);
  }
  if (Number(fromSearch?.searchInformation?.totalResults ?? 0) > 0) {
    results.push({
      name: scanCandidate.name,
      results: (fromSearch.items as Record<string, string>[]).map(item => { 
        return {
          title: item.title,
          snippet: item.snippet,
          link: item.link,
        }}
      ) 
    });
  }
  return json(results);
}