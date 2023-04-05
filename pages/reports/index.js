import { useEffect } from 'react';
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
import { useAppContext } from '../../contexts/appContext';

export default function Fixture(props) {
  let reportData = props.data.reduce(get_report_data, {})
  const { setTitle } = useAppContext();
  useEffect(() => {
    setTitle("Reports");
  }, []);
  return (
    <Box paddingX="20px" paddingY="40px">
      <BarChart
        width={500}
        height={500}
        data={Object.values(reportData)}
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
  )
}

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();
    let { data, error } = await supabase
      .rpc('get_report_data', {'store_id' : 60318})
    return { props: { data: data} };
}

function get_report_data(report_data, item) {
    report_data[item.gname] = report_data[item.gname] ?? {"Group" : item.gname}
    report_data[item.gname][item.gtype] =  report_data[item.gname][item.gtype] ? (report_data[item.gname][item.gtype] + item.lm) : item.lm
    return report_data
}