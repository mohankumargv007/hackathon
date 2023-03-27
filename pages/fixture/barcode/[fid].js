import Link from 'next/link';
import _get from 'lodash/get';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { supabaseConnection } from '../../../utils/supabase';
import styles from '../../../styles/Layout.module.css';
import Barcode from 'react-barcode';
import { useEffect,useState } from 'react';


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
  const data = props.data[0]
 const barCode =  `${data.key}&${data.concept_code}&${data.id}`
  const [Code, setCode] = useState(barCode);

    const fixture = _get(props, "data.0", {});
  return (
    <div className={styles.container}>
      <Stack spacing={2}>
        <p>4 way new format stand 125CM</p>
        
            <Barcode value={Code} />;
            
        <Button onClick={window.print} variant="contained">Print</Button>
        <Link href={`/fixture/${fixture.id}`} passHref legacyBehavior><Button variant="contained">Back</Button></Link>
      </Stack>
    </div>
  )
}