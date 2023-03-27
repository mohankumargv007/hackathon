import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Home(props) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Link className={styles.btn} href="/fixture/search" passHref legacyBehavior>
            <Button variant="contained" className={styles.btn}>Barcode a Fixtue</Button>
          </Link>
          <Button variant="contained" className={styles.btn}>Map Merchandise</Button>
          <Button variant="contained" className={styles.btn}>Remove Fixture</Button>
          <Button variant="contained" className={styles.btn}>Map Adjacencies</Button>
          <Button variant="contained" className={styles.btn}>Reports</Button>
        </Stack>
      </main>
    </div>
  )
}
