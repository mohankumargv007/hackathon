import _get from 'lodash/get';
import { supabaseConnection } from '../../utils/supabase';
import Box from '@mui/material/Box';
import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from "recharts";
import Layout from '../../components/layout';

export default function Fixture(props) {
  return (
    <Layout title="Reports">
      <Box paddingX="20px" paddingY="40px">
        <BarChart
          width={500}
          height={500}
          data={props.data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Group" />
          <YAxis />
          <Tooltip />
          <Legend />
          
          <Bar dataKey="Prong" stackId="a" fill="#8884d8" />
          <Bar dataKey="Arm" stackId="a" fill="#82ca9d" />
          <Bar dataKey="Shelves&Bins" stackId="a" fill="#3366ff" />
          <Bar dataKey="Tables" stackId="a" fill="#ff00ff" />
        </BarChart>
      </Box>
    </Layout>
  )
}

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();
    let { data, error } = await supabase
      .rpc('get_report_data', {'store_id' : 60318})
    let finalResult = {}
    data.forEach(function (item, index) {
      finalResult[item.gname] = finalResult[item.gname] ?? {"Group" : item.gname}
      finalResult[item.gname][item.gtype] =  finalResult[item.gname][item.gtype] ? (finalResult[item.gname][item.gtype] + item.lm) : item.lm
    });
    return { props: { data: Object.values(finalResult)} };
}