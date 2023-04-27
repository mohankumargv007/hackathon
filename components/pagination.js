import { useRef } from 'react';
import { useRouter } from 'next/router';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import _get from 'lodash/get';

export default function BasicPagination(props) {
  const { pages } = props;
  const router = useRouter();
  const currentPage = useRef(_get(router, "query.page", 1));
  const type = _get(router, "query.type");
  let searchQuery = `?page=${value}`;
  if(type) {
    searchQuery = `?page=${value}&type=${type}`;
  }

  const handleChange = (event, value) => {
    router.push(searchQuery, undefined, { shallow: true })
  };

  return (
    <Box pt={3} display="flex" justifyContent="center">
      <Pagination defaultPage={parseInt(currentPage.current)} count={pages} color="primary" onChange={handleChange} />
    </Box>
  );
}