import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import { TextField, Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Layout from '../../components/layout';

const Scandit = dynamic(() => import('../../components/scandit'), {
  ssr: false,
})

export default function Fixture(props) {
  const router = useRouter();
  const [results, setResults] = useState([])
  const [error, setError] = useState(false)

  const handleProceed = async () => {
    const code = _get(results, "0");
    const url = `/api/fixture/barcode/${code}`;
    const response = await fetch(url);
    const { data, error } = await response.json();
    if (data.length) {
      router.push(`/merchandise/barcode/${code}`);
    } else {
      setError(true);
      setResults([]);
    }
  }

  const _onDetected = result => {
    setResults([]);
    if (result.length == 13) {
      setResults([result])
    }
  }

  return (
    <Layout title="Scan Fixture">
      <Box paddingX="20px" paddingY="40px">
        <Stack spacing={4}>
          <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained">Arms, Prongs, Shelves</Button></Link>
          <Scandit btnText="Scan Fixture" onDetected={_onDetected} />
          <TextField
            style={{ fontSize: 50, width: 320, height: 40 }}
            rowsmax={4}
            type='number'
            value={results[0] ? results[0] : 'No data scanned'}
            onChange={event => {
              setResults([event.target.value]);
              error && setError(false);
            }}
          />
          {error && <Alert severity="error">Barcode not found !</Alert>}
        </Stack>
        {results[0] ? <Button onClick={handleProceed} variant="contained" >Proceed</Button> : null}
      </Box>
    </Layout>
  )
}