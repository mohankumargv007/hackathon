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
  const { loginDetails } = props;
  const router = useRouter();
  const barcode = _get(router, "query.barcode", "");
  const fixture = _get(props, "data.0.fixture_library", {});
  return (
    <Layout title="Review Fixture Details" loginDetails={loginDetails}>
      <Stack spacing={2}>
        <FixtureDetails fixture={fixture} />
        <Link href={`/merchandise/barcode/scan/${barcode}`} passHref legacyBehavior><Button variant="contained" size="large">Confirm</Button></Link>
      </Stack>
    </Layout>
  )
}