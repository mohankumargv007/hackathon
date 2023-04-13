import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';

export default function Header(props) {
  const { title } = props;
  const router = useRouter();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {router.pathname !== '/' &&
          <Box sx={{ display: 'flex' }}>
            <IconButton
              size="small"
              aria-label="show more"
              aria-haspopup="true"
              color="inherit"
              onClick={() => router.back()}
            >
              <ArrowBack />
            </IconButton>
          </Box>
          }
          &nbsp;&nbsp;
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {router.pathname !== '/' &&
          <Box sx={{ display: 'flex' }}>
            <Link href="/" passHref legacyBehavior>
              <IconButton
                size="small"
                aria-label="show more"
                aria-haspopup="true"
                color="inherit"
              >
                <HomeIcon />
              </IconButton>
            </Link>
          </Box>
          }
        </Toolbar>
      </AppBar>
    </Box>
  )
}