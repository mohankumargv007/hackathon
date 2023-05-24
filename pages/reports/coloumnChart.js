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



export default function ColoumnReport(props) {
    let data = _get(props, 'data', []);
      const coloumnData = data.map((e)=>{
        return parseFloat(e.lm).toFixed(2)
      })
      const xaxisData = data.map((e)=>{
        return e.gname;
      })
      
  const [drawer, setDrawer] = useState(false);

  const drawerClose = () => {
    setDrawer(false)
  }
  const state =  {
          
    series: [{
      name: 'Linear Meters',
      data: coloumnData
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "m";
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      
      xaxis: {
        categories: xaxisData,
        position: 'top',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "m";
          }
        }
      
      },
      title: {
        text: 'category vise linear meter ',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444'
        }
      }
    },
  
  
  };



  return (

    <Layout title="Reports" {...props}>
      <NoSsr>
        <div id="chart">
          <Chart options={state.options} series={state.series} type="bar" height={350} />
        </div>
        <Button variant="contained" className={styles.btn} size="large" onClick={() => setDrawer(true)}>Reports</Button>
        <SideDrawer handleOpen={drawer} handleClose={drawerClose} />
      </NoSsr>
    </Layout>


  );


}


export async function getServerSideProps({res, req}) {
  const cookies = new Cookies(req, res);
  const storeId = cookies.get('userStoreId') ?? null
  // Fetch data from external API
  const supabase = supabaseConnection();
  let { data, error } = await supabase
      .rpc('get_bar_report_data', { '__store_id': storeId })
  return { props: { data: data } };
}
