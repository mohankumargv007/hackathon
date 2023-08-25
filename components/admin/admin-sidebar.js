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
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const pages = [
    { title: 'Inward Import', path: 'cc/inward', icon: <FileUploadIcon></FileUploadIcon> },
    { title: 'Update Status', path: 'cc/update-status' },
    { title: 'Stats', path: 'cc/stats' },
    { title: 'Send Email', path: 'cc/sendemail' }
  ];

function Sidebar() {
    const router = useRouter();
    
    const handleClick = (e) => {
        debugger;
        e.preventDefault()
        router.push(href)
    }

    async function signOut() {
      try {
            const {data, error} = await supabase.auth.signOut();
            if(error) {
                notifyEvent(true, "warning", "Error while logging out the user!");
                return false;
            }
            router.push("/login")          
      } catch (error) {
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
            router.reload();
      }
  }

    return (
        <Paper sx={{ maxWidth: '100%' }} className={styles.blockMainHight}>
        <MenuList>
            {pages.map((page, index) => (
                <MenuItem>
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
            <MenuItem>
                    <ListItemText className={styles.listItem} onClick={signOut}>
                            Logout
                    </ListItemText>
            </MenuItem>
        </MenuList>
        </Paper>
    )
}

export default Sidebar