import Link from 'next/link';
import { useState } from "react";
import _get from 'lodash/get';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Barcode from 'react-barcode';
import Layout from '../../../components/layout';
import { supabaseConnection } from '../../../utils/supabase';
import styles from '../../../styles/Layout.module.css';

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

const printPageArea = areaID => {
  let disp_setting="toolbar=yes,location=no,";
  disp_setting+="directories=yes,menubar=yes,";
  disp_setting+="width=650, height=600, left=100, top=25";
  const content_vlue = document.getElementById(areaID).innerHTML;
  const docprint=window.open("","",disp_setting);
  docprint.document.open();
  docprint.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"');
  docprint.document.write('"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
  docprint.document.write('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">');
  docprint.document.write('<head><title>&nbsp;</title>');
  docprint.document.write('<style type="text/css">body{ margin:0px;');
  docprint.document.write('font-family:verdana,Arial;color:#000;');
  docprint.document.write('font-family:Verdana, Geneva, sans-serif; font-size:12px;}');
  docprint.document.write('a{color:#000;text-decoration:none;} </style>');
  docprint.document.write('</head><body onLoad="self.print()"><center>');
  docprint.document.write(content_vlue);
  docprint.document.write('</center></body></html>');
  docprint.document.close();
  docprint.focus();
}

export default function Fixture(props) {
  const fixture = _get(props, "data", {});
  const fixture_barcode = _get(props, "fbdata", {});
  const store_code = 60318;
  let counter = ''
  if(fixture_barcode.counter) {
    if(fixture_barcode.counter < 10){
      counter = `00${fixture_barcode.counter + 1}`
    } else if (fixture_barcode.counter < 100){
      counter = `0${fixture_barcode.counter + 1}`
    } else if (fixture_barcode.counter < 1000){
      counter = `${fixture_barcode.counter + 1}`
    }
  } else {
    counter = `001`
  }

  //generating the barcode
  const barCode =  `${store_code}${fixture.key}${counter}`
  const [code, setCode] = useState(barCode);
  
  const [saved, setSaved] = useState(false);

  const saveBarcode = (code) => async () => {
    const url = `/api/fixture/barcode/${code}`;
    const options = {
      method: "POST",
      body: JSON.stringify(fixture)
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if(_get(data, "data.0.id")) {
      setSaved(true);
    }
  }

  const handlePrint = () => {
    !saved && saveBarcode(code)();
    // window.print();
    printPageArea("printableArea");
  }

  return (
    <Layout title="Barcode Fixture" footer={{title:"Go to Barcode a fixture", link:"/fixture/search"}}>
      <div className={styles.container}>
        <Stack spacing={2}>
          {saved &&
          <Alert severity="success">Barcode saved successfully!</Alert>
          }
          <div id="printableArea">
            <p>4 way new format stand 125CM</p>
            <Barcode value={code} />
          </div>
          <Button onClick={handlePrint} variant="contained" size="large">Print</Button>
        </Stack>
      </div>
    </Layout>
  )
}