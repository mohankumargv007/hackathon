import Button from '@mui/material/Button';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function Home(props) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Link href="/searchFixture" passHref legacyBehavior>
          <Button variant="contained" className={styles.btn}>Barcode a fixtue</Button>
        </Link>
        <Button variant="contained" className={styles.btn}>Map Merchandise</Button>
        <Button variant="contained" className={styles.btn}>Remove fixture</Button>
        <Button variant="contained" className={styles.btn}>Reports</Button>
      </main>
    </div>
  )
}
