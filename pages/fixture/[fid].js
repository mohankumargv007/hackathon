import Link from 'next/link';
import _get from 'lodash/get';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FixtureDetails from './../../components/fixture-desc';
import Layout from '../../components/layout';
import { supabaseConnection } from '../../utils/supabase';

export async function getServerSideProps(context) {
  const { fid } = context.query;

  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
  .from('fixture_library')
  .select('*')
  .eq("id", fid)

  // Pass data to the page via props
  return { props: { data: data } };
}

export default function Fixture(props) {
  const fixture = _get(props, "data.0", {});
  return (
    <Layout title="Review Fixture Details">
      <Stack spacing={2}>
        <FixtureDetails fixture={fixture} />
        <Link href={`/fixture/barcode/${fixture.id}?key=${fixture.key}`} passHref legacyBehavior><Button variant="contained" size="large">Generate Bar Code</Button></Link>
      </Stack>
    </Layout>
  )
}