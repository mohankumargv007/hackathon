import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import FixtureDetails from './../../../components/fixture-desc';
import Layout from '../../../components/layout';

import { supabaseConnection } from '../../../utils/supabase';

export async function getServerSideProps(context) {
  const { fid } = context.query;

  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
    .from('fixture_library')
    .select('*')
    .eq("id", fid)
    .single()
  
  
  await supabase
    .from('fixture_barcode')
    .upsert({ store_id: 60318, fixture_key : data.key, counter: 1, fixture_barcode : "60318" + data.key + '001'},{ onConflict: 'fixture_barcode' })
  let {data: fixtureBarcode, error: fixtureBarcodeError} = await supabase
    .from('fixture_barcode')
    .select("*")
    .eq('fixture_barcode', `60318${data.key}001`)
    .single()
  
  // Pass data to the page via props
  return { props: { data: data, fixtureBarcode : fixtureBarcode } };
}

export default function Fixture(props) {
  const { loginDetails } = props;
  const router = useRouter();
  const [fcount, setFcount] = useState(1);
  const fid = _get(router, "query.fid", "");
  const fixture = _get(props, "data", {});
  const fixtureBarcode = _get(props, "fixtureBarcode", {});
  const handleChange = (event) => {
    setFcount(event.target.value);
  }
  return (
    <Layout title="Review Fixture Details" loginDetails={loginDetails}>
      <Stack spacing={2}>
        <FixtureDetails fixture={fixture} fixtureBarcode={fixtureBarcode} />
        <b>Enter count of Fixtures:</b>
        <OutlinedInput placeholder="Please enter fixtures count" type="number" value={fcount} onChange={handleChange} />
        <Link href={`/merchandise/barcode/scan/${fixtureBarcode.fixture_barcode}?count=${fcount}`} passHref legacyBehavior><Button variant="contained" size="large">Confirm</Button></Link>
      </Stack>
    </Layout>
  )
}