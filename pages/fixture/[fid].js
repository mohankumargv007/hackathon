import _get from 'lodash/get';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { supabaseConnection } from '../../utils/supabase';
import styles from '../../styles/Layout.module.css';

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
  const fixture = _get(props, "data.0", {});
  console.log(fixture);
  return (
    <div className={styles.container}>
      <Stack spacing={2}>
        <h2>{fixture.name}</h2>
        <h3>{fixture.type}</h3>
        <img src={fixture.front_image} width="100%" />
        <Button variant="contained">Generate Bar Code</Button>
        <Button variant="contained">Back</Button>
      </Stack>
    </div>
  )
}