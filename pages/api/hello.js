// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabaseConnection } from '../../utils/supabase';

export default async function handler(req, res) {
  const supabase = supabaseConnection();

  try {
    let { data, error } = await supabase
    .from('fixture_library')
    .select('*')

    console.log(error);
    res.status(200).json({data: data});
  } catch(error) {
    res.status(500).send();
  }
}
