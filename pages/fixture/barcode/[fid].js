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
  const [code, setCode] = useState(barCode);
  const [saved, setSaved] = useState(false);
  const fixture = _get(props, "data.0", {});

  const saveBarcode = (code) => async () => {
    console.log(code);
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