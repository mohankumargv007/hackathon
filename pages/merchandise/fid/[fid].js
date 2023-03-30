import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
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
  const router = useRouter();
  const [fcount, setFcount] = useState(1);
  const fid = _get(router, "query.fid", "");
  const fixture = _get(props, "data.0", {});
  const handleChange = (event) => {
    setFcount(event.target.value);
  }
  return (
    <Box paddingX={"20px"}>
      <Stack spacing={2}>
        <h2>{fixture.name}</h2>
        <h3>{fixture.type}</h3>
        <img src={fixture.front_image} width="100%" />
        <p>Enter count of Fixtures</p>
        <OutlinedInput placeholder="Please enter fixtures count" type="number" value={fcount} onChange={handleChange} />
        <Link href={`/merchandise/fid/scan/${fid}?count=${fcount}`} passHref legacyBehavior><Button variant="contained">Confirm</Button></Link>
        <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained">Back</Button></Link>
      </Stack>
    </Box>
  )
}