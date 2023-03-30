import Link from 'next/link';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
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
  const router = useRouter();
  const fid = _get(router, "query.fid", "");
  const fixture = _get(props, "data.0", {});
  return (
    <Box paddingX={"20px"}>
      <Stack spacing={2}>
        <h2>{fixture.name}</h2>
        <h3>{fixture.type}</h3>
        <img src={fixture.front_image} width="100%" />
        <Link href={`/merchandise/fid/scan/${fid}`} passHref legacyBehavior><Button variant="contained">Confirm</Button></Link>
        <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained">Back</Button></Link>
      </Stack>
    </Box>
  )
}