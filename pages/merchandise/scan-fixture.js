import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Layout from '../../components/layout';
import Notification from "../../components/reusable-components/alert"

const Scandit = dynamic(() => import('../../components/scandit'), {
  ssr: false,
})

export default function Fixture(props) {
  const { loginDetails } = props;
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(false);
  const [manual, setManual] = useState(false);

  const manualEntry = () => {
    setManual(!manual);
  }

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

  const _onDetected = useCallback((result) => {
    setResults([]);
    if (result.length == 13) {
      setResults([result])
    }
  }, []);

  const notification = (type, msg) => {
    return (
      <Notification
        state={{
          vertical: 'top',
          horizontal: 'center'
        }}
        toastType={type}
        toastMessage={msg}
        onClose={() => error && setError(false)}
      ></Notification>
    )
  }

  return (
    <Layout title="Scan Fixture" loginDetails={loginDetails}>
      <Stack spacing={4}>
        <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained" size="large">Arms, Prongs, Shelves</Button></Link>
        <Scandit btnText="Scan Fixture" onDetected={_onDetected} scandit_licence_key={_get(props, "scandit_licence_key")} />
        <Box display="flex">
          <TextField
            label="Scanned data"
            style={{ maxWidth: 300 }}
            fullWidth
            rowsmax={4}
            type='text'
            value={_get(results, "0")}
            onChange={event => {
              setResults([event.target.value]);
              error && setError(false);
            }}
            InputProps={{
              readOnly: !manual
            }}
            InputLabelProps={{
              shrink: true
            }}
            color="secondary"
          />
          &nbsp;&nbsp;
          <Button variant="contained" onClick={manualEntry} size="small" className="to-lowercase manual-btn">
            {manual ? "Disable Manual Entry" : "Add Fixture Manually"}
          </Button>
        </Box>
        {error && notification("error", "Barcode not found !")}
        {_get(results, "0") ? <Button onClick={handleProceed} variant="contained" size="large">Proceed</Button> : null}
      </Stack>
    </Layout>
  )
}