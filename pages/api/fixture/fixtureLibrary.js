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
  const startRange = (page - 1) * fixturesInPage;
  const endRange = (page * fixturesInPage) - 1;

  try {
    if(type === 'armsprongsshelves') {
      let { data: fixtureLibrary, error } = await supabase
      .from('fixture_library')
      .select('*')
      .or('type.ilike.%arm%,type.ilike.%prong%,type.ilike.%shelves%')
      .eq('status', true)
      .range(startRange, endRange)

      res.status(200).json({fixtureLibrary: fixtureLibrary});
    } else {
      let { data: fixtureLibrary, error } = await supabase
      .from('fixture_library')
      .select('*')
      .eq('status', true)
      .range(startRange, endRange)

      res.status(200).json({fixtureLibrary: fixtureLibrary});
    }
  } catch(error) {
    res.status(500).send();
  }
}