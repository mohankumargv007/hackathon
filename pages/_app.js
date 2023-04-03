import { ThemeProvider } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import { theme } from "../styles/theme";
import Layout from '../components/layout';
import '../styles/globals.css';
import AdminLayout from '../components/admin/admin-layout';
import { useRouter } from 'next/router';
import { AppProvider } from '../contexts/appContext';

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [title, setTitle] = useState("SMT");
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{
				router.pathname.includes('admin') ?
				<AdminLayout>
					<Component {...pageProps} />
				</AdminLayout> :
				<AppProvider value={{title, setTitle}}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</AppProvider>
			}
		</ThemeProvider>
		);
	}
	
	export default MyApp
