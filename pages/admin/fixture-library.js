import React from "react";
import next from "next";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import Modal from "../../components/reusable-components/modal";
import Table from "../../components/reusable-components/table";
import { Paper } from "@mui/material";
import styles from '../../styles/admin/Layout.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { supabaseConnection } from '../../utils/supabase';


const PAGE_NAME = "Fixture Library";

const columns = [
    { 
        field: 'concept_code', 
        headerName: 'Concept Code',
        width: 150, 
        editable: true 
    },
    { 
        field: 'type', 
        headerName: 'Fixture Type', 
        width: 160, 
        editable: true 
    },
    { 
        field: 'name', 
        headerName: 'Fixture Name',
        width: 250, 
        editable: true 
    },
    { 
        field: 'key', 
        headerName: 'Fixture Key', 
        width: 100,
        editable: true
    },
    {
        field: 'component_code',
        headerName: 'Component Code',
        width: 180,
        editable: true,
    },
    {
        field: 'actions',
        headerName: 'Action',
        type: 'actions',
        getActions: () => [
            <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
            <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
        ],
    },
];

//Fetch Fixture Library
export async function getServerSideProps() {
    // Fetch data from external API
    const supabase = supabaseConnection();
    let { data, error } = await supabase
    .from('fixture_library')
    .select('*')

    return { props: { data: data } };
}

function FixtureLibrary(props) {
    const [showModal, setShowModal] = React.useState('');
    const [formName, setFormName] = React.useState('Create Fixture');

    const handleClose = (e) => {
        setShowModal(false);
    }

    const handleClickOpen = () => {
        setShowModal(true);
    };
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
                        <Button variant="contained" size="medium" onClick={handleClickOpen}>
                            Create Fixture
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <div mt={10}></div>
            <Paper className={styles.tablePadding}>
                <Table columns={columns} {...props}></Table>
            </Paper>
            {
                showModal == true ? 
                <Modal show="true" key="1" form_name={formName} handleClose={handleClose} storage="fixture-library-images"></Modal> : ''
            }
            
        </div>
    )
}

export default FixtureLibrary;