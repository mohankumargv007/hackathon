import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Layout from '../../../../components/layout';
import Notification from "../../../../components/reusable-components/alert"

const Scandit = dynamic(() => import('../../../../components/scandit'), {
  ssr: false,
})

export default function Fixture(props) {
  const router = useRouter();
  const query = _get(router, "query", {});
  const [results, setResults] = useState([""]);
  const [error, setError] = useState(false);
  const [manual, setManual] = useState(false);

  const manualEntry = () => {
    setManual(!manual);
  }

  const _onDetected = useCallback((result) => {
    setResults([""]);
    if (result.length > 5) {
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
    <Layout title="Scan Zone" {...props} footer={{title:"Remove Fixture", link:"/fixture/remove"}}>
      <Stack spacing={4}>
        <Scandit btnText="Scan Zone" onDetected={_onDetected} scandit_licence_key={_get(props, "scandit_licence_key")} />
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
            {manual ? "Disable Manual Entry" : "Add Zone Manually"}
          </Button>
        </Box>
        {error && notification("error", "Barcode not found !")}
        {_get(results, "0") ?
          <Link href={`/fixture/remove/scan/${query.fid}?count=${query.count}&zone=${_get(results, "0")}`} passHref legacyBehavior><Button variant="contained" size="large">Add Products</Button></Link>
          : null
        }
      </Stack>
    </Layout>
  )
}