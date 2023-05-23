import { useSupabaseClient } from '@supabase/auth-helpers-react';
import _get from 'lodash/get';
import * as React from 'react';
import { Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Notification from './reusable-components/alert';
import { LoadingButton } from '@mui/lab';
import cookieCutter from 'cookie-cutter'

export default function UserProfile(data) {
    const user = _get(data, 'session.session.user', {})
    const supabase = useSupabaseClient();
    const [storeId, setStoreId] = React.useState(data.profile?.store_id)
    const [inputStoreId, setInputStoreId] = React.useState(data.profile?.store_id)
    const [concept, setConcept] = React.useState(data.profile?.concept)
    const [inputConcept, setInputConcept] = React.useState(data.profile?.concept)
    const [firstName, setFirstName] = React.useState(data.profile?.first_name)
    const [lastName, setLastName] = React.useState(data.profile?.last_name)
    const [loading, setLoading] = React.useState(false);
    const options = data.stores.map((store) => store.store_id.toString());
    //Concept
    const concepts = [
        'Max',
        'Homecentre',
        'Babyshop',
        'Homebox',
        'Splash',
        'Lifestyle',
        'Shotmart'
    ];

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
            if (firstName === '' || lastName === '' || storeId === '' || concept === '') {
                notifyEvent(true, 'warning', 'Please fill the required fields');
                setLoading(false);
                return false;
            }
            const updates = {
                id: user.id,
                first_name: firstName,
                last_name: lastName,
                store_id: storeId,
                concept: concept,
            };
            setLoading(true)
            let { error } = await supabase.from('profile').upsert(updates);
            if (error) {
                notifyEvent(true, 'error', 'Something went wrong. Please try again.');
                throw error;
            }
            data.setUserDetails(updates)
            cookieCutter.set('userStoreId', updates.store_id)
            cookieCutter.set('userConceptCode', updates.concept)
            notifyEvent(true, 'success', 'User Profile updated successfully.');
            setLoading(false)
        } catch (error) {
            alert(error.message);
            setLoading(false)
        }
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
                                    value={storeId ? storeId.toString() : undefined}
                                    onChange={(event, newValue) => {
                                        setStoreId(newValue.toString());
                                    }}
                                    inputValue={inputStoreId ? inputStoreId.toString() : undefined}
                                    onInputChange={(event, newInputStoreId) => {
                                        setInputStoreId(newInputStoreId.toString());
                                    }}
                                    id="store-field"
                                    autoComplete
                                    options={options}
                                    renderInput={(params) => <TextField required {...params} label="Store" />}
                                />
                            </div>
                            <div className="input-text">
                                <Autocomplete
                                    value={concept}
                                    onChange={(event, newValue) => {
                                        setConcept(newValue);
                                    }}
                                    inputValue={inputConcept}
                                    onInputChange={(event, newInputConcept) => {
                                        setInputConcept(newInputConcept);
                                    }}
                                    id="concept-field"
                                    autoComplete
                                    options={concepts}
                                    renderInput={(params) => <TextField required {...params} label="Concept" />}
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
        </>    
    )
}