import { ThemeProvider } from "@mui/material";
import React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from "../styles/theme";
import AdminLayout from '../components/admin/admin-layout';
import { useRouter } from 'next/router';
import { UserProvider } from './../contexts/userContext';
import 'keen-slider/keen-slider.min.css';
import '../styles/globals.css';

MyApp.getInitialProps = async (ctx) => {
	const res = await fetch('https://cdn.c1.amplience.net/c/centrepoint/smt_config_v1');
	const json = await res.json();
	return { ...json }
}

const loginDetails = {
	storeId: 60318,
	conceptCode: 6,
	conceptName: 'Max',
	user: 'Atul'
}

function MyApp({ Component, pageProps, scandit_licence_key }) {
	const router = useRouter();
	return (
		<ThemeProvider theme={theme}>
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
		</ThemeProvider>
		);
	}
	
	export default MyApp
