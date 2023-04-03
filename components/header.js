import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import { useContext } from 'react'
import { useFixtureContext } from '../contexts/fixtureContext';
export default function Header() {
  const { title } = useFixtureContext();
  // const router = useRouter();
  // let title = "SMT";
  // console.log(router.route);
  // if(router.route === "/fixture/barcode/[fid]") {
  //   title = "Barcode Fixture";
  // } else if (router.route === "/fixture/search") {
  //   title = "Select Fixture";
  // } else if(router.route === "/fixture/[fid]") {
  //   title = "Review Fixture Details";
  // } else if (router.route === "/merchandise/scan-fixture") {
  //   title = "Scan Fixture";
  // } else if (router.route === "/merchandise/search") {
  //   title = "Select Fixture";
  // } else if (router.route === "/merchandise/barcode/[barcode]" || router.route === "/merchandise/fid/[fid]") {
  //   title = "Review Fixture Details";
  // } else if (router.route === "/merchandise/barcode/scan/[barcode]" || router.route === "/merchandise/fid/scan/[fid]") {
  //   title = "Scan Products";
  // } else if (router.route === "/fixture/remove") {
  //   title = "Remove Fixture";
  // } else if (router.route === "/fixture/remove/[barcode]") {
  //   title = "Remove Fixture";
  // } else if (router.route === "/adjacencies") {
  //   title = "Scan Product";
  // } else if (router.route === "/adjacencies/[pcode]") {
  //   title = "Scan Products";
  // } else if (router.route === "/reports") {
  //   title = "Reports";
  // }
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