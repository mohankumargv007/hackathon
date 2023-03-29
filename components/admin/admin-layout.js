import Sidebar from './../admin/admin-sidebar';
import Topmenu from './../admin/admin-topmenu';
import { Box } from '@mui/system';
import { Grid } from '@mui/material';
import styles from '../../styles/admin/Layout.module.css'
import Paper from '@mui/material/Paper';
import Table from '../reusable-components/table';

export default function Layout({ children }) {
    return (
        <>
            <Topmenu />
            <Box m={5}>
                <Grid container spacing={2}>
                    <Grid item lg={2.5} md={4} sm={6} xs={12}>
                        <Sidebar/>
                    </Grid>
                    <Grid item lg={9.5} md={8} sm={6} xs={12} pt={'0 !important'}>
                        <main className={styles.mainLayout}>{children}</main>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}