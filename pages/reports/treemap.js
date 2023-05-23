import _get from 'lodash/get';
import { supabaseConnection } from '../../utils/supabase';
import NoSsr from '@mui/base/NoSsr';
import SideDrawer from '../../components/drawer';
import Button from '@mui/material/Button';
import styles from '../../styles/Home.module.css';
import { useState } from "react";
import Layout from '../../components/layout';
import dynamic from 'next/dynamic';
import Cookies from 'cookies'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });



export default function Treemap(props) {

  const [drawer, setDrawer] = useState(false);
  let data = _get(props, 'data', []);

  function sortByKey(arr, key) {
    return arr.sort((a, b) => a[key] - b[key]);
  }
  
  const sortedData = sortByKey(data, 'y').reverse();
  

  const drawerClose = () => {
    setDrawer(false)
  }
  const state = {
    series: [
      {
        data: sortedData
      }
    ],
    options: {
      legend: {
        show: false
      },
      chart: {
        height: 350,
        type: 'treemap'
      },
      title: {
        text: 'Distibuted Treemap (different color for each cell)',
        align: 'center'
      },
      colors: [
        '#3B93A5',
        '#F7B844',
        '#ADD8C7',
        '#EC3C65',
        '#CDD7B6',
        '#C1F666',
        '#D43F97',
        '#1E5D8C',
        '#421243',
        '#7F94B0',
        '#EF6537',
        '#C0ADDB'
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false
        }
      }
    },


  };

  return (

    <Layout title="Reports">
      <NoSsr>
        <div id="chart">
          <Chart options={state.options} series={state.series} type="treemap" height={350} />
        </div>
        <Button variant="contained" className={styles.btn} size="large" onClick={() => setDrawer(true)}>Reports</Button>
        <SideDrawer handleOpen={drawer} handleClose={drawerClose} />
      </NoSsr>
    </Layout>


  );


}
export async function getServerSideProps({req, res}) {
  const cookies = new Cookies(req, res);
  const storeId = cookies.get('userStoreId') ?? null
  // Fetch data from external API
  const supabase = supabaseConnection();
  let { data, error } = await supabase
      .rpc('get_tree_report_data', { 'store_id': storeId })
      .select()

  const reportData = data.map((e)=>{
    return {x:e.label,y:parseFloat(e.lm).toFixed(2)}
  })
  
  return { props: { data: reportData } };
}
