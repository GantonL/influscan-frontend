import { GOOGLE_CUSTOM_SEARCH_API_KEY, GOOGLE_CUSTOM_SEARCH_ENGINE } from "$env/static/private";
import { GoogleCustomSearchUrl } from "$lib/consts";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
  const data = await event.request.formData();
  const scanData = data.get('data');
  if (!scanData) {return error(500)};
  const scanCandidates: {Name: string, Email: string, Address: string}[] = JSON.parse(scanData.toString());
  const results: unknown[] = [];
  for await (const scanCandidate of scanCandidates.slice(0, 2)) {
    const searchResults = await fetch(`${GoogleCustomSearchUrl}?q="${scanCandidate.Name}" AND "${scanCandidate.Email}" AND "${scanCandidate.Address}"&cx=${GOOGLE_CUSTOM_SEARCH_ENGINE}&key=${GOOGLE_CUSTOM_SEARCH_API_KEY}&limit=3`)
    const fromSearch = await searchResults.json();
    console.log(fromSearch?.searchInformation)
    if (Number(fromSearch?.searchInformation?.totalResults ?? 0) > 0) {
      results.push(...(fromSearch.items as Record<string, string>[]).map(item => { 
        return {
          title: item.title,
          snippet: item.snippet,
          link: item.link,
        }}
      ));
    }
  }
  return json({results});
}