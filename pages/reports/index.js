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
  const { setTitle } = useAppContext();
  setTitle("Reports");
  return (
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
  )
}

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();
    let { data, error } = await supabase
      .from('fixture_product_list')
      .select('group,department, linear_meter,fixture_library:fixture_key (type)')
      .eq('store_id', 60318);
    let finalResult = {}
    let spaceTypes = {}
    data.forEach(function (item, index) {
      spaceTypes[item.fixture_library.type] = item.fixture_library.type
      if (finalResult.hasOwnProperty(item.group)) {
        if (finalResult[item.group].hasOwnProperty(item.group)) {
          finalResult[item.group][item.fixture_library.type] = finalResult[item.group][item.fixture_library.type] + item.linear_meter
        } else {
          finalResult[item.group][item.fixture_library.type] =  item.linear_meter;
        }
      } else {
        finalResult[item.group] = {
          "Group" : item.group
        }
        finalResult[item.group][item.fixture_library.type] =  item.linear_meter;
      }
    });
    return { props: { data: Object.values(finalResult), "key_values" : Object.keys(spaceTypes)} };
}