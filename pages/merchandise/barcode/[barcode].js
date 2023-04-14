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
      <Stack spacing={2}>
        <Stack spacing={1}>
          <h2 className="no-margig">{fixture.name}</h2>
          {fixture.type &&<p><b>Type: </b>{fixture.type}</p>}
          {fixture.component_length && <p><b>Length: </b>{fixture.component_length}</p>}
          {fixture.component_width && <p><b>Width: </b>{fixture.component_width}</p>}
          {fixture.component_height && <p><b>Height: </b>{fixture.component_height}</p>}
          {fixture.front_image && <>
            <label><b>Front Image</b></label>
            <img src={fixture.front_image} width="100%" style={{"maxWidth":"400px"}} />
          </>}
          {fixture.cad_image && <>
            <label><b>CAD Image</b></label>
            <img src={fixture.cad_image} width="100%" style={{"maxWidth":"400px"}} />
          </>}
          {fixture.lateral_image && <>
            <label><b>Lateral Image</b></label>
            <img src={fixture.lateral_image} width="100%" style={{"maxWidth":"400px"}} />
          </>}
        </Stack>
        <Link href={`/merchandise/barcode/scan/${barcode}`} passHref legacyBehavior><Button variant="contained" size="large">Confirm</Button></Link>
      </Stack>
    </Layout>
  )
}