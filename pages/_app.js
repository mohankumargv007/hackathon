import { ThemeProvider } from "@mui/material";
import React, { useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from "../styles/theme";
import AdminLayout from '../components/admin/admin-layout';
import { useRouter } from 'next/router';
import { UserProvider } from './../contexts/userContext';
import 'keen-slider/keen-slider.min.css';
import '../styles/globals.css';
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from '@supabase/auth-helpers-react'

MyApp.getInitialProps = async (ctx) => {
	const res = await fetch('https://cdn.c1.amplience.net/c/centrepoint/smt_config_v1');
	const json = await res.json();
	return { ...json }
}

//TODO : We Need Update The Store Info Once We Do Proper Authentication
const loginDetails = {
	storeId: 60318,
	conceptCode: 6,
	conceptName: 'Max',
	user: 'Atul'
}

function MyApp({ Component, pageProps = {}, scandit_licence_key }) {
	const router = useRouter();
	const [supabaseClient] = useState(() => createBrowserSupabaseClient())

	return (
		<ThemeProvider theme={theme}>
			<SessionContextProvider supabaseClient={supabaseClient}
				initialSession={pageProps.initialSession} >
				<UserProvider value={loginDetails}>
					<CssBaseline />
					{
						router.pathname.includes('admin') ?
						<AdminLayout>
							<Component {...pageProps} />
						</AdminLayout>
						:
						<Component {...pageProps} scandit_licence_key={scandit_licence_key} />
					}
				</UserProvider>
			</SessionContextProvider>
		</ThemeProvider>
		);
	}
	
	export default MyApp
