import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";

export default function Notification(props) {
    const [toastStatus, setToastStatus] =  React.useState(true)

    const handleCloseToast = () => {
        setToastStatus(false);
        props.onClose(false);
    }

    const [state, setState] = React.useState({
        vertical        : 'top',
        horizontal      : 'center'
    });

    const { vertical, horizontal } = props.hasOwnProperty('state') ? props.state : state;

    return (
        <div>
            <Snackbar
                autoHideDuration={4000}
                anchorOrigin={{ vertical, horizontal }}
                open={toastStatus}
                onClose={handleCloseToast}
                key={horizontal + vertical}
            >
                <Alert onClose={handleCloseToast} severity={props.toastType} sx={{ width: '100%' }}>
                    {props.toastMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}