
import { OPENAI_API_KEY } from "$env/static/private";
import { json, type RequestHandler } from "@sveltejs/kit";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const POST: RequestHandler = async (event) => {
  const data = await event.request.formData();
  const customerDetails = data.get('details');
  const searchResults = data.get('results');

  const openai = new OpenAI({apiKey: OPENAI_API_KEY});

  const analysisResult = z.object({
    estimation: z.number(),
    explanation: z.string(),
  });

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "you are an influencers agent capable of determine the influencial footprint of an individual based on their name and a set of results from a custom web engine search. Your output is an estimated number on a scale of 0 to 100, where 0 is unlikely to have any infulacial footprint, and 100 is probably a high profile influencer with thousands of followers, shares, likes, etc. And a short, single sentence reason explaining why you determined that estimated number" },
      { role: "user", content: `Determine the infuencial footprint of ${customerDetails} with the following search results ${searchResults}`},
    ],
    response_format: zodResponseFormat(analysisResult, "event"),
  });

  const result = completion.choices[0].message.parsed;
  return json(result);
}