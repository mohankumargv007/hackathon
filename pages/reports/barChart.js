import _get from 'lodash/get';
import { supabaseConnection } from '../../utils/supabase';
import NoSsr from '@mui/base/NoSsr';
import SideDrawer from '../../components/drawer';
import Button from '@mui/material/Button';
import styles from '../../styles/Home.module.css';
import {useState} from "react";
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

export default function BarChartReport(props) {

  const [drawer,setDrawer] = useState(false);

  const drawerClose = () => {
    setDrawer(false)
  }

  const isServer = typeof window === "undefined";
  let reportData = getReportData(_get(props, 'data', []));
  let width = 350;
  let height = 350;
  let margin = {
    top: 20,
    right: 10,
    left: 10,
    bottom: 5
  };
  if(!isServer && screen && screen.width > 500) {
    width = 500;
    height = 500;
    margin = {
      top: 20,
      right: 30,
      left: 10,
      bottom: 5
    };
  }
  return (
    <Layout title="Reports" {...props}>
      <NoSsr>
        <BarChart
          width={width}
          height={height}
          data={Object.values(reportData)}
          margin={margin}
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
      </NoSsr>
      <Button variant="contained" className={styles.btn} size="large" onClick={() =>setDrawer(true)}>Reports</Button>
      <SideDrawer handleOpen = {drawer} handleClose = {drawerClose}/>
    </Layout>
  )
}

export async function getServerSideProps() {
  // Fetch data from external API
  const supabase = supabaseConnection();
  let { data, error } = await supabase
    .rpc('get_bar_report_data', { 'store_id': 60318 })
  return { props: { data: data } };
}

function  getReportData(data) {
  return data.reduce(mapReportData, {})
}

function mapReportData(reportData, item) {
  reportData[item.gname] = reportData[item.gname] ?? { "Group": item.gname }
  reportData[item.gname][item.gtype] = reportData[item.gname][item.gtype] ? (reportData[item.gname][item.gtype] + item.lm) : item.lm
  return reportData
}