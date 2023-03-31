import Link from 'next/link';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
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
import {TextareaAutosize} from '@mui/material'
import { useState } from 'react';
import Scanner from '../../../../utils/scanner';
import { supabaseConnection } from '../../../../utils/supabase';

export async function getServerSideProps(context) {
  const { barcode } = context.query;
  const fkey = barcode.slice(5,10)

  // Fetch data from external API
  const supabase = supabaseConnection();

  let { data, error } = await supabase
  .from('fixture_library')
  .select('*')
  .eq('key', fkey)

  // Pass data to the page via props
  return { props: { data: data } };
}

export default function Fixture(props) {
  const router = useRouter();
  const barcode = _get(router, "query.barcode", "");

  const fixture = _get(props, "data.0", {});
  const [scanner, setScanner] = useState(false);
  const [results, setResults] = useState([]);
  const [products,setProducts] = useState([])

  const handleScanner =() =>{
    setScanner(true)
  }
  
  const _onDetected = result => {
    setResults([])
    setResults([result])
  }

  const handleProduct  = async (productCode) =>{
    const url = `/api/fixture/merchandise/${productCode}`;
    const response = await fetch(url);
    const data = await response.json();
    const group = _get(data,"data.0.group",'');
    const department =  _get(data,"data.0.department",'');
    setProducts([{code : productCode, group, department,...data.data[0]?data.data[0]:''},...products])
    setResults([])

  }

  const handleSubmit = async () =>{
const url =`/api/fixture/merchandise/${barcode}`;
const options ={
  method : "POST",
  body : JSON.stringify({
    barcode,
    fixture,
    products
  })
}
const response = await fetch(url, options);
const data = await response.json();
  }
  
  return (
    <Box paddingX={"20px"}>
      <Stack spacing={2}>
        <h3>{fixture.name}</h3>
        Type: {fixture.type}
        <h4>Add products</h4>
        <Box >
        <TextareaAutosize
            style={{fontSize:20, width:320, height:70, marginTop:30}}
            rowsmax={4}
            value={results[0] ? results[0].codeResult.code : products.length ==0 ? 'No product scanned' : 'scan next product'}/>
            {results[0] ? <Button onClick={()=>handleProduct(results[0].codeResult.code)} variant="contained">add product</Button> : null}
        </Box>
        {scanner ? (<Paper variant="outlined" style={{marginTop:30, minWidth:320, height:320}}>
      <Scanner onDetected={_onDetected} />
        </Paper>): null}
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
        <Button onClick={(e)=>handleScanner(e)} variant="contained">Scan More</Button>
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </Stack>
    </Box>
  )
}