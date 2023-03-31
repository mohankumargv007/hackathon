// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _get from 'lodash/get';
import { supabaseConnection } from '../../../../utils/supabase';

// Save barcode
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const supabase = supabaseConnection();
    const pid = req.query.pid;
    try {
      const { data, error } = await supabase
      .from('product_list')
      .select('*')
      .eq('item',pid)
      res.status(200).json({data, error});
    } catch(error) {
      res.status(500).send();
    }
  } else if (req.method === 'POST') {

    const supabase = supabaseConnection();
    const body = JSON.parse(req.body);
    const dataFeed = await body.products.map((product,i,a)=>{
      return  {
        fixture_barcode: body.barcode,
        store_id : body.barcode.slice(0,5),
        item : product.item,
        group : product.group,
        department : product.department,
        class : product.class,
        sub_class : product.sub_class,
        fixture_key : body.fixture.key,
        linear_meter : body.fixture.linear_meter
      }
    })
    try {
        const {data,error} = await supabase
        .from('fixture_product_list')
        //fixture_barcode  store_id  item  group  department  class  sub_class  fixture_type  linear_meter
        .insert([...dataFeed])
        .select()
        res.status(200).json({data, error});
    } catch (error) {
      res.status(500).send();
    }
  } else {
    res.status(405).send({ message: 'Only PUT requests allowed' })

  }
}