import { ThemeProvider } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from "../styles/theme";
import Layout from '../components/layout';
import '../styles/globals.css';
import AdminLayout from '../components/admin/admin-layout';
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{
				router.pathname.includes('admin') ? 
				<AdminLayout>
					<Component {...pageProps} />
				</AdminLayout> :
				<Layout>
					<Component {...pageProps} />
				</Layout> 
			}
		</ThemeProvider>
		);
	}
	
	export default MyApp
