import type { Actions, PageServerLoad } from './$types';
import type { ScanResult } from '$lib/models/scan';

export const load: PageServerLoad = async () => {
  const scansResults: ScanResult[] = mockData(); 
  return {
    scansResults,
  }
}

export const actions = {
  dataFromInput: async ({request}) => {
    const form = await request.formData();
    const results = [];
    return { results };
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