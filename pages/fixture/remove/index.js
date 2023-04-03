import { useEffect } from 'react';
import Link from 'next/link';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import {TextareaAutosize, Paper,TextField} from '@mui/material'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Scanner from '../../../utils/scanner';
import { useAppContext } from '../../../contexts/appContext';

export default function Fixture(props) {
  const { setTitle } = useAppContext();
  setTitle("Remove Fixture");
  const [scanner, setScanner] = useState(false);
  const [results, setResults] = useState([]);

  // useEffect(() => {
  //   try {
  //     if(results[0]) {
  //       const code = _get(results, "0.codeResult.code");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [results]);

  const handleScanner = ( ) =>{
    setScanner(true)
  }

  const _onDetected = result => {
    setResults([])
    setResults([result])
  }

  return (
    <Box paddingX="20px" paddingY="40px">
      <Stack spacing={4}>
        <Button onClick = {handleScanner} variant="contained" >Scan Fixture</Button>

      {scanner ? (<Paper variant="outlined" style={{marginTop:30, minWidth:320, height:320}}>
      <Scanner onDetected={_onDetected} />
        </Paper>): null}

        {/* <TextareaAutosize
            style={{fontSize:32, width:320, height:100, marginTop:30}}
            rowsmax={4}
            // defaultValue={'No data scanned'}
            value={results[0] ? results[0].codeResult.code : 'No data scanned'}
        /> */}
         <TextField
            style={{fontSize:50, width:320, height:70, marginTop:30}}
            rowsmax={4}
            type='number'
            value={results[0] ? results[0].codeResult.code : 'No data scanned'}
            onChange={event => {
              setResults([{codeResult:{code:event.target.value}}]);
            }}
          /> 
      </Stack>
      {_get(results, "0.codeResult.code") &&
        <Link href={`/fixture/remove/${_get(results, "0.codeResult.code")}`} passHref legacyBehavior>
          <Box paddingY="20px">
            <Button variant="contained" disableElevation size="medium" fullWidth={true}>Get Details</Button>
          </Box>
        </Link>
      }
    </Box>
  )
}