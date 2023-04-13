import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField } from '@mui/material'
import Layout from '../../../../components/layout';
import Notification from "../../../../components/reusable-components/alert"
// import Scanner from '../../../../utils/scanner';
import { supabaseConnection } from '../../../../utils/supabase';
const Scandit = dynamic(() => import('../../../../components/scandit'), {
  ssr: false,
})
// const response = await fetch(url);

export async function getServerSideProps(context) {
  const { fid } = context.query;

  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
    .from('fixture_library')
    .select('*')
    .eq("id", fid)

  const fixture = _get(data, "0", {});

  const { data: fbdata, error: fberror } = await supabase
    .from('fixture_barcode')
    .select('*')
    .eq('fixture_key', fixture.key)
    .order("id", { ascending: false })
    .range(0, 0)

  if (fbdata.length === 0) {
    const { data: fbndata, fbnerror } = await supabase
      .from('fixture_barcode')
      .insert([{
        store_id: 60318,
        fixture_key: fixture.key,
        counter: "001",
        fixture_barcode: `60318${fixture.key}001`,
      }])
      .select()

    // Pass data to the page via props
    return {
      props: {
        data: data,
        fbdata: fbndata
      }
    };
  } else {
    // Pass data to the page via props
    return {
      props: {
        data: data,
        fbdata: fbdata
      }
    };
  }
}

export default function Fixture(props) {
  const router = useRouter();
  const fid = _get(router, "query.fid", "");
  const count = _get(router, "query.count", "");
  const fbdata = _get(props, "fbdata.0", {});
  const fixture = _get(props, "data.0", {});
  const barcode = fbdata.fixture_barcode;

  const [results, setResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const [manual, setManual] = useState(false);

  const manualEntry = () => {
    setManual(!manual);
  }

  const _onDetected = useCallback((result) => {
    setResults([]);
    setResults([result]);
    setError(false);
  }, []);

  const handleProduct = async (productCode) => {
    try {
      const url = `/api/fixture/merchandise/${productCode}`;
      const response = await fetch(url);
      const { data, error } = await response.json();
      const group = _get(data, "data.0.group", '');
      const department = _get(data, "data.0.department", '');
      data.length ? setProducts([{ code: productCode, group, department, ...data[0] }, ...products]) : setError(true);
      setResults([]);
    } catch (error) {
      console.log("handle Product get api fail:", error);
    }
  }

  const handleSubmit = async () => {
    const url = `/api/fixture/merchandise/${barcode}`;
    const options = {
      method: "POST",
      body: JSON.stringify({
        barcode,
        fixture,
        products,
        count
      })
    }
    const response = await fetch(url, options);
    const { data, error } = await response.json();
    data.length && setSaved(true);
    setResults([])
  }

  const notification = (type, msg) => {
    return (
      <Notification
        state={{
          vertical: 'top',
          horizontal: 'center'
        }}
        toastType={type}
        toastMessage={msg}
        onClose={() => error && setError(false)}
      ></Notification>
    )
  }

  return (
    <Layout title="Scan Products" footer={{title:"Go to Map Merchandise", link:"/merchandise/scan-fixture"}}>
      <Box paddingX={"20px"}>
        <Stack spacing={2}>
          <h3>{fixture.name}</h3>
          Type: {fixture.type}
          <h4>Add products</h4>
          <Scandit btnText="Scan Product" onDetected={_onDetected} scandit_licence_key={_get(props, "scandit_licence_key")} />
          <Box paddingTop="10px">
            <Box display="flex">
              <TextField
                label="Scanned product code"
                style={{ maxWidth: 300 }}
                fullWidth
                type='text'
                value={_get(results, "0", "")}
                onChange={event => {
                  setResults([event.target.value]);
                  error && setError(false);
                }}
                InputProps={{
                  readOnly: !manual
                }}
                InputLabelProps={{
                  shrink: true
                }}
                color="secondary"
              />
              &nbsp;&nbsp;
              <Button variant="contained" className="to-lowercase manual-btn" onClick={manualEntry} size="small">
                {manual ? "Disable Manual Entry" : "Add Product manually"}
              </Button>
            </Box>
            {error && notification("error", "Product not found !")}
            {results[0] ?
              <Box paddingTop="16px">
                <Button onClick={() => handleProduct(results[0])} variant="contained" size="large">Add Scanned Product</Button>
              </Box>
              : null
            }
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="caption table">
              <caption>Added {products.length}/5 products</caption>
              <TableHead>
                <TableRow>
                  <TableCell>Item Code</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Department</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((row, index) => (
                  <TableRow key={`${row.code}-${index}`}>
                    <TableCell component="th" scope="row">
                      {row.code}
                    </TableCell>
                    <TableCell>{row.group}</TableCell>
                    <TableCell>{row.department}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {saved &&
            <Alert severity="success">Product merchandised successfully!</Alert>
          }
          {saved ? <Link href={`/`} passHref legacyBehavior><Button variant="contained">back to home</Button></Link> : (products.length ? <Button onClick={handleSubmit} variant="contained">Submit</Button> : null)}
        </Stack>
      </Box>
    </Layout>
  )
}