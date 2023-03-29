import React from "react";
import next from "next";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import Modal from "../../components/reusable-components/modal";
import Table from "../../components/reusable-components/table";
import { Paper } from "@mui/material";
import styles from '../../styles/admin/Layout.module.css';

const PAGE_NAME = "Capacity Management";

function CapacityManagement() {
    const handleClickOpen = (e) => {
        e.preventDefault();
        return (
            <div>
                <Modal name="Mohan"/>
            </div>
        )
    };
    return(
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
                        <Button onClick={handleClickOpen} variant="contained" size="medium">
                            Create Capacity
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <div mt={10}></div>
            <Paper className={styles.tablePadding}>
                <Table></Table>
            </Paper>
        </div>
    );
}

export default CapacityManagement