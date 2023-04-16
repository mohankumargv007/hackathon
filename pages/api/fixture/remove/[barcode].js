// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabaseConnection } from '../../../../utils/supabase';

// Disable barcode
export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const supabase = supabaseConnection();
    const barcode = req.query.barcode;
    try {
      const { data, error } = await supabase
      .from('fixture_barcode')
      .update({ status: false })
      .eq('fixture_barcode', barcode)
      .select()

    const { data: fProducts, error: ferror} = await supabase
      .from('fixture_product_list')
      .update({ status : false})
      .eq('fixture_barcode', barcode)
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