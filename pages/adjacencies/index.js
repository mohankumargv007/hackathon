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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Fixture(props) {
  const router = useRouter();
  const [scanner, setScanner] = useState(false);
  const [results, setResults] = useState([]);

  // useEffect(() => {
  //   try {
  //     if(results[0]) {
  //       const code = _get(results, "0.codeResult.code");
  //       if(code) {
  //         router.push(`/adjacencies/${code}`);
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [results]);
  const handleProceed = async () =>{
    const productCode = _get(results, "0.codeResult.code");
    const url = `/api/fixture/adjacencies/${productCode}`;
    const response = await fetch(url);
    const {data,error} = await response.json();
    if(data.length) {
                      
              router.push(`/adjacencies/${productCode}`);
    } else {
      toast.error('Product not found !', {
        position: toast.POSITION.TOP_LEFT
    });
      setResults([])
    }
            
  }

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
        <Button onClick = {handleScanner} variant="contained" >Scan Product</Button>

        {scanner ? (<Paper variant="outlined" style={{marginTop:30, minWidth:320, height:320}}>
        <Scanner onDetected={_onDetected} />
        </Paper>): null}
        <ToastContainer />
        {/* <TextareaAutosize
          style={{fontSize:32, width:320, height:100, marginTop:30}}
          rowsmax={4}
          // defaultValue={'No procust scanned'}
          value={results[0] ? results[0].codeResult.code : 'No product scanned'}
        /> */}
        <TextField
            style={{fontSize:50, width:320, height:70, marginTop:30}}
            rowsmax={4}
            type='number'
            value={results[0] ? results[0].codeResult.code : 'No product scanned'}
            onChange={event => {
              setResults([{codeResult:{code:event.target.value}}]);
            }}
          /> 

        {_get(results, "0.codeResult.code") &&
          // <Link href={`/adjacencies/${_get(results, "0.codeResult.code")}`} passHref legacyBehavior>
            <Button onClick={handleProceed} variant="contained">Proceed</Button>
          //  {/* </Link> */}
        }
      </Stack>
    </Box>
  )
}