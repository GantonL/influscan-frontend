import { DB_API_KEY, DB_URL } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';

export const db = createClient(DB_URL, DB_API_KEY);

export enum Tables {
  Scans = 'scans',
  Users = 'users',
  ScansSettings = 'scans_settings'
}
