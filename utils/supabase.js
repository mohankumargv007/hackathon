import getConfig from 'next/config';
import { createClient } from '@supabase/supabase-js';

const { serverRuntimeConfig } = getConfig();

const supabaseUrl = serverRuntimeConfig.supabaseUrl;
const supabaseKey = serverRuntimeConfig.supabaseKey;
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabaseConnection = () => {
  return supabase;
}