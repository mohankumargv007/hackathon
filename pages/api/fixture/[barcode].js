// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _get from 'lodash/get';
import { supabaseConnection } from '../../../utils/supabase';

// Save barcode
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const supabase = supabaseConnection();
    const barcode = req.query.barcode;
    try {
      const { data, error } = await supabase
      .from('fixture_barcode')
      .select(`
        *,
        fixture_library:fixture_key ( * )
      `)
      .eq('fixture_barcode', barcode)

      res.status(200).json({data, error});
    } catch(error) {
      res.status(500).send();
    }
  } else {
    res.status(405).send({ message: 'Only GET requests allowed' })

  }
}