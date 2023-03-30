// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _get from 'lodash/get';
import { supabaseConnection } from '../../../../utils/supabase';

// Save barcode
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const supabase = supabaseConnection();
    const barcode = req.query.barcode;
    const body = JSON.parse(req.body);
    const barcodeArray = barcode.split("&")
    const counter = barcodeArray[[barcodeArray.length-1]]
    try {
      const { data, error } = await supabase
      .from('fixture_barcode')
      .insert([{
        store_id: 60318,
        fixture_key: _get(body, "key"),
        counter ,
        fixture_barcode: barcode,
        concept_code: _get(body, "concept_code")
      }])
      .select()

      res.status(200).json({data, error});
    } catch(error) {
      res.status(500).send();
    }
  } else {
    // Handle any other HTTP method
    res.status(405).send({ message: 'Only PUT requests allowed' })
  }
}