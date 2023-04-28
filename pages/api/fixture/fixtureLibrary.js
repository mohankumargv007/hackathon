// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabaseConnection } from '../../../utils/supabase';
import _get from 'lodash/get';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig()
const fixturesInPage = publicRuntimeConfig.fixturesInPage;

export default async function handler(req, res) {
  const supabase = supabaseConnection();
  const page = _get(req, "query.page", 1);
  const type = _get(req, "query.type", "");
  const name = _get(req, "query.name", "");
  const startRange = (page - 1) * fixturesInPage;
  const endRange = (page * fixturesInPage) - 1;

  try {
    let query = supabase
    .from('fixture_library')
    .select('*', { count: 'exact' });

    if(type === 'armsprongsshelves') {
      query.or('type.ilike.%arm%,type.ilike.%prong%,type.ilike.%shelves%');
    } else if(type.length > 1) {
      // query.textSearch('type', `'${type}'`);
      query.eq('type', type)
    }
    query.eq('status', true);
    if(name.length > 1) query.textSearch('name', `'${name}'`);
    query.range(startRange, endRange);

    const { data: fixtureLibrary, count: fixtureCount, error } = await query;
    res.status(200).json({fixtureLibrary: fixtureLibrary, count: fixtureCount});
  } catch(error) {
    res.status(500).send();
  }
}