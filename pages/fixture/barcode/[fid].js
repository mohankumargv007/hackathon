import Link from 'next/link';
import _get from 'lodash/get';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { supabaseConnection } from '../../../utils/supabase';
import styles from '../../../styles/Layout.module.css';
import Barcode from 'react-barcode';
import { useEffect,useState } from 'react';

const handlePrint = () =>{
  window.print();
}

export async function getServerSideProps(context) {
  const { fid } = context.query;

  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data: fldata, error: flerror } = await supabase
  .from('fixture_library')
  .select('*')
  .eq("id", fid)

  const fixture_library = _get(fldata, "0", {});

  let { data: fbdata, error: fberror } = await supabase
  .from('fixture_barcode')
  .select('*')
  .eq("store_id", 60318)
  .eq("fixture_key", fixture_library.key)
  .order("counter", {ascending: false})
  .range(0,0)

  const fixture_barcode = _get(fbdata, '0', {});

  // Pass data to the page via props
  return { props: {
    data: fixture_library,
    error: flerror,
    fbdata: fixture_barcode,
    fberror: fberror
  } };
}

export default function Fixture(props) {
  const fixture = _get(props, "data", {});
  const fixture_barcode = _get(props, "fbdata", {});

  const barCode =  `${fixture.key}&${fixture.concept_code}&${fixture.id}`
  const [code, setCode] = useState(barCode);
  const [saved, setSaved] = useState(false);

  const saveBarcode = (code) => async () => {
    const url = `/api/fixture/barcode/${code}`;
    const options = {
      method: "post",
      body: JSON.stringify(fixture)
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if(_get(data, "data.0.id")) {
      setSaved(true);
    }
  }
  return (
    <div className={styles.container}>
      <Stack spacing={2}>
        {saved &&
        <Alert severity="success">Barcode saved successfully!</Alert>
        }
        <p>4 way new format stand 125CM</p>
        <Barcode value={code} />;
        <Button onClick={handlePrint} variant="contained">Print</Button>
        <Button onClick={saveBarcode(code)} variant="contained">Save Barcode</Button>
        <Link href={`/fixture/${fixture.id}`} passHref legacyBehavior><Button variant="contained">Back</Button></Link>
      </Stack>
    </div>
  )
}