// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabaseConnection } from '../../utils/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const supabase = supabaseConnection();

    try {
      let { data: test, error } = await supabase
      .from('fixture_library')
      .select('*')

      res.status(200).json({data: test});
    } catch(error) {
      res.status(500).send();
    }
  } else {
    // Handle any other HTTP method
    res.status(405).send({ message: 'Only POST requests allowed' })
  }
}
