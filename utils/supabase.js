import getConfig from 'next/config';
import { createClient } from '@supabase/supabase-js';

const { serverRuntimeConfig } = getConfig();

const supabaseUrl = serverRuntimeConfig.supabaseUrl;
const supabaseKey = serverRuntimeConfig.supabaseKey;

const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseConnection = () => {
  return supabase;
}