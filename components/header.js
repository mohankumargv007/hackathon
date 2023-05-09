import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import Notification from '../components/reusable-components/alert.js';

export default function Header(props) {
    const supabase = createBrowserSupabaseClient();

    const { title } = props;
    
    const [anchorElUser, setAnchorElUser] = React.useState(false);

    const [toastStatus, setToastStatus] = React.useState(false);

    const [toastMessage, setToastMessage] = React.useState("");
    
    const [toastType, setToastType] = React.useState("warning");

    const [state, setState] = React.useState({
        vertical        : 'top',
        horizontal      : 'center'
    });

    const profileOptions = [
        {
            label: "Logout",
            action: () => signOut()
        }
    ];

    const router = useRouter();

    const handleOpenUserMenu = () => {
        setAnchorElUser(true);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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
    

    async function signOut() {
        try {
            const {data, error} = await supabase.auth.signOut();
            if(error) {
                notifyEvent(true, "warning", "Error while logging out the user!");
                return false;
            }
            router.push("/login")                
        } catch (error) {
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
            router.reload();
        }
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
            <Box sx={{ flexGrow: 1 }}>
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {title}
                        </Typography>
                        <Tooltip>
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip>
                                    <IconButton onClick={setAnchorElUser} sx={{ p: 0 }}>
                                        {/* TODO : Need to update the user name once we get user information */}
                                        <Avatar alt="User Name"/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {profileOptions.map((profileOption) => (
                                        <MenuItem key={profileOption.label} onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" onClick={profileOption.action}>{profileOption.label}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
        
    )
}