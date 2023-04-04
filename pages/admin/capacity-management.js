import React from "react";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import { Paper } from "@mui/material";
import styles from '../../styles/admin/Layout.module.css';

//Page Name
const PAGE_NAME = "Capacity Management";

function CapacityManagement(props) {
    return (
        <div>
            <Paper className={styles.blockMainHight}>
                <Grid container spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
                >
                    <Grid item lg={3} md={3} sm={12} xs={12} textAlign="center">
                        <h3>{PAGE_NAME}</h3>
                    </Grid>
                    <Grid item lg={3} md={3} textAlign="center"></Grid>
                    <Grid item lg={3} md={3} textAlign="center"></Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12} textAlign="center">
                        <Button variant="contained" size="medium">
                            Create Capacity
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <div mt={10}></div>
            <Paper className={styles.tablePadding}>
                <h3 alignItems="center">Welcome To Capacity Management</h3>
            </Paper>
        </div>
    )
}

export default CapacityManagement