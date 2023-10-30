import React, { useState, useRef, useEffect } from 'react'
import { Grid, Toolbar, Paper, Box, TextField, Typography, Button, AppBar, Container } from '@mui/material'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Logo from '../styles/logo.png'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export default function ResetPassword() {
    const { register, handleSubmit, reset, watch, getValues, formState: { errors } } = useForm()
    const path = useParams()
    const [isLinkExpire, setIsLinkExpire] = useState(false)

    const onSubmit = (data) => {
        let password = { "password": data.new_password }

        axios.post(`https://bsgroup.org.in/user/password-reset/${path.slug1}/${path.slug2}/`, password)
            .then((res) => {
                console.log("reset res", res.data)
                if (res) {
                    toast.success('Password Reset Successfully', {
                        position: "top-center",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
                setTimeout(() => {
                    reset()
                }, 2500)
            })
            .catch((err) => {
                console.log("reset err", err.response.data.response.non_field_errors)
                if(err.response.data.response.non_field_errors){
                    setIsLinkExpire(true)
                }
            })
    }


    return (
        <>
            <ThemeProvider theme={theme}>
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
                                href={`/reset_password/${path.slug1}/${path.slug2}`}
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
                                <img src={Logo} className='img-fluid' alt="omkar_logo" style={{ width: "140px", padding: "1em 0em" }} />
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
                                <img src={Logo} className='img-fluid' alt="omkar_logo" style={{ width: "150px", padding: "1em 0em" }} />
                            </Typography>
                        </Toolbar>
                    </Container>
                </AppBar>

                <Grid container justifyContent="center">

                    <Grid item lg={12} md={12} xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                minHeight: '80vh',
                                justifyContent: 'center',
                                alignItems: 'center',
                                '& > :not(style)': {
                                    m: 1,
                                },
                            }}
                        >
                            { !isLinkExpire ? 
                            <Paper elevation={3} sx={{
                                padding: '2em',
                                width: '25rem'
                            }}>
                                <Box

                                    sx={{
                                        '& > :not(style)': { m: 1, width: '100%' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                        Reset Password
                                    </Typography>

                                    <form onSubmit={handleSubmit(onSubmit)}>

                                        <Box
                                            style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}
                                            noValidate
                                            autoComplete="off">

                                            <TextField sx={{ m: 1, width: '40ch' }} id="outlined-basic" label="New Password" variant="outlined" type="password"
                                                {...register("new_password", {
                                                    required: "This field is required",
                                                    minLength: {
                                                        value: 8,
                                                        message: "Minimum required Password is 8 digit"
                                                    },
                                                    maxLength: {
                                                        value: 15,
                                                        message: "Maximum required password is 15 digit"
                                                    },
                                                    validate: (value) => {
                                                        return (
                                                            [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
                                                                pattern.test(value)
                                                            ) || "Must include lower, upper, number, and special characters"
                                                        );
                                                    },
                                                })}
                                                error={!!errors?.new_password}
                                                helperText={errors?.new_password ? errors.new_password.message : null}
                                            />

                                            <TextField sx={{ m: 1, width: '40ch' }} id="outlined-basic" label="Confirm Password" variant="outlined" type="password"
                                                {...register("confirm_password", { required: "This field is required" })}
                                                error={!!errors?.confirm_password}
                                                helperText={errors?.confirm_password ? errors.confirm_password.message : null}
                                            />
                                            {watch("confirm_password") !== watch("new_password") && getValues("confirm_password") ? (<p style={{ paddingLeft: "22px", color: "#d32f2f", fontSize: "0.80rem" }}>Password not match</p>) : null}

                                            <Button sx={{ m: 1, width: '40ch' }} type="submit" variant='contained'>Submit</Button>

                                        </Box>
                                    </form>
                                </Box>
                            </Paper>
                            :
                            <Paper elevation={3}>
                                <Box sx={{fontSize:"22px", color:"#6798e6", padding:"15px 20px"}}>Oops, this link is expired</Box>
                            </Paper>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    )
}








