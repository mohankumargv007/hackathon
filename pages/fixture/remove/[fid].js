import Link from 'next/link';
import _get from 'lodash/get';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { supabaseConnection } from '../../../utils/supabase';

export async function getServerSideProps(context) {
  const { fid } = context.query;
  console.log(fid);
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
  console.log(props);
  const fixture = _get(props, "data.0", {});
  return (
    <Box paddingX={"20px"}>
      <Stack spacing={2}>
        <h2>{fixture.name}</h2>
        <h3>{fixture.type}</h3>
        <img src={fixture.front_image} width="100%" />
        <Alert severity="error">This will remove fixture mapping. Are you sure?</Alert>

        <Link href={`/fixture/remove/success/${fixture.id}`} passHref legacyBehavior><Button variant="contained">Yes</Button></Link>
        <Link href={`/fixture/remove`} passHref legacyBehavior><Button variant="contained">No</Button></Link>
      </Stack>
    </Box>
  )
}