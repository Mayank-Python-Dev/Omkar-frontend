import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import main from '../styles/main.scss';
import { Grid, Toolbar } from '@mui/material'
import DashLayout from '../components/layout/DashLayout'
import * as React from 'react';
import { useRouter } from 'next/router';
import SSRProvider from 'react-bootstrap/SSRProvider';
import Login from './login'
import CompanyCategory from './companyCategory'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Demo from './demo'
import Index from './index';

const theme = createTheme({
  palette: {
    primary: {
      light: '#1e88e5',
      main: '#1565c0',
      dark: '#0d47a1',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    }
  },
})

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SSRProvider>
      {getLayout(
        router.pathname === "/" ?
          <ThemeProvider theme={theme}>
            <Index />
          </ThemeProvider>
          :
          router.pathname === "/login" ?
          <ThemeProvider theme={theme}>
            <Login />
          </ThemeProvider>
          :

          router.pathname === "/companyCategory" ?
            <ThemeProvider theme={theme}>
              <CompanyCategory />
            </ThemeProvider>
            :
            // router.pathname.includes('/admin') ? 
            <ThemeProvider theme={theme}>
              <DashLayout>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item lg={12} xs={12}>
                    <Component {...pageProps} />
                  </Grid>
                </Grid>
              </DashLayout>
            </ThemeProvider>
            // :
            // <Demo/>
      )}
    </SSRProvider>
  )
}

export default MyApp

