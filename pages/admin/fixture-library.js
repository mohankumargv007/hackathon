import React from "react";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import Modal from "../../components/reusable-components/modal";
import Table from "../../components/reusable-components/table";
import { Paper } from "@mui/material";
import styles from '../../styles/admin/Layout.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { supabaseConnection } from '../../utils/supabase';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
/* import Modal from "../admin/modal"; */


//InActive Fixture Library On Click Of Delete
async function inactiveSelectedFixture(row) {
    // Fetch data from external API
    const supabase = supabaseConnection();
    let { updateData, updateError } = await supabase
    .from('fixture_library')
    .update({ status: false })
    .eq('id', row.id)

    alert('Fixture Deleted Successfully!');

    FixtureLibrary.refreshData()
}

//Fetch Fixture Library
export async function getServerSideProps() {
    // Fetch data from external API
    const supabase = supabaseConnection();
    let { data, error } = await supabase
    .from('fixture_library')
    .select('*')
    .eq('status', true)

    return { props: { data: data } };
}

function FixtureLibrary(props) {
    const [showModal, setShowModal] = React.useState(false);
    const [formName, setFormName] = React.useState('Create Fixture');
    const [typeOfUpdate, setTypeOfUpdate] = React.useState('Create');
    const router = useRouter();
    const record = {
        concept_code            : "",
        type                    : "",
        name                    : "",
        component_name          : "",
        component_count         : "",
        key                     : "",
        component_code          : "",
        components              : "",
        cad_image               : "",
        front_image             : "",
        lateral_image           : "",
        component_length        : "",
        component_width         : "",
        component_height        : "",
        status                  : true
    };

    const [rowData, setRowData] = React.useState(record);

    const handleClose = (e) => {
        setFormName("Create Fixture");
        setShowModal(false);
        setRowData(record);
    }

    const handleClickOpen = (e) => {
        setShowModal(true);
    };

    const refreshData = () => {
        router.replace(router.asPath);
    }

    const editFixtureLibrary = (params) => {
        setRowData(params.row);
        setFormName("Update Fixture");
        setShowModal(true); 
    }

    //Page Name
    const PAGE_NAME = "Fixture Library";

    //Table Columns
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
            headerName: 'Edit',
            type: 'actions',
            width: 70,
            renderCell: (params) => (
                <EditIcon 
                    sx={{cursor:"pointer"}}
                    onClick={(e) => 
                        editFixtureLibrary(params)
                    }
                />
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            type: 'actions',
            width: 70,
            renderCell: (params) => (
                <DeleteIcon 
                    sx={{cursor:"pointer"}}
                    onClick={(e) => 
                        inactiveSelectedFixture(params)
                    }
                />
            ),
        },
    ];

    FixtureLibrary.refreshData          = refreshData;

    return (
        <div>
            {/* <CircularProgress /> */}
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
                <Modal show="true" key="1" form_name={formName} rowData={rowData} handleClose={handleClose} storage="fixture-library-images"></Modal>
                : ''
            }
        </div>
    )
}

export default FixtureLibrary;