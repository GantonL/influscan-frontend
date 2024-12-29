import type { ScanResult } from "$lib/models/scan";
import type { ScansSettings } from "$lib/models/settings";
import { getScansSettings } from "$lib/server/database/scans-settings";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import parse from "csv-simple-parser";
import { OPENAI_API_KEY } from "$env/static/private";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

type ParserResult = unknown[][] | Record<string, unknown>[] | ScanResult['details'][];

export const POST: RequestHandler = async ({request, locals}) => {
  const form = await request.formData();
  const file = form.get('file') as File | null;
  
  if (!file) {
    error(400, 'No file provided');
  }

  const text = await file.text();
  let results: ParserResult = parse(text, {header: true});
  const userId = locals.session?.id;
  if (!userId) {
    return json(results);
  }
  const scansSettings: Omit<ScansSettings, 'user_id'> | undefined = await getScansSettings(userId);
  if (!scansSettings || !scansSettings.csv_parser || scansSettings.csv_parser === 'strict') {
    return json(results);
  }
  if (scansSettings.csv_parser === 'dynamic') {
    results = await handleDynamicCSV(results);
  }
  return json(results);
}

const handleDynamicCSV = async (parserResult: ParserResult): Promise<ScanResult['details'][]> => {
  const openai = new OpenAI({apiKey: OPENAI_API_KEY});

  const parsingResult = z.object({
    customers: z.array(z.object({
      name: z.string(),
    }))
  });

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      {
        role: 'system',
        content: 'You are an expert in converting customers object to new objects. You will figure out and extract the full name of the customer from each object, and convert it to a new object containing the name, DO NOT HALUCINAE AND DO NOT CREATE NAMES THAT DO NOT EXISTS IN THE GIVEN DATA'
      },
      { 
        role: "user", 
        content: `Convert the following ${parserResult}`
      },
    ],
    response_format: zodResponseFormat(parsingResult, "event"),
  });

  return completion.choices[0]?.message?.parsed?.customers ?? [];
}