import { useState ,useCallback} from "react";
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
  const [scanner, setScanner] = useState(false);
  const [results, setResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const parentProd = _get(props, "data.0");

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

  const notification = (type,msg) =>{
    return(
                 <Notification
                    state={ {
                      vertical        : 'top',
                      horizontal      : 'center'
                  }}
                    toastType={type}
                    toastMessage={msg}
                    onClose={()=>error && setError(false)}
                ></Notification>
    )
  }

  // const [fixture, setFixture] = useState(_get(props, "data.0", {}));
  return (
    <Layout title="Scan Products">
      <Box paddingX={"20px"}>
        <h3>Parent Product Details:</h3>
        <h4>Item : {parentProd.item}</h4>
        <h4>Concept : {parentProd.concept}</h4>
        <h4>Department : {parentProd.department}</h4>
        <h4>Class : {parentProd.class}</h4>

        <Stack spacing={2}>
          <h3>Add Products</h3>
          <Box >
            <TextField
              style={{ fontSize: 50, width: 320, height: 70, marginTop: 30 }}
              rowsmax={4}
              type='number'
              value={results[0] || ""}
              onChange={event => {
                setResults([event.target.value]);
                error && setError(false)
              }}
            />
            {error && notification("error", error)}
            {results[0] && products.length < 20 ? <Button onClick={() => handleProduct(results[0])} variant="contained">add product</Button> : null}
          </Box>
          <Scandit btnText="Scan Product" onDetected={_onDetected} scandit_licence_key={_get(props, "scandit_licence_key")} />
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
          {saved ? <Link href={`/`} passHref legacyBehavior><Button variant="contained">back to home</Button></Link> : (products.length ? <Button onClick={handleSubmit} variant="contained">Submit</Button> : null)}
        </Stack>
      </Box>
    </Layout>
  )
}