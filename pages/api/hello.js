// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabaseConnection } from '../../utils/supabase';

export default async function handler(req, res) {
  const supabase = supabaseConnection();

  try {
    let { data: test, error } = await supabase
    .from('test')
    .select('*')

    res.status(200).json({data: test});
  } catch(error) {
    res.status(500).send();
  }
}
