import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import parse from "csv-simple-parser";
import type { ScanResult } from '$lib/models/scan';

export const load: PageServerLoad = async () => {
  const scansResults: ScanResult[] = [
    {
      id: '9',
      date: Date.now(),
      status: 'completed',
      details: {
        first_name: 'Customer',
        last_name: '9',
      },
      estimation: 95,
      explanation: 'Because',
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
      explanation: 'Because',
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
      explanation: 'Because',
    },
    {
      id: '2',
      date: Date.now(),
      status: 'failed',
      details: {
        first_name: 'Customer',
        last_name: '2',
      },
    },
    {
      id: '3',
      date: Date.now(),
      status: 'in_progress',
      details: {
        first_name: 'Customer',
        last_name: '3',
      },
    },
    {
      id: '4',
      date: Date.now(),
      status: 'not_started',
      details: {
        first_name: 'Customer',
        last_name: '4',
      },
    },
    {
      id: '5',
      date: Date.now(),
      status: 'completed',
      details: {
        first_name: 'Customer',
        last_name: '5',
      },
      estimation: 20,
      explanation: 'Because',
    },
    {
      id: '6',
      date: Date.now(),
      status: 'completed',
      details: {
        first_name: 'Customer',
        last_name: '6',
      },
      estimation: 40,
      explanation: 'Because',
    },
    {
      id: '7',
      date: Date.now(),
      status: 'completed',
      details: {
        first_name: 'Customer',
        last_name: '7',
      },
      estimation: 60,
      explanation: 'Because',
    },
    {
      id: '8',
      date: Date.now(),
      status: 'completed',
      details: {
        first_name: 'Customer',
        last_name: '8',
      },
      estimation: 80,
      explanation: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut molestiae quia quis temporibus voluptas eaque libero obcaecati dolore debitis necessitatibus omnis delectus perspiciatis, minima optio voluptate, suscipit dolorum maiores. Ut.',
    },
    {
      id: '12',
      date: Date.now(),
      status: 'completed',
      details: {
        first_name: 'Customer',
        last_name: '12',
      },
      estimation: 1,
      explanation: 'Because',
    },
  ]; 
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