// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabaseConnection } from '../../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const supabase = supabaseConnection();
    const fid = req.query.fid;
    try {
      const { data, error } = await supabase
      .from('fixture_library')
      .update({ status: false })
      .eq('id', fid)
      .select()

      res.status(200).json({data: data, error: error});
    } catch(error) {
      res.status(500).send();
    }
  } else {
    // Handle any other HTTP method
    res.status(405).send({ message: 'Only PUT requests allowed' })
  }
}