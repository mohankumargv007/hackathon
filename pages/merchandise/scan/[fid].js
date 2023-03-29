import Link from 'next/link';
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
import Scanner from '../../../utils/scanner';
import { supabaseConnection } from '../../../utils/supabase';

function createData(
  code,
  group,
  department
) {
  return { code, group, department };
}

const rows = [
  createData('12345678', "Women", "Basic"),
  createData('12345677', "Men", "Basic2"),
  createData('12345676', "Kids", "Basic3"),
];


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
  const fixture = _get(props, "data.0", {});
  const [scanner, setScanner] = useState(false);
  const [results, setResults] = useState([]);
  const [Products,setProducts] = useState([])

  
  const handleScanner =() =>{
    setScanner(true)
  }
  
  const _onDetected = result => {
    setResults([])
    setResults([result])
  }

  const handleProduct  = (productCode) =>{
    setProducts([createData(productCode),...Products])
    setResults([])

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
            rowsMax={4}
            defaultValue={'No product scanned'}
            value={results[0] ? results[0].codeResult.code : Products.length ==0 ? 'No product scanned' : 'scan next product'}/>
            {results[0] ? <Button onClick={()=>handleProduct(results[0].codeResult.code)} variant="contained">add product</Button> : null}
        </Box>
        {scanner ? (<Paper variant="outlined" style={{marginTop:30, minWidth:320, height:320}}>
      <Scanner onDetected={_onDetected} />
        </Paper>): null}
        <TableContainer component={Paper}>
          <Table aria-label="caption table">
            <caption>Added {Products.length}/5 products</caption>
            <TableHead>
              <TableRow>
                <TableCell>Item Code</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Products.map((row, index) => (
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
        <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained">Submit</Button></Link>
      </Stack>
    </Box>
  )
}