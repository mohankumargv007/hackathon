// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _get from 'lodash/get';
import { supabaseConnection } from '../../../utils/supabase';

// Save barcode
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const supabase = supabaseConnection();
    const body = JSON.parse(req.body);
    try {
        const dataFeed = await body.products.map(async (product,i,arr) => {
            let lm = body.count ? ((body.count*body.fixture.linear_meter)/arr.length) : (body.fixture.linear_meter/arr.length)
            let {data:getSum, error: sumError} = await supabase
                .rpc("get_sum_lm", {fbarcode : body.barcode, gname : product.group})
            if (getSum && getSum > 0) {
                lm  = (getSum < lm) ? getSum : lm; 
                let productList = {
                    fixture_barcode: body.barcode,
                    store_id : body.barcode.slice(0,5),
                    item : product.item,
                    group : product.group,
                    department : product.department,
                    class : product.class,
                    sub_class : product.sub_class,
                    fixture_key : body.fixture.key,
                    linear_meter : -lm
                }
                let {data : pdata, error : perror} = await supabase
                    .from('fixture_product_list')
                    //fixture_barcode  store_id  item  group  department  class  sub_class  fixture_type  linear_meter
                    .insert(productList)
                    .select()
                return productList;
            } else {
                return {
                    fixture_barcode: body.barcode,
                    store_id : body.barcode.slice(0,5),
                    item : product.item,
                    group : product.group,
                    department : product.department,
                    class : product.class,
                    sub_class : product.sub_class,
                    fixture_key : body.fixture.key,
                    linear_meter : 0.00
                }
            }
        })
        let error = null;
        let removeSuccess = true
        res.status(200).json({removeSuccess, error});
    } catch (error) {
      res.status(500).send();
    }
  } else {
    res.status(405).send({ message: 'Only POST requests allowed' })

  }
}