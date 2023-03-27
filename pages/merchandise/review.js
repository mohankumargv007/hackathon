import Link from 'next/link';
import _get from 'lodash/get';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styles from '../../styles/Layout.module.css';

export default function Fixture(props) {
  return (
    <div className={styles.container}>
      <Stack spacing={4}>
        <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained">Arms, Prongs, Shelves</Button></Link>
        <Link href={`/merchandise/review`} passHref legacyBehavior><Button variant="contained">Scan Fixture</Button></Link>
      </Stack>
    </div>
  )
}