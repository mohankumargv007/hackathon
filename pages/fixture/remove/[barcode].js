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
    <Layout title="Remove Fixture">
      {!fixtureBarcode.status &&
        <Alert severity="info">Fixture removed successfully!</Alert>
      }
      <Box paddingX={"20px"}>
        <Stack spacing={2}>
          <h2>{fixture.name}</h2>
          <h3>{fixture.type}</h3>
          <img src={fixture.front_image} width="100%" style={{ "maxWidth": "400px" }} />
          {fixtureBarcode.status ?
            <>
              <Alert severity="error">This will remove fixture mapping. Are you sure?</Alert>
              <Button variant="contained" onClick={removeFixture(fixture)}>Yes</Button>
              <Link href={`/fixture/remove`} passHref legacyBehavior><Button variant="contained">No</Button></Link>
            </>
            :
            <>
              <Alert severity="success">Fixture removed successfully!</Alert>
              <Link href={`/`} passHref legacyBehavior><Button variant="contained">Go to Home page</Button></Link>
              <Link href={`/fixture/remove`} passHref legacyBehavior><Button variant="contained">Go Back</Button></Link>
            </>
          }
        </Stack>
      </Box>
    </Layout>
  )
}