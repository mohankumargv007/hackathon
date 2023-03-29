import _get from 'lodash/get';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Btn(props) {
  return (
    <Box paddingY="20px">
      <Button variant="contained" disableElevation size="medium" fullWidth={true}>Get Details</Button>
    </Box>
  )
}