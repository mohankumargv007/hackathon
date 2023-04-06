import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import { TextField, Alert } from '@mui/material'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Layout from '../../../components/layout';

const Scandit = dynamic(() => import('../../../components/scandit'), {
  ssr: false,
})

export default function Fixture(props) {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(false);

  const handleProceed = async () => {
    const barcode = _get(results, "0");
    const url = `/api/fixture/barcode/${barcode}`;
    const response = await fetch(url);
    const { data, error } = await response.json();
    if (data.length) {
      router.push(`/fixture/remove/${barcode}`);
    } else {
      setError(true);
      setResults([]);
    }
  }

  const _onDetected = useCallback((result) => {
    setResults([]);
    setResults([result])
  }, []);

  return (
    <Layout title="Remove Fixture">
      <Box paddingX="20px" paddingY="40px">
        <Stack spacing={4}>
          <Scandit btnText="Scan Fixture" onDetected={_onDetected} />
          <TextField
            style={{ fontSize: 50, width: 320, height: 50 }}
            rowsmax={4}
            type='number'
            value={_get(results, "0", "No data scanned")}
            onChange={event => {
              setResults([{ codeResult: { code: event.target.value } }]);
              error && setError(false);
            }}
          />
          {error && <Alert severity="error">Barcode not found !</Alert>}
          {_get(results, "0") &&
          <Box paddingY="20px">
            <Button onClick={handleProceed} variant="contained" disableElevation size="medium" fullWidth={true}>Get Details</Button>
          </Box>
          }
        </Stack>
      </Box>
    </Layout>
  )
}