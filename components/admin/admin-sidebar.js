import * as React from 'react';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCopy from '@mui/icons-material/ContentCopy';
import styles from '../../styles/admin/Layout.module.css';
import { useRouter } from 'next/router'
import { Link } from '@mui/material';

const pages = [
    { title: 'Fixture Library', path: 'admin/fixture-library' },
    { title: 'Capacity Management', path: 'admin/capacity-management' }
  ];

function Sidebar() {
    const router = useRouter();
    
    const handleClick = (e) => {
        e.preventDefault()
        router.push(href)
    }

    return (
        <Paper sx={{ maxWidth: '100%' }} className={styles.blockMainHight}>
        <MenuList>
            {pages.map((page, index) => (
                <MenuItem key={index}>
                    {
                        router.pathname.includes(page.path) ? 
                        <ListItemText className={styles.listItemActive} onClick={() => router.push('/'+page.path)}>
                            {page.title}
                        </ListItemText> :
                        <ListItemText className={styles.listItem} onClick={() => router.push('/'+page.path)}>
                            {page.title}
                        </ListItemText>
                    }
                </MenuItem>
            ))}
        </MenuList>
        </Paper>
    )
}

export default Sidebar