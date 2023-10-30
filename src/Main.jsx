import React, { useEffect } from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import Logo from '../public/logo.png'
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Paper, Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Cookies from 'js-cookie';
import Logo from '../src/styles/logo.png'

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



export default function Main() {
    const navigate = useNavigate()
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (userAccessToken) {
            navigate('/dashboard')
        }
    }, [navigate])
    return (
        <>
            <ThemeProvider theme={theme}>
                <Box className="main_index">
                    <AppBar position="static"
                        sx={{
                            backgroundColor: "#eaeaea"
                        }}
                    >
                        <Container maxWidth="xxl"
                        >
                            <Toolbar disableGutters>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    href="/"
                                    sx={{
                                        mr: 2,
                                        display: { xs: 'none', md: 'flex' },
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <img src={Logo} className='img-fluid' alt="omkar_logo" style={{ width: "150px", padding: "1em 0em" }} />
                                </Typography>
                                <Typography
                                    variant="h5"
                                    noWrap
                                    component="a"
                                    href=""
                                    sx={{
                                        mr: 2,
                                        display: { xs: 'flex', md: 'none' },
                                        flexGrow: 1,
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <img src={Logo} className='img-fluid' alt="omkar_logo" style={{ width: "140px", padding: "1em 0em" }} />
                                </Typography>
                            </Toolbar>
                        </Container>
                    </AppBar>

                    <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    minHeight: '92.7vh',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    '& > :not(style)': {
                                        m: 1,
                                        // width: 128,
                                        // height: 128,
                                    },
                                }}
                            >
                                <Paper elevation={3} sx={{
                                    padding: '3em',
                                    width: '35rem'
                                }}

                                >
                                    <Typography variant="h4" sx={{ textAlign: "center", color: "#1565c0", fontWeight: "500" }}>Login</Typography>
                                    <p style={{ textAlign: "center", color: "rgb(79 131 191)", marginTop: "10px", letterSpacing: "1px" }}>Choose an option to log in</p>

                                    <Link to='/login'>
                                        <Button variant='contained' sx={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "10px 15px", marginTop: "2.5rem" }}>
                                            <span >Admin</span>
                                            <LoginIcon />
                                        </Button>
                                    </Link>

                                    <Link to='/login'>
                                        <Button variant='contained' sx={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "10px 15px", marginTop: "2rem" }}>
                                            <span >Investor</span>
                                            <LoginIcon />
                                        </Button>
                                    </Link>
                                </Paper>
                            </Box>
                        </Grid>

                    </Grid>

                </Box>
            </ThemeProvider>
        </>
    )
}
