import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Header from './header';
import Footer from './footer';

export default function Layout({children, title, footer}) {
  return (
    <>
      <Header title={title} />
      <Box padding="75px 0px 20px">
        <Box display="flex" padding="0 20px 15px">
          <Box flexGrow={1}>User: Atul</Box>
          <Box flexGrow={1}>Storeid: 60318</Box>
          <Box flexGrow={1}>Concept: Max</Box>
        </Box>
        <Divider />
        <Box padding="15px 20px">{children}</Box>
      </Box>
      <Footer footer={footer} />
    </>
  )
}