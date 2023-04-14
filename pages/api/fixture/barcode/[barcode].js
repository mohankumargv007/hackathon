// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _get from 'lodash/get';
import { supabaseConnection } from '../../../../utils/supabase';

// Save barcode
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const supabase = supabaseConnection();
    const barcode = req.query.barcode;
    const body = JSON.parse(req.body);
    try {
      const { data, error } = await supabase
      .from('fixture_barcode')
      .insert([{
        store_id: _get(body, 'storeId'),
        fixture_key: _get(body, "fixtureKey"),
        counter : _get(body, 'counter'),
        fixture_barcode: barcode,
      }])
      .select()

      res.status(200).json({data, error});
    } catch(error) {
      res.status(500).send();
    }
  } else if (req.method == 'GET'){
    const supabase = supabaseConnection();
    const barcode = req.query.barcode;
    try {
      const { data, error } = await supabase
      .from('fixture_barcode')
      .select('*')
      .eq('fixture_barcode',barcode)
      res.status(200).json({data, error});
      
    } catch (error) {
      res.status(500).send();
    }
  }else {
     // Handle any other HTTP method
     res.status(405).send({ message: 'Only PUT requests allowed' })
  }
}