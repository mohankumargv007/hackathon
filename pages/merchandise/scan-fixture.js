import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import { Paper, TextField, Alert } from '@mui/material';
import { verify } from 'crypto';
import Quagga from 'quagga';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Layout from '../../components/layout';
import Scanner from '../../utils/scanner';

export default function Fixture(props) {
  const router = useRouter();
  const [scanner, setScanner] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(false)

  const handleScanner = () => {
    setScanner(true)
  }

  const handleProceed = async () => {
    const code = _get(results, "0.codeResult.code");
    const url = `/api/fixture/barcode/${results[0].codeResult.code}`;
    const response = await fetch(url);
    const { data, error } = await response.json();
    if (data.length) {
      const code = _get(results, "0.codeResult.code");
      router.push(`/merchandise/barcode/${code}`);
    } else {
      setError(true);
      setResults([]);
    }

  }

  const _onDetected = result => {
    setResults([])
    if (result.codeResult.code.length == 13) {
      setResults([result])
    }
  }

  return (
    <Layout title="Scan Fixture">
      <Box paddingX="20px" paddingY="40px">
        <Stack spacing={4}>
          <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained">Arms, Prongs, Shelves</Button></Link>
          <Button onClick={handleScanner} variant="contained" >Scan Fixture</Button>
          {scanner ? (<Paper variant="outlined" style={{ marginTop: 30, minWidth: 320, height: 320 }}>
            <Scanner onDetected={_onDetected} />
          </Paper>) : null}

          <TextField
            style={{ fontSize: 50, width: 320, height: 70, marginTop: 30 }}
            rowsmax={4}
            type='number'
            value={results[0] ? results[0].codeResult.code : 'No data scanned'}
            onChange={event => {
              setResults([{ codeResult: { code: event.target.value } }]);
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