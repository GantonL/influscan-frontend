import { GOOGLE_CUSTOM_SEARCH_API_KEY, GOOGLE_CUSTOM_SEARCH_ENGINE } from "$env/static/private";
import { GoogleCustomSearchUrl } from "$lib/consts";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
  const data = await event.request.formData();
  const scanData = data.get('data');
  if (!scanData) {return error(500)};
  const scanCandidates: {Name: string, Email: string, Address: string}[] = JSON.parse(scanData.toString());
  const results: unknown[] = [];
  for await (const scanCandidate of scanCandidates) {
    const searchResults = await fetch(`${GoogleCustomSearchUrl}?q="${scanCandidate.Name}" AND ("${scanCandidate.Email}" OR "${scanCandidate.Address}")&cx=${GOOGLE_CUSTOM_SEARCH_ENGINE}&key=${GOOGLE_CUSTOM_SEARCH_API_KEY}&limit=5`)
    const fromSearch = await searchResults.json();
    if (Number(fromSearch?.searchInformation?.totalResults ?? 0) > 0) {
      results.push({
        name: scanCandidate.Name,
        results: (fromSearch.items as Record<string, string>[]).map(item => { 
          return {
            title: item.title,
            snippet: item.snippet,
            link: item.link,
          }}
        ) 
      });
    }
  }
  return json({results});
}