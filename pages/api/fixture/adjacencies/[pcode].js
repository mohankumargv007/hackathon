// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _get from 'lodash/get';
import { supabaseConnection } from '../../../../utils/supabase';
import Cookies from 'cookies'

// Save barcode
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const supabase = supabaseConnection();
    const pcode = req.query.pcode;
    try {
      const { data, error } = await supabase
        .from('product_list')
        .select('*')
        .eq('item', pcode)
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).send();
    }
  } else if (req.method === 'POST') {

    const cookies = new Cookies(req, res);
    const storeId = cookies.get('userStoreId') ?? null
    const supabase = supabaseConnection();
    const body = JSON.parse(req.body);
    const { parentProd } = body
    const dataFeed = await Promise.all(body.products.map(async (product) => {
      const { data: parentProductGroupDepartment, error: parentProductGroupDepartmentError } = await supabase
        .from("group_department")
        .upsert({ group_name: parentProd.group, department: parentProd.department }, { onConflict: 'group_name,department' })
        .select()
        .single()
      const { data: groupDepartment, error: groupDepartmentError } = await supabase
        .from("group_department")
        .upsert({ group_name: product.group, department: product.department }, { onConflict: 'group_name,department' })
        .select()
        .single()
      return {
        store_id: storeId,
        parent_id: parentProductGroupDepartment.id,
        adjacent_id: groupDepartment.id
      }
    }));
    try {
      if (dataFeed.length) {
        const { error: updateError } = await supabase
          .from('adjacencies_mapping')
          .delete()
          .eq('parent_id', dataFeed[0].parent_id)
        const { data, error } = await supabase
          .from('adjacencies_mapping')
          //  store_id parent_id adjacent_id
          .insert([...dataFeed])
          .select()
        res.status(200).json({ mappedSuccess: true });
      } else {
        res.status(200).json({ mappedSuccess: false });
      }
    } catch (error) {
      res.status(500).send();
    }
  } else {
    res.status(405).send({ message: 'Only PUT requests allowed' })

  }
}