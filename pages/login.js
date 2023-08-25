import React, { useEffect } from "react";
import cx from 'classnames';
import { Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import styles from '../styles/Login.module.css';
import Notification from '../components/reusable-components/alert';
import { useUser } from '@supabase/auth-helpers-react';
import cookieCutter from 'cookie-cutter';
import ApiKeyComponent from '../components/ApiKeyComponent'


export default Login;


function Login(props) {
    
    const supabase = createBrowserSupabaseClient();

    const router = useRouter();
    
    const user = useUser()

    const [loading, setLoading] = React.useState(false);

    if (user && loading === false) {
       router.push('/cc/inward')
    }

    const [toastStatus, setToastStatus] = React.useState(false);

    const [toastMessage, setToastMessage] = React.useState("");
    
    const [toastType, setToastType] = React.useState("warning");

    const [state, setState] = React.useState({
        vertical        : 'top',
        horizontal      : 'center'
    });

    //Initial Assignment
    const [credentials, setCredentials] = React.useState({
            'email' : '',
            'password': ''
    });

    //Changing The Inputs
    const handleInput = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;

        setCredentials((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }

    //Login Supabase API
    async function submitCredentials() {
        setLoading(true);
        if(credentials.email == '' || credentials.password == '') {
            notifyEvent(true, "warning", 'Please enter email and password');
            setLoading(false);
            return false;
        }
        try {
            const { data, error } = await supabase.auth.signInWithPassword(credentials);
            if(error) {
                notifyEvent(true, "warning", "Invalid login credentials");
                setLoading(false);
                return false;
            }
            var user_type = '';
            if(credentials.email.includes('concept')) {
                user_type = 'concept';
            } else {
                user_type = 'studio';
            }

            var user_concept = '';
            if(credentials.email.includes('max')) {
                user_concept = 'max';
            }

            if(credentials.email.includes('homecentre')) {
                user_concept = 'homecentre';
            }

            if(credentials.email.includes('homebox')) {
                user_concept = 'homebox';
            }

            if(credentials.email.includes('homebox')) {
                user_concept = 'lifestyle';
            }
            
            localStorage.setItem('user_type', user_type);
            localStorage.setItem('user_concept', user_concept);
            router.push("/cc/inward");
        } catch (error) {
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
            router.reload();
            setLoading(false);
        }
    }

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
    
    const apiKey = process.env.ENV_NAME;

    return (
        <>
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
        <div>
            <style global jsx>{`
                body {
                    background-repeat: no-repeat;
                    background: url("/login_bg_2.webp");
                    -webkit-background-size: 100%;
                    -moz-background-size: 100%;
                    -o-background-size: 100%;
                    background-size: 100%;
                }
            `}</style>
        </div>
        <main className={cx(styles["form-signin"] ,"text-center","mt-5")}>
            <div className={styles["login-card"]}>
                <form autoComplete="off">
                    <h2 style={{textAlign:"center"}}><ApiKeyComponent /></h2>
                    <Grid container spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    >
                        <TextField
                                fullWidth 
                                label='Email'
                                id="outlined-size-small"
                                name='email'
                                type='text'
                                onChange={handleInput}
                                size="small"
                                margin="dense"
                                variant="standard"
                                required
                        />
                    </Grid>
                    <div style={{marginTop:"7%"}}></div>
                    <Grid container spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    >
                        <TextField
                                fullWidth 
                                label='Password'
                                id="outlined-size-small"
                                name='password'
                                type='password'
                                onChange={handleInput}
                                size="small"
                                margin="dense"
                                variant="standard"
                                required
                        />
                    </Grid>
                    <div style={{marginTop:"15%"}}></div>
                    <Grid container spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    >
                        <LoadingButton
                            style={{width:"100%"}}
                            onClick={submitCredentials}
                            loading={loading}
                            variant="contained"
                            color="secondary"
                            >
                            <span>Sign In</span>
                            </LoadingButton>
                    </Grid>
                </form>
            </div>
        </main>
        </>
    )
}