import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import { useRouter } from 'next/router'
export default function Header() {
  const router = useRouter();
  console.log(router);
  let title = "SMT";
  if(router.route === "/fixture/barcode/[fid]") {
    title = "Barcode Fixture";
  }
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