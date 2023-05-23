import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Layout from '../components/layout';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import SideDrawer from '../components/drawer';

export default function Home() {
  const [drawer,setDrawer] = useState(false);

  const drawerClose = () => {
    setDrawer(false)
  }

  return (
    <Layout title="SMT">
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Link className={styles.btn} href="/merchandise/barcode/zone" passHref legacyBehavior>
          <Button role="map-merchandise" variant="contained" className={styles.btn} size="large">Map Merchandise</Button>
        </Link>
        <Link className={styles.btn} href="/fixture/remove" passHref legacyBehavior>
          <Button variant="contained" className={styles.btn} size="large">Remove Fixture</Button>
        </Link>
        <Link className={styles.btn} href="/fixture/search" passHref legacyBehavior>
          <Button variant="contained" className={styles.btn} size="large">QRCode a Fixture</Button>
        </Link>
        <Link className={styles.btn} href="/adjacencies" passHref legacyBehavior>
          <Button variant="contained" className={styles.btn} size="large">Map Adjacencies</Button>
        </Link>
          <Button variant="contained" className={styles.btn} size="large" onClick={() =>setDrawer(true)}>Reports</Button>
          <SideDrawer handleOpen = {drawer} handleClose = {drawerClose}/>
      </Stack>
    </Layout>
  )
}
