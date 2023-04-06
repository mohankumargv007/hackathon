import Link from 'next/link';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Layout from '../../../components/layout';
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
  const fixture = _get(props, "data.0.fixture_library", {});
  return (
    <Layout title="Review Fixture Details">
      <Box paddingX={"20px"}>
        <Stack spacing={2}>
          <h2>{fixture.name}</h2>
          <h3>{fixture.type}</h3>
          <img src={fixture.front_image} width="100%" style={{ "maxWidth": "400px" }} />
          <Link href={`/merchandise/barcode/scan/${barcode}`} passHref legacyBehavior><Button variant="contained">Confirm</Button></Link>
          <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained">Back</Button></Link>
        </Stack>
      </Box>
    </Layout>
  )
}