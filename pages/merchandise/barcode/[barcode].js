import Link from 'next/link';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Layout from '../../../components/layout';
import FixtureDetails from './../../../components/fixture-desc';
import { supabaseConnection } from '../../../utils/supabase';

export async function getServerSideProps(context) {
  const { barcode } = context.query;
  // Fetch data from external API
  const supabase = supabaseConnection();

  const { data, error } = await supabase
    .from('fixture_barcode')
    .select(`
    *,
    fixture_library:fixture_key ( * )
  `)
    .eq('fixture_barcode', barcode)

    // Pass data to the page via props
  return { props: { data: data } };
}

export default function Fixture(props) {
  const router = useRouter();
  const barcode = _get(router, "query.barcode", "");
  const zone = _get(router,'query.zone',"")
  const fixture = _get(props, "data.0.fixture_library", {});
  return (
    <Layout title="Review Fixture Details" {...props} footer={{title:"Map Merchandise", link:"/merchandise/barcode/zone"}}>
      <Stack spacing={2}>
        <FixtureDetails fixture={fixture} fixtureBarcode={_get(props, "data.0")}/>
        <Link href={`/merchandise/barcode/scan/${barcode}?zone=${zone}`} passHref legacyBehavior><Button variant="contained" size="large">Confirm</Button></Link>
      </Stack>
    </Layout>
  )
}