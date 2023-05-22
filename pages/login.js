import React, { useEffect } from "react";
import cx from 'classnames';
import { Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import styles from '../styles/Login.module.css';
import Notification from '../components/reusable-components/alert';
import { useUser } from '@supabase/auth-helpers-react'

export default Login;

function Login(props) {
    
    const supabase = createBrowserSupabaseClient();

    const getUser = async () => {
        const {data:profile, error} = await supabase
            .from('profile')
            .select('id, first_name, last_name, store_id')
            .single()
        props.setUserDetails(profile)
    };

    const router = useRouter();
    
    const user = useUser()
    useEffect(() => {
        if (user && loading === false)
            getUser()
    }, [user]);

    const [loading, setLoading] = React.useState(false);

    if (user && loading === false) {
        router.replace('/')
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
            console.log(data)
            router.push("/");
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
                    background: url("/smt_bg.jpg");
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
                    <h2 style={{textAlign:"center"}}>SMT LOGIN</h2>
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