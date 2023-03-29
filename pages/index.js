import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home(props) {
  return (
    <Box paddingX="20px" paddingY="30px">
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Link className={styles.btn} href="/fixture/search" passHref legacyBehavior>
          <Button variant="contained" className={styles.btn}>Barcode a Fixtue</Button>
        </Link>
        <Link className={styles.btn} href="/merchandise/scan-fixture" passHref legacyBehavior>
          <Button variant="contained" className={styles.btn}>Map Merchandise</Button>
        </Link>
        <Link className={styles.btn} href="/fixture/remove" passHref legacyBehavior>
          <Button variant="contained" className={styles.btn}>Remove Fixture</Button>
        </Link>
        <Link className={styles.btn} href="/adjacencies" passHref legacyBehavior>
          <Button variant="contained" className={styles.btn}>Map Adjacencies</Button>
        </Link>
        <Button variant="contained" className={styles.btn}>Reports</Button>
      </Stack>
    </Box>
  )
}
