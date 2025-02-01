
import { OPENAI_API_KEY } from "$env/static/private";
import type { ScansSettings } from "$lib/models/settings";
import { json, type RequestHandler } from "@sveltejs/kit";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const POST: RequestHandler = async (event) => {
  const data = await event.request.formData();
  const customerDetails = data.get('details');
  const searchResults = data.get('results');
  const settings = data.get('settings');
  let prioritizedPlatform: string | undefined;
  let prioritizedDomain: string | undefined;
  let prioritizedNiche: string | undefined;

  if (settings) {
    const parsedSettings: ScansSettings = JSON.parse(settings.toString());
    if (parsedSettings.narrowed_analysis) {
      prioritizedPlatform = parsedSettings.prioritized_platform;
      prioritizedDomain = parsedSettings.prioritized_domain;
      prioritizedNiche = parsedSettings.prioritized_niche;
    }
  }

  const openai = new OpenAI({apiKey: OPENAI_API_KEY});

  const analysisResult = z.object({
    estimation: z.number(),
    explanation: z.string(),
    domain: z.string().optional(),
    niche: z.string().optional(),
    rankings: z.array(z.object({
      platform: z.string(),
      followers: z.number(),
      link: z.string(),
    })).optional(),
    images: z.array(z.string()).optional(),
    sources: z.array(z.string()).optional(),
  });

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      { role: "system", 
        content: `you are an influencers agent capable of determine the influencial footprint of an individual based on their name and a set of results from a custom web search engine.
        Your output is an estimated number on a scale of 0 to 100, where 0 is unlikely to have any infulacial footprint, and 100 is probably a high profile influencer with hundreds of thousands of followers, shares, likes, etc. And a short, single sentence reason explaining why you determined that estimated number.
        If possible include their influencial domain and niche.
        If possible, rankings object should include amount of followers per platform and the link to the influencer account on the platform.
        Images should include only relevant images that most likley to match this individual.
        Sources should include the relevant links to your determination.
        ${prioritizedPlatform || prioritizedDomain || prioritizedNiche ? `
          Fine-tune the estimation in favor of the following [${prioritizedPlatform ? 'platforms,' : ''}${prioritizedDomain ? 'domains,' : ''}${prioritizedNiche ? 'niches,' : ''}]:
          ${prioritizedPlatform ? `${prioritizedPlatform} and ignore other platforms,` : ''}
          ${prioritizedDomain ? `${prioritizedDomain} and ignore other domains,` : ''}
          ${prioritizedNiche ? `${prioritizedNiche} and ignore other niches` : ''}.` 
          : ''}`
      },
      { role: "user", content: `Determine the infuencial footprint of ${customerDetails}. Search results: ${searchResults}`},
    ],
    response_format: zodResponseFormat(analysisResult, "event"),
  });

  const result = completion.choices[0].message.parsed;
  return json(result);
}