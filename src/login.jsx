import React, { useState, useRef, useEffect } from 'react'
import { Grid, Toolbar, Paper, Box, TextField, Typography, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, AppBar, Container } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles'
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

export default function Login() {
  const navigate = useNavigate()
  useEffect(() => {
    const userAccessToken = Cookies.get("accessToken")
    if (userAccessToken) {
      navigate('/dashboard')
    } else {
      navigate('/')
    }
  }, [navigate])
  // ================================================================ API Login =============================================

  const [values, setValues] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  // const handleChange = (prop) => (event) => {
  //   setValues({ ...values, [prop]: event.target.value });
  //   setPasswordReq(false)
  // };



  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // ============================================ Login Validation =============================================
  const [EmailState, setEmailState] = useState(false)
  const [PasswordState, setPasswordState] = useState(false)
  const EmailVal = useRef(null)
  const PasswordVal = useRef(null)


  const email = (e) => {
    let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
    let validEmail = pattern.test(e.target.value)

    setEmailState(!validEmail)
    setEmailReq(false)
    setInvalidEmail(false)
  }

  const onPasswordChange = (e) => {
    let pattern = /\S\S+/g
    let ExtraSpaces = pattern.test(e.target.value)
    setPasswordState(!ExtraSpaces)
    setPasswordReq(false)
    setInvalidEmail(false)
  }

  // ============================ For Empty Fields Error ======================================
  const [EmailReq, setEmailReq] = useState(false)
  const [PasswordReq, setPasswordReq] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)

  const loginSubmit = () => {
    let p = PasswordVal.current.value;
    let e = EmailVal.current.value
    if (e === '') {
      setEmailReq(true)
    }
    if (p === '') {
      setPasswordReq(true)
    }


    if (EmailState || PasswordState || e === '' || p === '') return

    ////////API Goes Here
    // console.log({ EmailState, PasswordState });
    // console.log("check user data after===>", { p, e });
    let data = new FormData();
    data.append('email', e);
    data.append('password', p);

    // console.log("user data", {e,p});

    const userData = {
      method: 'post',
      url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/login/`,
      data: data,
    }

    axios(userData).then(res => {
      console.log("login res", res)
      if (res.data.status === 200) {
        // Router.push('/companyCategory')
        navigate('/companyCategory')
        Cookies.set("accessToken", res.data.access, { expires: 1, path: '/' })
      }
      if (res.data.status === 401) {
        setInvalidEmail(true)
      }
    }).catch(err => {
      console.log("login err", err)
    })
  }


  // ============================ For Empty Fields Error ======================================

   //*********** form submit on enter key********** */
  useEffect(() => {
    const keyDownHandler = event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        loginSubmit();
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);


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
                  // width: 128,
                  // height: 128,
                },
              }}
            >
              <Paper elevation={3} sx={{
                padding: '2em',
                width: '25rem'
              }}>
                <Box
                  component="form"
                  sx={{
                    '& > :not(style)': { m: 1, width: '100%' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Welcome to Omkar Development! 👋🏻
                  </Typography>
                  <TextField id="outlined-basic" inputRef={EmailVal} label="Email" type={'email'} variant="outlined" error={EmailState} onChange={email} />
                  {EmailReq ?
                    <Typography variant="caption" display="block" gutterBottom color={'red'}>
                      This field is required
                    </Typography> : ''
                  }

                  <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" error={PasswordState}>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      inputRef={PasswordVal}
                      id="outlined-adornment-password"
                      type={values.showPassword ? 'text' : 'password'}

                      onChange={onPasswordChange}
                      autoComplete="off"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"

                    />
                  </FormControl>
                  {PasswordReq ?
                    <Typography variant="caption" display="block" gutterBottom color={'red'}>
                      This field is required
                    </Typography> : ''
                  }

                  {invalidEmail ?
                    <Typography variant="caption" display="block" gutterBottom color={'red'}>
                      Invalid email address/password
                    </Typography> : ''
                  }
                  <Button variant='contained' size='large' onClick={loginSubmit}>Login</Button>
                </Box>
              </Paper>
            </Box>
          </Grid>
          {/* <Grid item lg={6}>
          <OwnerLogin />
        </Grid> */}

        </Grid>
      </ThemeProvider>
    </>
  )
}








