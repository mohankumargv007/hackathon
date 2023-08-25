import Sidebar from './../admin/admin-sidebar';
import { Box } from '@mui/system';
import { Grid } from '@mui/material';
import styles from '../../styles/admin/Layout.module.css';
import Paper from '@mui/material/Paper';
import Table from '../reusable-components/table';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";
import ImageListItem from '@mui/material/ImageListItem';

export default function Layout({ children }) {
    
    return (
        <>
            <Box>
                <Grid container>
                    <Grid item lg={2} md={4} sm={6} xs={12} style={{height: "100vh"}}>
                        <img
                            src={`https://auth.contentcentral.co/images/login-heart.png`}
                            srcSet={`https://auth.contentcentral.co/images/login-heart.png`}
                            loading="lazy"
                            className={styles.logo}
                        />
                        <Sidebar/>
                    </Grid>
                    <Grid item lg={10} md={8} sm={6} xs={12} pt={'0 !important'} sx={{background: "#ffe6e6", 'padding':'25px'}}>
                        <main className={styles.mainLayout}>{children}</main>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}