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
  return (
    <Box paddingX={"20px"}>
      <Stack spacing={2}>
        <h3>Add products</h3>
        ////////////////////
        <TableContainer component={Paper}>
          <Table aria-label="caption table">
            <caption>Added 3/5 products</caption>
            <TableHead>
              <TableRow>
                <TableCell>Item Code</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
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
        <Link href={`/merchandise/barcode/${fixture.id}`} passHref legacyBehavior><Button variant="contained">Scan More</Button></Link>
        <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained">Submit</Button></Link>
      </Stack>
    </Box>
  )
}