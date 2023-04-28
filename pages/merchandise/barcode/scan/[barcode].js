import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import _get from 'lodash/get';
import NoSsr from '@mui/base/NoSsr';
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
import { DateTime } from "luxon";
import { TextField } from '@mui/material';
import Layout from '../../../../components/layout';
import Notification from "../../../../components/reusable-components/alert";
import { supabaseConnection } from '../../../../utils/supabase';
const Scandit = dynamic(() => import('../../../../components/scandit'), {
  ssr: false,
})

export async function getServerSideProps(context) {
  const { barcode } = context.query;

  // Fetch data from external API
  const supabase = supabaseConnection();

  const { data, error } = await supabase
    .from('fixture_barcode')
    .select(`
    *,
    fixture_library:fixture_key ( * )
  `)
    .eq('fixture_barcode', barcode)

  // Pass data to the page via props
  return { props: { data: data } };
}

export default function Fixture(props) {
  const { loginDetails } = props;
  const {storeId} = loginDetails
  const router = useRouter();
  const zone = _get(router,'query.zone','')
  const barcode = _get(router, "query.barcode", "");
  const count = _get(router, "query.count", 1);

  const fixture = _get(props, "data.0.fixture_library", {});
  const [results, setResults] = useState([""]);
  const [products, setProducts] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [manual, setManual] = useState(false);

  const manualEntry = () => {
    setManual(!manual);
  }

  const _onDetected = useCallback((result) => {
    setResults([""]);
    setResults([result]);
    setError(false);
  }, []);

  const handleProduct = async (productCode) => {
    const url = `/api/fixture/merchandise/${productCode}`;
    const response = await fetch(url);
    const { data } = await response.json();
    const group = _get(data, "data.0.group", '');
    const department = _get(data, "data.0.department", '');

    const found = data.length && products.some((e) => {
      return e.item == data[0].item
    })

    data.length && !found ?
      setProducts([{ code: productCode, group, department, ...data[0] }, ...products])
      :
      found ?
        setError("Scan different product !")
        :
        setError("Product not found !");

    setResults([""]);
  }

  const handleSubmit = async () => {
    const url = `/api/fixture/merchandise/${barcode}`;
    const options = {
      method: "POST",
      body: JSON.stringify({
        barcode,
        fixture,
        products,
        count,
        storeId,
        zone
      })
    }

    const response = await fetch(url, options);
    const { data } = await response.json();
    data.length && setSaved(true);
    setResults([""])
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
  
  const dt = new Date(_get(props, "data.0.updated_at"));
  return (
    <Layout title="Scan Products" footer={{title:"Map Merchandise", link:"/merchandise/barcode/zone"}} loginDetails={loginDetails}>
      <Stack spacing={2}>
        <div>
          <h3 className="no-margig">{fixture.name}</h3>
          <NoSsr>
          <p>Last updated on: {dt.toLocaleString(DateTime.DATETIME_FULL)}</p>
          </NoSsr>

          <p>Type: {fixture.type}</p>
          <h3 className="no-margig">Zone : {zone}</h3>

          <b>Add products</b>
        </div>
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
              {manual ? "Disable Manual Entry" : "Add Product Manually"}
            </Button>
          </Box>
          {error && notification("error", error)}
          {results[0] && products.length < 20 ?
            <Box paddingTop="16px">
              <Button onClick={() => handleProduct(results[0])} variant="contained" size="large">Add Scanned Product</Button>
            </Box>
            : null
          }
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="caption table">
            <caption>Added {products.length}/20 products</caption>
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
        {saved ? <Link href={`/`} passHref legacyBehavior><Button variant="contained">back to home</Button></Link>
          : products.length ?
            <Button onClick={handleSubmit} variant="contained">Submit</Button>
            : null}
      </Stack>
    </Layout>
  )
}