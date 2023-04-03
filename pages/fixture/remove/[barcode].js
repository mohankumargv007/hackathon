import { useState, useEffect } from "react";
import Link from 'next/link';
import _get from 'lodash/get';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { supabaseConnection } from '../../../utils/supabase';
import { useAppContext } from '../../../contexts/appContext';

export async function getServerSideProps(context) {
  const { barcode } = context.query;
  const farr = barcode.split('&');

  // Fetch data from external API
  const supabase = supabaseConnection();

  // let { data: fbdata, error: fberror } = await supabase
  // .from('fixture_barcode')
  // .select('*')
  // .eq("fixture_barcode", barcode)

  // const fixture_barcode = _get(fbdata, '0', {});

  // let { data: fldata, error: flerror } = await supabase
  // .from('fixture_library')
  // .select('*')
  // .eq("key", fixture_barcode.fixture_key)

  // const fixture_library = _get(fldata, "0", {});

  const { data, error } = await supabase
  .from('fixture_barcode')
  .select(`
    *,
    fixture_library:fixture_key ( * )
  `)
  .eq('fixture_barcode', barcode);

  const fixture_barcode = _get(data, '0', {});

  // Pass data to the page via props
  return { props: {
    fbdata: fixture_barcode,
    fberror: error
  } };
}

export default function Fixture(props) {
  const { setTitle } = useAppContext();
  useEffect(() => {
    setTitle("Remove Fixture");
  }, []);
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
    <>
    {!fixtureBarcode.status &&
      <Alert severity="info">Fixture removed successfully!</Alert>
    }
    <Box paddingX={"20px"}>
      <Stack spacing={2}>
        <h2>{fixture.name}</h2>
        <h3>{fixture.type}</h3>
        <img src={fixture.front_image} width="400" length="400" />
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
    </>
  )
}