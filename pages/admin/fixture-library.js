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
import { DataGrid, GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import { supabaseConnection } from '../../utils/supabase';
import { useRouter } from 'next/router' 


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
        headerName: 'Edit',
        type: 'actions',
        width: 70,
        renderCell: (params) => (
            <EditIcon 
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
                onClick={(e) => 
                    inactiveSelectedFixture(params)
                }
              />
          ),
    },
];


function editFixtureLibrary(params) {
    FixtureLibrary.setRowData(params.row);
    FixtureLibrary.setFormName("Update Fixture");
    FixtureLibrary.handleClickOpen();
}

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
    const [rowData, setRowData] = React.useState();
    const router = useRouter();

    const handleClose = (e) => {
        setFormName("Create Fixture");
        setShowModal(false);
    }

    const handleClickOpen = () => {
        setShowModal(true);
    };

    const refreshData = () => {
        router.replace(router.asPath);
    }

    FixtureLibrary.handleClose          = handleClose;
    FixtureLibrary.handleClickOpen      = handleClickOpen;
    FixtureLibrary.setFormName          = setFormName;
    FixtureLibrary.setRowData           = setRowData;
    FixtureLibrary.refreshData          = refreshData

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
                <React.StrictMode>
                    <Modal show="true" key="1" form_name={formName} rowData={rowData} handleClose={handleClose} storage="fixture-library-images"></Modal>
                </React.StrictMode> : ''
            }
            
        </div>
    )
}

export default FixtureLibrary;