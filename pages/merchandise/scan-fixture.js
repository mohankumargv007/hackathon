import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import {TextareaAutosize, Paper} from '@mui/material'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Scanner from '../../utils/scanner'


export default function Fixture(props) {
  const router = useRouter();
  const [scanner,setScanner] = useState(false)
  const [results,setResults] = useState([])

  useEffect(() => {
    try {
      if(results[0]) {
        const code = _get(results, "0.codeResult.code");
        if(code) {
          const codearr = code.split("&");
          const id = _get(codearr, "2");
          if(id) {
            router.push(`/merchandise/fid/${id}`);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [results]);

const handleScanner = ( ) =>{
    setScanner(true)
}

// const _scan = () => {
//   this.setState({ scanning: !this.state.scanning })
// }

const _onDetected = result => {
  setResults( [] )
  setResults([...results].concat([result]))
}

  return (
    <Box paddingX="20px" paddingY="40px">
      <Stack spacing={4}>
        <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained">Arms, Prongs, Shelves</Button></Link>
        <Button onClick = {handleScanner} variant="contained" >Scan Fixture</Button>

      {scanner ? (<><p>scanner on</p> <div style={{display:"none"}}>
      <Scanner onDetected={_onDetected} />
        </div></>): null}

        <TextareaAutosize
            style={{fontSize:32, width:320, height:100, marginTop:30}}
            rowsMax={4}
            defaultValue={'No data scanned'}
            value={results[0] ? results[0].codeResult.code : 'No data scanned'}
        />
      </Stack>
    </Box>
  )
}