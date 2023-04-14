import { useState, useCallback } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import _get from 'lodash/get';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField } from '@mui/material';
import Layout from '../../components/layout';
import Notification from "../../components/reusable-components/alert"
// import Scanner from '../../utils/scanner';
import { supabaseConnection } from '../../utils/supabase';
const Scandit = dynamic(() => import('../../components/scandit'), {
  ssr: false,
})

export async function getServerSideProps(context) {
  const { pcode } = context.query;

  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
    .from('product_list')
    .select('*')
    .eq('item', pcode)

  // Pass data to the page via props
  return { props: { data: data } };
}

export default function Fixture(props) {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const parentProd = _get(props, "data.0");
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
    const url = `/api/fixture/adjacencies/${productCode}`;
    const response = await fetch(url);
    const { data, error } = await response.json();
    const group = _get(data, "data.0.group", '');
    const department = _get(data, "data.0.department", '');

    if (data.length && data[0].item == parentProd.item) {
      setError("Scan different product !")
    } else {

      const found = data.length && products.some((e) => {
        return e.item == data[0].item;
      })


      data.length && !found ?
        setProducts([{ code: productCode, group, department, ...data[0] }, ...products])
        :
        found ?
          setError("Scan different product !")
          :
          setError("Product not found !");
    }

    setResults([])
  }


  const handleSubmit = async () => {
    const url = `/api/fixture/adjacencies/${parentProd.item}`;
    const options = {
      method: "POST",
      body: JSON.stringify({
        parentProd,
        products
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
    <Layout title="Scan Products" footer={{ title: "Go to Map Adjacencies", link: "/adjacencies" }}>
      <h3>Parent Product Details:</h3>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <b>Item : {parentProd.item}</b>
          <b>Concept : {parentProd.concept}</b>
          <b>Department : {parentProd.department}</b>
          <b>Class : {parentProd.class}</b>
          <h3>Add Products</h3>
        </Stack>
        <Scandit btnText="Scan Child Product" onDetected={_onDetected} scandit_licence_key={_get(props, "scandit_licence_key")} />
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
        {products.length ? <Button onClick={handleSubmit} variant="contained">Submit</Button> : null}
      </Stack>
    </Layout>
  )
}