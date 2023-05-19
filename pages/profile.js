import * as React from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import { createBrowserSupabaseClient, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Button, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useUser } from '@supabase/auth-helpers-react'
import Notification from '../components/reusable-components/alert';
import { LoadingButton } from '@mui/lab';


export async function getServerSideProps({ req, res }) {
    // Fetch data from external API
    const supabase = createServerSupabaseClient({ req, res });

    let { data: stores } = await supabase
        .from('stores')
        .select('store_id')
        .eq('status', true)

    let { data: profile } = await supabase
        .from('profile')
        .select('id, first_name, last_name, store_id')
        .single()
    return { props: { stores: stores, profile: profile } };
}

export default function Profile(props) {
    const router = useRouter()
    const supabase = createBrowserSupabaseClient();
    const user = useUser();
    const [storeId, setStoreId] = React.useState(props.profile?.store_id)
    const [inputStoreId, setInputStoreId] = React.useState(props.profile?.store_id)
    const [firstName, setFirstName] = React.useState(props.profile?.first_name)
    const [lastName, setLastName] = React.useState(props.profile?.last_name)
    const [loading, setLoading] = React.useState(false);
    const options = props.stores.map((store) => store.store_id.toString());

    const [toastStatus, setToastStatus] = React.useState(false);

    const [toastMessage, setToastMessage] = React.useState("");
    
    const [toastType, setToastType] = React.useState("warning");

    //Closing Message Prompt
    const handleCloseToast = () => {
        setToastStatus(false);
    }
    const [state, setState] = React.useState({
        vertical        : 'top',
        horizontal      : 'center'
    });


    //Notification Event
    const notifyEvent = (propmtStatus, messageType, message) => {
        setToastStatus(propmtStatus);
        setToastType(messageType);
        setToastMessage(message);
    }

    const userProfileUpdate = async () => {
        try {
            if (firstName === '' || lastName == '' || inputStoreId == '') {
                console.log("I am here")
                notifyEvent(true, 'warning', 'Please fill the required fields');
                setLoading(false);
                return false;
            }
            const updates = {
                id: user.id,
                first_name: firstName,
                last_name: lastName,
                store_id: inputStoreId,
            };
            setLoading(true)
            let { error } = await supabase.from('profile').upsert(updates);
            if (error) {
                notifyEvent(true, 'error', 'Something went wrong. Please try again.');
                throw error;
            }
            notifyEvent(true, 'success', 'User Profile updated successfully.');
            setLoading(false)
        } catch (error) {
            alert(error.message);
            setLoading(false)
        }
    }

    return (
        <Layout title="User Profile">
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
            <main>
                <Stack sx={{ width: "100%" }} spacing={2}>
                    <div className="input-search">
                        <div className="input-autocomplete">
                            <div className="input-text">
                                <TextField value={firstName}
                                    required
                                    fullWidth
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                    }}
                                    label="First Name" />
                            </div>
                            <div className="input-text">
                                <TextField value={lastName}
                                    required
                                    fullWidth
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                    }}
                                    label="Last Name" />
                            </div>
                            <div className="input-text">
                                <Autocomplete
                                    required
                                    value={storeId.toString()}
                                    onChange={(event, newValue) => {
                                        setStoreId(newValue.toString());
                                    }}
                                    inputValue={inputStoreId.toString()}
                                    onInputChange={(event, newInputStoreId) => {
                                        setInputStoreId(newInputStoreId.toString());
                                    }}
                                    id="store-field"
                                    autoComplete
                                    options={options}
                                    renderInput={(params) => <TextField {...params} label="Store" />}
                                />
                            </div>
                            <LoadingButton
                                variant="contained"
                                size="large"
                                onClick={userProfileUpdate}
                                loading={loading}
                            >Save</LoadingButton>
                        </div>
                    </div>
                </Stack>
            </main>
        </Layout>
    )
}