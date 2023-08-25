import { ThemeProvider } from "@mui/material";
import React, { useState, useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from "../styles/theme";
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import 'keen-slider/keen-slider.min.css';
import '../styles/globals.css';
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import CcLayout from '../components/cc/cc-layout';

MyApp.getInitialProps = async (ctx) => {
	const res = await fetch('https://cdn.c1.amplience.net/c/centrepoint/smt_config_v1');
	const json = await res.json();
	return { ...json }
}

function MyApp({ Component, pageProps = {}, scandit_licence_key }) {
	const router = useRouter();
	const [supabaseClient] = useState(() => createBrowserSupabaseClient())
	return (
		<ThemeProvider theme={theme}>
			<SessionContextProvider supabaseClient={supabaseClient}
				initialSession={pageProps.initialSession} >
				<CssBaseline />
				{
					router.pathname.includes('cc') ?
					<CcLayout>
						<Component {...pageProps}/>
					</CcLayout>
					:
					<Component {...pageProps} scandit_licence_key={scandit_licence_key} />
				}
			</SessionContextProvider>
		</ThemeProvider>
		);
	}
	
	export default MyApp
