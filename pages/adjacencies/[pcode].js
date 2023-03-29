import { useState } from "react";
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
import {TextareaAutosize} from '@mui/material';
import Scanner from '../../utils/scanner';
import { supabaseConnection } from '../../utils/supabase';

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
  const { pcode } = context.query;
  console.log(pcode);
 
  // Fetch data from external API
  // const supabase = supabaseConnection();

  // let { data, error } = await supabase
  // .from('fixture_library')
  // .select('*')
  // .eq("id", fid)

  // Pass data to the page via props
  // return { props: { data: data } };
  return {props: {}};
}

export default function Fixture(props) {
  const router = useRouter();
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
  // const [fixture, setFixture] = useState(_get(props, "data.0", {}));
  return (
    <Box paddingX={"20px"}>
      <Stack spacing={2}>
        {router.query.pcode}
        <h3>Add Products</h3>
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
        <Button onClick={(e)=>handleScanner(e)} variant="contained">Scan More</Button>
        <Button variant="contained">Submit</Button>
      </Stack>
    </Box>
  )
}