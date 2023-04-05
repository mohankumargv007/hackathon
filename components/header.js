import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import { useAppContext } from '../contexts/appContext';
export default function Header(props) {
  // const { title } = useAppContext();
  const { title } = props;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" passHref legacyBehavior>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  )
}