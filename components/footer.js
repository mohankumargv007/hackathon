import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import _get from 'lodash/get';

export default function Header(props) {
  return (
    <>
    {_get(props, "footer.link") &&
    <Box sx={{ flexGrow: 1 }} padding="20px">
      <Link href={_get(props, "footer.link")} passHref legacyBehavior>
        <Button size="large" fullWidth variant="contained" aria-label="add" className="to-lowercase">
          {_get(props, "footer.title")}
        </Button>
      </Link>
    </Box>
    }
    </>
  )
}