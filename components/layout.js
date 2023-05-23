import { useState, useEffect, use } from "react";
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import _get from 'lodash/get';
import { useRouter } from 'next/router';
import Header from './header';
import Footer from './footer';

export default function Layout({children, title, footer, userDetails}) {
  const router = useRouter();
  return (
    <>
      <Header title={title} />
      <Box padding="75px 0px 60px">
        <Box display="flex" padding="0 20px 15px">
          <Box flexGrow={1}><b>User: </b>{_get(userDetails, "first_name", "")}</Box>
          <Box flexGrow={1}><b>Storeid: </b>{_get(userDetails, "store_id", "")}</Box>
          <Box flexGrow={1}><b>Concept: </b>{_get(userDetails, "concept", "")}</Box>
        </Box>
        <Divider />
        <Box padding="15px 20px">{children}</Box>
      </Box>
      {router.pathname !== '/' &&
        <Footer footer={footer} />
      }
    </>
  )
}