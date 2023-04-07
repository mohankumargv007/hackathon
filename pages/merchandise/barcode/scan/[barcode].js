import Link from 'next/link';
import { useState, useEffect ,useCallback} from 'react';
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
import { TextField } from '@mui/material';
import Layout from '../../../../components/layout';
// import Scanner from '../../../../utils/scanner';
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
  const router = useRouter();
  const barcode = _get(router, "query.barcode", "");

  const fixture = _get(props, "data.0.fixture_library", {});
  const [scanner, setScanner] = useState(false);
  const [results, setResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);


  const _onDetected = useCallback((result) => {
    setResults([]);
      setResults([result]);
      setError(false);
  }, []);

  const handleProduct = async (productCode) => {
    const url = `/api/fixture/merchandise/${productCode}`;
    const response = await fetch(url);
    const { data, error } = await response.json();
    const group = _get(data, "data.0.group", '');
    const department = _get(data, "data.0.department", '');
    data.length ? setProducts([{ code: productCode, group, department, ...data[0] }, ...products]) : setError(true);
    setResults([]);
  }

  const handleSubmit = async () => {
    const url = `/api/fixture/merchandise/${barcode}`;
    const options = {
      method: "POST",
      body: JSON.stringify({
        barcode,
        fixture,
        products
      })
    }

    const response = await fetch(url, options);
    const { data, error } = await response.json();
    data.length && setSaved(true);
    setResults([])
  }

  return (
    <Layout title="Scan Products">
      <Box paddingX={"20px"}>
        <Stack spacing={2}>
          <h3>{fixture.name}</h3>
        Type: {fixture.type}
          <h4>Add products</h4>
          <Box >
            <TextField
              style={{ fontSize: 50, width: 320, height: 70, marginTop: 30 }}
              rowsmax={4}
              type='number'
              value={results[0] || ""}
              onChange={event => {
                setResults([event.target.value]);
                error && setError(false);
              }}
            />
            {error && <Alert severity="error">Product not found !</Alert>}
            {results[0] ? <Button onClick={() => handleProduct(results[0])} variant="contained">add product</Button> : null}
          </Box>
          <Scandit btnText="Scan Product" onDetected={_onDetected} />
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
          {saved ? <Link href={`/`} passHref legacyBehavior><Button variant="contained">back to home</Button></Link> : <Button onClick={handleSubmit} variant="contained">Submit</Button>}
        </Stack>
      </Box>
    </Layout>
  )
}