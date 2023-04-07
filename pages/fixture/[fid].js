import Link from 'next/link';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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
      <Box paddingX={"20px"}>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <h2>{fixture.name}</h2>
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
          <Link href={`/fixture/barcode/${fixture.id}?key=${fixture.key}`} passHref legacyBehavior><Button variant="contained">Generate Bar Code</Button></Link>
          <Link href={`/fixture/search`} passHref legacyBehavior><Button variant="contained">Back</Button></Link>
        </Stack>
      </Box>
    </Layout>
  )
}