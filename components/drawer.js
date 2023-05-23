import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PieChartIcon from '@mui/icons-material/PieChart';
import Link from 'next/link';

const navData = [
  // {
  //   link: 'barChart',
  //   name: 'BarChart'
  // },
  {
    link: 'coloumnChart',
    name: 'ColoumnChart'
  },
  {
    link: 'treemap',
    name: 'Treemap'
  },
  
]
export default function SideDrawer(props) {
    const anchor = "right"

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={props.handleClose}
      onKeyDown={props.handleClose}
    >
      <List>
        {navData.map((text, index) => (
        <Link href={`/reports/${text.link}`} key={text.link} passHref legacyBehavior>  
        <ListItem  disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <AnalyticsIcon /> : <PieChartIcon />}
              </ListItemIcon>
              <ListItemText primary={text.name} />
            </ListItemButton>
          </ListItem>
          </Link>
        ))}
      </List>
     </Box>
  );

  return (
        <>
          <Drawer
            anchor={anchor}
            open={props.handleOpen}
            onClose={props.handleClose}
          >
            {list(anchor)}
          </Drawer>
        </>
  );
}