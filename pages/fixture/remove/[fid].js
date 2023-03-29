import { useState } from "react";
import Link from 'next/link';
import _get from 'lodash/get';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { supabaseConnection } from '../../../utils/supabase';

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
  const [fixture, setFixture] = useState(_get(props, "data.0", {}));
  const removeFixture = (fixture) => async () => {
    const url = `/api/fixture/remove/${fixture.id}`;
    const options = {
      method: "put"
    };
    const response = await fetch(url, options);
    const data = await response.json();
    setFixture(_get(data, "data.0", {}));
  }
  return (
    <>
    {!fixture.status &&
      <Alert severity="info">Fixture removed successfully!</Alert>
    }
    <Box paddingX={"20px"}>
      <Stack spacing={2}>
        <h2>{fixture.name}</h2>
        <h3>{fixture.type}</h3>
        <img src={fixture.front_image} width="100%" />
        {fixture.status ?
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