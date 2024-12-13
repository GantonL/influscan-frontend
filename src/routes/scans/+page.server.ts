import type { Actions, PageServerLoad } from './$types';
import type { ScanResult } from '$lib/models/scan';
import { fail, superValidate } from 'sveltekit-superforms';
import { singleScanformSchema } from './configurations';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals }) => {
  // locals.session.userId = to fetch data.
  const scansResults: ScanResult[] = mockData(); 
  return {
    scansResults,
  }
}

export const actions = {
  dataFromInput: async (event) => {
    const form = await superValidate(event, zod(singleScanformSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    // Insert to db
    return {
      form,
    };
  }
} satisfies Actions;

const mockData = (): ScanResult[] => {
  return [
    {
      id: '9',
      date: Date.now(),
      status: 'completed',
      details: {
        first_name: 'Customer',
        last_name: '9',
      },
      estimation: 95,
      explanation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia sapiente maiores vitae? Harum consequatur doloribus dicta nulla, repellat labore aut, sequi assumenda quas a ullam voluptatum rerum provident! Tempore, quasi!',
    },
    {
      id: '10',
      date: Date.now(),
      status: 'completed',
      details: {
        first_name: 'Customer',
        last_name: '10',
      },
      estimation: 34,
      explanation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia sapiente maiores vitae? Harum consequatur doloribus dicta nulla, repellat labore aut, sequi assumenda quas a ullam voluptatum rerum provident! Tempore, quasi!',
    },
    {
      id: '11',
      date: Date.now(),
      status: 'completed',
      details: {
        first_name: 'Customer',
        last_name: '11',
      },
      estimation: 12,
      explanation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia sapiente maiores vitae? Harum consequatur doloribus dicta nulla, repellat labore aut, sequi assumenda quas a ullam voluptatum rerum provident! Tempore, quasi!',
    },
    
  ]; 
}