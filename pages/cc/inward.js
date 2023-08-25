import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Grid } from '@mui/material';
import { Button } from "@mui/material";
import commonStyles from '../../styles/Common.module.css';
import Notification from '../../components/reusable-components/alert';
import { forEach, result } from 'lodash';
import { CSVLink, CSVDownload } from "react-csv";
import { supabaseConnection } from '../../utils/supabase';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import {Typography} from "@mui/material";


function LinearProgressWithLabel(props) {
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

export default function Inward() {

    const [concept, setConcept] = React.useState("");

    const [origin, setOrigin] = React.useState("");

    const [toastStatus, setToastStatus] = React.useState(false);

    const [toastMessage, setToastMessage] = React.useState("");

    const [toastType, setToastType] = React.useState("warning");

    const [csvRecords, setCsvRecords] = React.useState([]);

    const [inProgress, setInProgress] = React.useState(false);

    const [progress, setProgress] = React.useState(10);


    const [state, setState] = React.useState({
        vertical: 'top',
        horizontal: 'right'
    });

    const handleChange = (event) => {
    }

    const csvData = [
        ["ean", "sku", "received_date"],
        ["1111111111", "2222222222", "2023-05-26"],
        ["1111111112", "2222222224", "2023-05-26"],
        ["1111111113", "2222222225", "2023-05-26"]
    ];

    //Import
    async function inwardImport(file) {
        if (concept == '') {
            notifyEvent(true, "warning", 'Please enter concept');
            return false;
        }

        if (origin == '') {
            notifyEvent(true, "warning", 'Please enter origin');
            return false;
        }

        if(csvRecords.length > 0) {
            const supabase = supabaseConnection();
            setInProgress(true);
            for (let i = 0; i < csvRecords.length; i++) {

                const percentage =  (i/csvRecords.length)*100;
                setProgress(percentage);
                csvRecords[i]["concept"] = concept[0];
                csvRecords[i]["origin"] = origin[0];
                csvRecords[i]["status"] = "pending";
                const { data, error } = await supabase.from('products').insert(csvRecords[i]);
            }
            setInProgress(false);
            notifyEvent(true, "success", csvRecords.length+" products has been imported successfully!");
        } else {
            notifyEvent(true, "warning", 'Please upload CSV with atleast 1 record');
            return false;
        }
    };

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
                headers[j] = headers[j].replace(/['"]+/g, '')
                row[j] = row[j].replace(/['"]+/g, '')
                obj[headers[j]] = row[j];
            }
            result.push(obj);
        }

        setCsvRecords(result);
    }


    const conceptMenu = [
        {
            'label': 'Max',
            'value': 'max'
        },
        {
            'label': 'Lifestyle',
            'value': 'lifestyle'
        },
        {
            'label': 'Homecentre',
            'value': 'homecentre'
        }
    ];

    const origins = [
        {
            'label': 'Warehouse',
            'value': 'warehouse'
        },
        {
            'label': 'Sample',
            'value': 'sample'
        },
        {
            'label': 'Supplier',
            'value': 'supplier'
        },
        {
            'label': 'Automation',
            'value': 'automation'
        }
    ];

    //Closing Message Prompt
    const handleCloseToast = () => {
        setToastStatus(false);
    }

    //Notification Event
    const notifyEvent = (propmtStatus, messageType, message) => {
        setToastStatus(propmtStatus);
        setToastType(messageType);
        setToastMessage(message);
    }

    return (
        <div>
            <div>
                {/* Notification Component */}
                {
                    toastStatus ?
                        <Notification
                            state={state}
                            toastType={toastType}
                            toastMessage={toastMessage}
                            onClose={handleCloseToast}
                        ></Notification> : ''
                }
            </div>
                <Grid container spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ marginTop: '11px', 'marginLeft': '-22px;' }}
            >
                <Grid item lg={3} md={3} sm={12} xs={12} textAlign="center">
                </Grid>
                <Grid item lg={3} md={3} textAlign="center"></Grid>
                <Grid item lg={3} md={3} textAlign="center"></Grid>
                <Grid item lg={3} md={3} sm={12} xs={12} textAlign="center">
                    <CSVLink data={csvData}>Download Sample CSV</CSVLink>
                </Grid>
            </Grid>
            <div justifyContent="center" className={commonStyles.dropFilesBox}>
                
                <section>
                    {
                            inProgress == false ?
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
                                </Grid> : 
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
                </section>
            </div>
            <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, width: "100%" }} size="small">
                        <InputLabel id="demo-simple-select-label">Concept</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={concept}
                            label="Concept"
                            onChange={event => {
                                setConcept([event.target.value]);
                            }}
                        >
                            {conceptMenu.map((concept, index) => (
                                <MenuItem value={concept.value}>{concept.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, width: "100%" }} size="small">
                        <InputLabel id="demo-simple-select-label">Origin</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={origin}
                            label="Origin"
                            onChange={event => {
                                setOrigin([event.target.value]);
                            }}
                        >
                            {origins.map((origin, index) => (
                                <MenuItem value={origin.value}>{origin.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, width: "100%" }} size="small">
                        <Button variant="contained" color="secondary" size="medium" onClick={inwardImport}>
                            Import Inward
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
        </div>
    )
}