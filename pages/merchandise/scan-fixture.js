import Link from 'next/link';
import _get from 'lodash/get';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function Fixture(props) {
  return (
    <Box paddingX="20px" paddingY="40px">
      <Stack spacing={4}>
        <Link href={`/merchandise/search`} passHref legacyBehavior><Button variant="contained">Arms, Prongs, Shelves</Button></Link>
        <Link href={`/merchandise/review`} passHref legacyBehavior><Button variant="contained">Scan Fixture</Button></Link>
      </Stack>
    </Box>
  )
}