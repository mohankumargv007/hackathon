import * as React from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import RestoreIcon from '@mui/icons-material/Restore';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBack from '@mui/icons-material/ArrowBack';
import _get from 'lodash/get';

export default function FooterNav(props) {
  const { footer } = props;
  const router = useRouter();
  return (
    <Box>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          // value={value}
          onChange={(event, newValue) => {
            if(newValue === 0) {
              router.push("/");
            } else if (newValue === 1) {
              router.push(_get(footer, "link", ""))
            } else {
              router.back();
            }
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          {_get(footer, "title") &&
          <BottomNavigationAction label={_get(footer, "title", "")} icon={<RestoreIcon />} />
          }
          <BottomNavigationAction label="Back" icon={<ArrowBack />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}