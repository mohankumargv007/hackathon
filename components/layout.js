import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import _get from 'lodash/get';
import Header from './header';
import Footer from './footer';

export default function Layout({children, title, footer, loginDetails}) {
  return (
    <>
      <Header title={title} />
      <Box padding="75px 0px 20px">
        <Box display="flex" padding="0 20px 15px">
          <Box flexGrow={1}><b>User: </b>{_get(loginDetails, "user", "")}</Box>
          <Box flexGrow={1}><b>Storeid: </b>{_get(loginDetails, "storeId", "")}</Box>
          <Box flexGrow={1}><b>Concept: </b>{_get(loginDetails, "conceptName", "")}</Box>
        </Box>
        <Divider />
        <Box padding="15px 20px">{children}</Box>
      </Box>
      <Footer footer={footer} />
    </>
  )
}