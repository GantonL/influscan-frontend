import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import parse from "csv-simple-parser";
import type { ScanResult } from '$lib/models/scan';

export const load: PageServerLoad = async () => {
  const scansResults: ScanResult[] = [
    {
      id: '1',
      date: Date.now(),
      status: 'completed',
      details: {
        first_name: 'Guy',
        last_name: 'Lahav',
      },
      estimation: 70,
      explanation: 'Because',
    },
    {
      id: '2',
      date: Date.now(),
      status: 'failed',
      details: {
        first_name: 'Guy',
        last_name: 'Lahav',
      },
    },
    {
      id: '3',
      date: Date.now(),
      status: 'in_progress',
      details: {
        first_name: 'Guy',
        last_name: 'Lahav',
      },
    },
    {
      id: '4',
      date: Date.now(),
      status: 'not_started',
      details: {
        first_name: 'Guy',
        last_name: 'Lahav',
      },
    }
  ]; 
  return {
    scansResults,
  }
}

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const file = form.get('file') as File | null;

    if (!file) {
      return error(400, 'No file provided');
    }
    const text = await file.text();
    const results = parse(text, {header: true});

    return { results };
  }
} satisfies Actions;