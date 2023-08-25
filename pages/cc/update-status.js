import * as React from 'react';
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import Table from "../../components/reusable-components/table";
import { Paper } from "@mui/material";
import styles from '../../styles/admin/Layout.module.css';
import { supabaseConnection } from '../../utils/supabase';
import { useRouter } from 'next/router';
import Loading from '../../components/reusable-components/loader';
import Notification from '../../components/reusable-components/alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import commonStyles from '../../styles/Common.module.css';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import {Typography, Box} from "@mui/material";
import { CSVLink, CSVDownload } from "react-csv";
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

//Fetch Fixture Library
export async function getServerSideProps(res,) {
    // Fetch data from external API
    const supabase = supabaseConnection();
    let { data, error } = await supabase
        .from('products')
        .select('*');


    return { props: { data: data} };
}



function LinearProgressWithLabel(props) {
    debugger;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" sx={{color:'#1cae9f', height:'5px'}} {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
  
  LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };

  export default function UpdateStatus(props) {
    const [showModal, setShowModal] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();
    const [toastStatus, setToastStatus] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState("");
    const [toastType, setToastType] = React.useState("warning");
    const [inProgress, setInProgress] = React.useState(false);
    const [progress, setProgress] = React.useState(10);
    const [state, setState] = React.useState({
        vertical: 'top',
        horizontal: 'center'
    });

    const { vertical, horizontal } = state;

    const [csvRecords, setCsvRecords] = React.useState([]);

    //Close Modal
    const handleClose = (e) => {
        setShowModal(false);
        setIsLoading(false);
        refreshData();
    }

    //Open Model
    const handleClickOpen = (e) => {
        setShowModal(true);
    };

    //Refresh Fixture Table
    const refreshData = () => {
        router.replace(router.asPath);
    }

    const closeLoader = () => {
        setIsLoading(false);
    }

    //Table Columns
    const columns = [
        {
            field: 'ean',
            headerName: 'EAN ID',
            editable: true,
            width:"140"
        },
        {
            field: 'sku',
            headerName: 'SKU',
            editable: true,
            width:"140"
        },
        {
            field: 'shoot_date',
            headerName: 'Shoot Date',
            editable: true,
            width:"140"
        },
        {
            field: 'photographer',
            headerName: 'Photographer',
            editable: true,
            width:"140"
        },
        {
            field: 'stylist',
            headerName: 'Stylist',
            editable: true,
            width:"140"
        },
        {
            field: 'offline_cc',
            headerName: 'Offline CC',
            editable: true,
            width:"140"
        },
        {
            field: 'status',
            headerName: 'Status',
            editable: true,
            width:"140"
        },
        {
            field: 'comments',
            headerName: 'Comments',
            editable: true,
            width:"140"
        },
    ];

    //Closing Message Prompt
    const handleCloseToast = () => {
        setToastStatus(false);
    }

    //Notification Event
    const notifyEvent = (propmtStatus, messageType, message) => {
        setToastStatus(propmtStatus);
        setToastType(messageType);
        setToastMessage(message)
        setIsLoading(false);
    }

    const [open, setOpen] = React.useState(false);

    async function submitCsv() {
        if(csvRecords.length > 0) {
            const supabase = supabaseConnection();
            setInProgress(true);
            var pending = 0;
            var hold = 0;
            var shot = 0;
            var rejected = 0;
            var reshoot = 0;
            var drop = 0;
            for (let i = 0; i < csvRecords.length; i++) {

                const percentage =  (i/csvRecords.length)*100;
                setProgress(percentage);
                
                const { data, error } = await supabase.from('products')
                                                        .update(csvRecords[i])
                                                        .eq('ean', csvRecords[i].ean)

                if(csvRecords[i].status == 'shot') {
                    shot = shot + 1;
                }

                if(csvRecords[i].status == 'onhold') {
                    hold = hold + 1;
                }

                if(csvRecords[i].status == 'rejected') {
                    rejected = rejected + 1;
                }

                if(csvRecords[i].status == 'reshoot') {
                    reshoot = rejected + 1;
                }

                if(csvRecords[i].status == 'drop') {
                    drop = drop + 1;
                }
                
            }
            setInProgress(false);
            setShowModal(false);
            notifyEvent(true, "success", "Total Products = "+csvRecords.length+", shot = "+shot+", hold = "+hold+", rejected = "+rejected);
        }
        //setShowModal(false);
    };


    const csvData = [
        ["concept", "ean", "sku", "shoot_date", "photographer", "stylist", "status", "offline_cc", "comments"],
        ["max", "1111111111", "222222222222", "2023-05-25", "Venkat", "Mohan", "shot", "Offline", ""],
        ["homecentre", "1111111112", "222222222223", "2023-05-25", "Venkat", "Mohan", "hold", "Offline", ""],
    ];

    function handleFile(e) {
        if(e.target.files[0].type != 'text/csv') {
            notifyEvent(true, "warning", 'Please upload a valid CSV');
            return false;
        }

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const contents = e.target.result;
            parseCSV(contents);
        };

        reader.readAsText(file);
    }

    function parseCSV(csv) {
        const rows = csv.split('\n');
        const headers = rows[0].split(',');
        const result = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            if (row.length !== headers.length) {
                // Skip rows with inconsistent column count
                continue;
            }

            const obj = {};
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = row[j];
            }
            result.push(obj);
        }
        setCsvRecords(result);
    }

    //Refresh Data
    UpdateStatus.refreshData = refreshData;
    UpdateStatus.closeLoader = closeLoader;
    UpdateStatus.notifyEvent = notifyEvent;

    return (
        <div>
            {/* Loading Component */}
            {
                isLoading == true ? <Loading /> : ''
            }

            {/* Notification Component */}
            {
                toastStatus == true ?
                    <Notification
                        state={state}
                        toastType={toastType}
                        toastMessage={toastMessage}
                        onClose={handleCloseToast}
                    ></Notification> : ''
            }
            <Grid container spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ marginTop: '11px', 'marginLeft': '-22px;' }}
            >
                <Grid item lg={3} md={3} sm={12} xs={12} className={commonStyles.conceptStyle}>
                   <h1 className={commonStyles.conceptStyle}>
                        Studio
                   </h1>
                </Grid>
                <Grid item lg={3} md={3} textAlign="center"></Grid>
                <Grid item lg={3} md={3} textAlign="center"></Grid>
                <Grid item lg={3} md={3} sm={12} xs={12} textAlign="center">
                    <Button variant="contained" size="medium" onClick={handleClickOpen}>
                        Update Shoot Information
                    </Button>
                </Grid>
            </Grid>
            <div mt={10}></div>
            <Paper className={styles.tablePadding}>
                <Table columns={columns} {...props}></Table>
            </Paper>
            <div>
                <Dialog
                    fullWidth="true"
                    open={showModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>
                        <h3 className={commonStyles.margin}><b>{"Upload CSV To Update Shoot Information"}</b></h3>
                        <p className={commonStyles.sampleCsvLine}>For The Sheet Sample Template <a className={commonStyles.selectFromComputer}><CSVLink data={csvData}>Click Here</CSVLink></a></p>
                    </DialogTitle>
                    <DialogContent>
                        {
                            inProgress == false ?

                                <div justifyContent="center" className={commonStyles.updateDropFilesBox}>
                                    <Grid container spacing={{ xs: 2, md: 6 }} justifyContent="center" style={{ textAlign: "center" }}>
                                        <div>
                                            <p>Drag Your File Here</p>
                                            <Button variant="contained" component="label">
                                                <input hidden
                                                    accept="csv"
                                                    type="file"
                                                    label="File Upload"
                                                    id="outlined-size-small"
                                                    name="inwardFile"
                                                    onChange={(e) =>
                                                        handleFile(e)
                                                    }
                                                    size="small"
                                                    margin="dense"
                                                />
                                                Select From You Computer</Button>
                                        </div>
                                    </Grid>
                                </div> :
                                <Grid container spacing={2}
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{ marginTop: '11px', 'marginLeft': '-22px;' }}
                                >
                                    <Grid item lg={8} md={8} sm={12} xs={12} textAlign="center">
                                        <p><b>Uploading In Progress</b></p>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgressWithLabel value={progress} />
                                        </Box>
                                    </Grid>
                                </Grid>
                        }
                    </DialogContent>
                    <DialogActions sx={{ margin: "18px" }}>
                        <Button variant="contained" size="medium" onClick={submitCsv}>
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}