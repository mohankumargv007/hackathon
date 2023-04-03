import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import {TextareaAutosize, Paper,TextField} from '@mui/material'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Scanner from '../../utils/scanner'
import { verify } from 'crypto';
import Quagga from 'quagga'
import { useAppContext } from '../../contexts/appContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Fixture(props) {
  const { setTitle } = useAppContext();
  setTitle("Scan Fixture");
  const router = useRouter();
  const [scanner,setScanner] = useState(false)
  const [results,setResults] = useState([])

  // useEffect( async () => {
  //   try {
  //     if(results[0]) {
  //       const code = _get(results, "0.codeResult.code");
  //       if(code.length == 13){
  //         const url = `/api/fixture/merchandise/${productCode}`;
  //         const response = await fetch(url);
  //         const data = await response.json();
  //         router.push(`/merchandise/barcode/${code}`);
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [results]);

  const handleScanner = ( ) =>{
    setScanner(true)
  }

  const handleProceed = async () =>{
    if(results[0]) {
      const code = _get(results, "0.codeResult.code");
      router.push(`/merchandise/barcode/${code}`);
      const url = `/api/fixture/barcode/${results[0].codeResult.code}`;
      const response = await fetch(url);
      const {data,error} = await response.json();
      if(data.length) {
        const code = _get(results, "0.codeResult.code");        
        router.push(`/merchandise/barcode/${code}`);
      } else {
        toast.error('Barcode not found !', {
          position: toast.POSITION.TOP_LEFT
        });
        setResults([])
      }
    }
  }

  const _onDetected = result => {
    setResults([])
    if(result.codeResult.code .length == 13){
    setResults([result])
    }
  }

  return (
    <Box paddingX="20px" paddingY="40px">
      <Stack spacing={4}>
        <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained">Arms, Prongs, Shelves</Button></Link>
        <Button onClick = {handleScanner} variant="contained" >Scan Fixture</Button>
        <ToastContainer />
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
      {results[0] ? <Button onClick = {handleProceed} variant="contained" >Proceed</Button> : null}

    </Box>
  )
}