import { useEffect } from 'react';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import { Paper, TextField, Alert } from '@mui/material'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Layout from '../../components/layout';
import Scanner from '../../utils/scanner';

export default function Fixture(props) {
  const router = useRouter();
  const [scanner, setScanner] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(false);

  const handleProceed = async () => {
    const productCode = _get(results, "0.codeResult.code");
    const url = `/api/fixture/adjacencies/${productCode}`;
    const response = await fetch(url);
    const { data, error } = await response.json();
    if (data.length) {
      router.push(`/adjacencies/${productCode}`);
    } else {
      setError(true);
      setResults([]);
    }
  }

  const handleScanner = () => {
    setScanner(true)
  }

  const _onDetected = result => {
    setResults([])
    setResults([result])
  }

  return (
    <Layout title="Scan Product">
      <Box paddingX="20px" paddingY="40px">
        <Stack spacing={4}>
          <Button onClick={handleScanner} variant="contained" >Scan Product</Button>

          {scanner ? (<Paper variant="outlined" style={{ marginTop: 30, minWidth: 320, height: 320 }}>
            <Scanner onDetected={_onDetected} />
          </Paper>) : null}
          <TextField
            style={{ fontSize: 50, width: 320, height: 70, marginTop: 30 }}
            rowsmax={4}
            type='number'
            value={results[0] ? results[0].codeResult.code : 'No product scanned'}
            onChange={event => {
              setResults([{ codeResult: { code: event.target.value } }]);
              error && setError(false);
            }}
          />
          {error && <Alert severity="error">Barcode not found !</Alert>}
          {_get(results, "0.codeResult.code") &&
            <Button onClick={handleProceed} variant="contained">Proceed</Button>
          }
        </Stack>
      </Box>
    </Layout>
  )
}