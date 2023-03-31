// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _get from 'lodash/get';
import { supabaseConnection } from '../../../../utils/supabase';

// Save barcode
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const supabase = supabaseConnection();
    const pcode = req.query.pcode;
    try {
      const { data, error } = await supabase
      .from('product_list')
      .select('*')
      .eq('item',pcode)
      res.status(200).json({data, error});
    } catch(error) {
      res.status(500).send();
    }
  } else if (req.method === 'POST') {

    const supabase = supabaseConnection();
    const body = JSON.parse(req.body);
    const {parentProd} = body
    const dataFeed = await body.products.map((product,i,a)=>{
      return  {
        store_id : 60318,
        username : 'userName',
        parent_item : parentProd.item,
        parent_group : parentProd.group,
        parent_department : parentProd.department,
        adjacent_item : product.item,
        adjacent_group : product.group,
        adjacent_department : product.department
      }
    })
    try {
        const {data,error} = await supabase
        .from('adjacencies_list')
        //  store_id  username  parent_item  parent_group  parent_department  adjacent_item  adjacent_group  adjacent_department 
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