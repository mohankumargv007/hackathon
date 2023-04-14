import { useState } from "react";
import Link from 'next/link';
import _get from 'lodash/get';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Layout from '../../../components/layout';
import { supabaseConnection } from '../../../utils/supabase';

export async function getServerSideProps(context) {
  const { barcode } = context.query;
  const farr = barcode.split('&');

  // Fetch data from external API
  const supabase = supabaseConnection();

  const { data, error } = await supabase
    .from('fixture_barcode')
    .select(`
    *,
    fixture_library:fixture_key ( * )
  `)
    .eq('fixture_barcode', barcode);

  const fixture_barcode = _get(data, '0', {});

  // Pass data to the page via props
  return {
    props: {
      fbdata: fixture_barcode,
      fberror: error
    }
  };
}

export default function Fixture(props) {
  const [fixtureBarcode, setFixtureBarcode] = useState(_get(props, "fbdata", {}));
  const [fixture, setFixture] = useState(_get(fixtureBarcode, "fixture_library", {}));
  const removeFixture = (fixture) => async () => {
    const url = `/api/fixture/remove/${fixtureBarcode.fixture_barcode}`;
    const options = {
      method: "put"
    };
    const response = await fetch(url, options);
    const data = await response.json();
    setFixtureBarcode(_get(data, "data.0", {}));
  }
  return (
    <Layout title="Remove Fixture" footer={{title:"Go to Remove Fixture", link:"/fixture/remove"}}>
      {!fixtureBarcode.status &&
        <Alert severity="info">Fixture removed successfully!</Alert>
      }
      <Stack spacing={2}>
        <Stack spacing={1}>
          <h2>{fixture.name}</h2>
          {fixture.type && <p><b>Type: </b>{fixture.type}</p>}
          {fixture.component_length && <p><b>Length: </b>{fixture.component_length}</p>}
          {fixture.component_width && <p><b>Width: </b>{fixture.component_width}</p>}
          {fixture.component_height && <p><b>Height: </b>{fixture.component_height}</p>}
          {fixture.front_image && <>
            <label><b>Front Image</b></label>
            <img src={fixture.front_image} width="100%" style={{ "maxWidth": "400px" }} />
          </>}
          {fixture.cad_image && <>
            <label><b>CAD Image</b></label>
            <img src={fixture.cad_image} width="100%" style={{ "maxWidth": "400px" }} />
          </>}
          {fixture.lateral_image && <>
            <label><b>Lateral Image</b></label>
            <img src={fixture.lateral_image} width="100%" style={{ "maxWidth": "400px" }} />
          </>}
        </Stack>
        {fixtureBarcode.status ?
          <>
            <Alert severity="error">This will remove fixture mapping. Are you sure?</Alert>
            <Button variant="contained" onClick={removeFixture(fixture)} size="large">Yes</Button>
            <Link href={`/fixture/remove`} passHref legacyBehavior><Button variant="contained" size="large">No</Button></Link>
          </>
          :
          <>
            <Alert severity="success">Fixture removed successfully!</Alert>
          </>
        }
      </Stack>
    </Layout>
  )
}