import { ThemeProvider } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from "../styles/theme";
import AdminLayout from '../components/admin/admin-layout';
import { useRouter } from 'next/router';
import '../styles/globals.css';

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
				<Component {...pageProps} />
			}
		</ThemeProvider>
		);
	}
	
	export default MyApp
