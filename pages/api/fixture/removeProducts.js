// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _get from 'lodash/get';
import { supabaseConnection } from '../../../utils/supabase';

// Save barcode
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const supabase = supabaseConnection();
    const body = JSON.parse(req.body);
    const fixtureCount = body.count ?? 1;
    const perProductSpace = (body.fixture.linear_meter * fixtureCount) / body.products.length;
    try {
      await body.products.map(async (product, i, arr) => {
        let { data: getSum, error: sumError } = await supabase
          .rpc("get_sum_lm", { fbarcode: body.barcode, gname: product.group })
        if (getSum && getSum > 0) {
          const linearMeter = (getSum < perProductSpace) ? getSum : perProductSpace;
          const fixtureProduct = {
            fixture_barcode: body.barcode,
            store_id: body.barcode.slice(0, 5),
            item: product.item,
            group: product.group,
            department: product.department,
            class: product.class,
            sub_class: product.sub_class,
            fixture_key: body.fixture.key,
            linear_meter: -linearMeter
          }
          await supabase
            .from('fixture_product_list')
            .insert(fixtureProduct)
        }
      })
      res.status(200).json({ removeSuccess: true });
    } catch (error) {
      res.status(500).send();
    }
  } else {
    res.status(405).send({ message: 'Only POST requests allowed' })

  }
}