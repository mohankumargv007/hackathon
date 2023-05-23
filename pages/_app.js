import { ThemeProvider } from "@mui/material";
import React, { useState, useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from "../styles/theme";
import AdminLayout from '../components/admin/admin-layout';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import 'keen-slider/keen-slider.min.css';
import '../styles/globals.css';
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from '@supabase/auth-helpers-react'

MyApp.getInitialProps = async (ctx) => {
	const res = await fetch('https://cdn.c1.amplience.net/c/centrepoint/smt_config_v1');
	const json = await res.json();
	return { ...json }
}

function MyApp({ Component, pageProps = {}, scandit_licence_key }) {
	const router = useRouter();
	const [supabaseClient] = useState(() => createBrowserSupabaseClient())
	const [userDetails, setUserDetails] = useState({});

	const getUser = async () => {
		const {data:profile, error} = await supabaseClient
			.from('profile')
			.select('id, first_name, last_name, store_id', 'concept')
			.single()
		setUserDetails(profile)
	};

	useEffect(() => {
		getUser();
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<SessionContextProvider supabaseClient={supabaseClient}
				initialSession={pageProps.initialSession} >
				<CssBaseline />
				{
					router.pathname.includes('admin') ?
					<AdminLayout>
						<Component {...pageProps} userDetails={userDetails} setUserDetails={setUserDetails}/>
					</AdminLayout>
					:
					<Component {...pageProps} scandit_licence_key={scandit_licence_key} userDetails={userDetails} setUserDetails={setUserDetails} />
				}
			</SessionContextProvider>
		</ThemeProvider>
		);
	}
	
	export default MyApp
