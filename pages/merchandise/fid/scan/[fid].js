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
  .order("id", {ascending: false})
  .range(0,0)

  if(fbdata.length === 0) {
    const { data: fbndata, fbnerror } = await supabase
    .from('fixture_barcode')
    .insert([{
      store_id: 60318,
      fixture_key: fixture.key,
      counter : "001",
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
  const count = _get(router, "query.count","")
  const fbdata = _get(props, "fbdata.0", {});
  const fixture = _get(props, "data.0", {});
  const barcode = fbdata.fixture_barcode

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

  const handleSubmit = async () => {
const url =`/api/fixture/merchandise/${barcode}`;
const options ={
  method : "POST",
  body : JSON.stringify({
    barcode,
    fixture,
    products,
    count
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
        {/* <Link href={`/merchandise/barcode/${fixture.id}`} passHref legacyBehavior><Button onClick={(e)=>handleScanner(e)} variant="contained">Scan More</Button></Link> */}
        <Button onClick={(e)=>handleScanner(e)} variant="contained">Scan More</Button>
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </Stack>
    </Box>
  )
}