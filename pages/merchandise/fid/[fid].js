import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import FixtureDetails from './../../../components/fixture-desc';
import Layout from '../../../components/layout';
import Cookies from 'cookies'

import { supabaseConnection } from '../../../utils/supabase';

export async function getServerSideProps({ req, res, query }) {
  const { fid } = query;
  const cookies = new Cookies(req, res);
  const storeId = cookies.get('userStoreId') ?? null


  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
    .from('fixture_library')
    .select('*')
    .eq("id", fid)
    .single()
  
  
 const {data:fixturecode,error:fixturecodeError} = await supabase
    .from('fixture_barcode')
    .upsert({ store_id: storeId, fixture_key : data.key, counter: 1, fixture_barcode : storeId + data.key + '0001'},{ onConflict: 'fixture_barcode' })
    .select()

  // Pass data to the page via props
  return { props: { data: data ,fixturecode : fixturecode} };
}

export default function Fixture(props) {
  const router = useRouter();
  const zone = _get(router,'query.zone','')
  const [fcount, setFcount] = useState(1);
  const fid = _get(router, "query.fid", "");
  const fixture = _get(props, "data", {});
  const fixturecode = _get(props, "fixturecode.0", false);
  const fixtureBarcode = fixturecode.fixture_barcode
  const handleChange = (event) => {
    setFcount(event.target.value);
  }
  return (
    <Layout title="Review Fixture Details" {...props} footer={{title:"Map Merchandise", link:"/merchandise/barcode/zone"}}>
      <Stack spacing={2}>
        <FixtureDetails fixture={fixture} fixtureBarcode={fixturecode} />
        <b>Enter count of Fixtures:</b>
        <OutlinedInput placeholder="Please enter fixtures count" type="number" value={fcount} onChange={handleChange} />
        <Link href={`/merchandise/barcode/scan/${fixtureBarcode}?count=${fcount}&zone=${zone}`} passHref legacyBehavior><Button variant="contained" size="large">Confirm</Button></Link>
      </Stack>
    </Layout>
  )
}