import { useState } from 'react';
import { useRouter } from 'next/router';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import _get from 'lodash/get';

export default function BasicPagination(props) {
  const { pages } = props;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(_get(router, "query.page", 1));

  const handleChange = (event, value) => {
    router.push(`?page=${value}`, undefined, { shallow: true })
  };

  return (
    <Box pt={3} display="flex" justifyContent="center">
      <Pagination defaultPage={parseInt(currentPage)} count={pages} color="primary" onChange={handleChange} />
    </Box>
  );
}