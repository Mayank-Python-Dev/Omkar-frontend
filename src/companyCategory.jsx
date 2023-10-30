import React, { useState, useEffect } from 'react'
import { Grid, Box, Toolbar, Paper, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Typography, AppBar, Container } from '@mui/material'
import axios from 'axios'
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

const CompanyCategory = () => {
  const navigate = useNavigate()
  const accessToken = Cookies.get("accessToken")

  const [companyName, setCompanyName] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(true)
  const [err, setErr] = useState(false)

  useEffect(() => {
    const userAccessToken = Cookies.get("accessToken")
    const companyName = Cookies.get("companyName")
    if (!userAccessToken) {
      navigate('/')
    }
    if (companyName) {
      navigate('/dashboard')
    }
  }, [navigate])

  const getCompanies = async () => {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-companies/`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        // console.log("get company res----", res.data.response)
        if (res) {
          setData(res.data.response)
          setLoader(false)
        }
      })
      .catch((error) => {
        console.log("error", error)
      })
  }

  useEffect(() => {
    getCompanies()
  }, [accessToken])

  const onCompanyChange = (e) => {
    setCompanyName(e.target.value)
    setErr(false)
    setCompanyId(e.target.name)
  }

  const handleSubmit = () => {
    let company = companyName
    if (company === "") {
      setErr(true)
    } else {
      Cookies.set("companyName", company, { expires: 1, path: '/' })
      Cookies.set("companyId", companyId, { expires: 1, path: '/' })
      navigate('/dashboard')
    }
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
                href="/companyCategory"
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
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Choose Company </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      // defaultValue="female"
                      name="radio-buttons-group"
                    >
                      {
                        // loader ?
                        //   <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', minHeight: "200px" }}> <CircularProgress /></Box>
                        //   :
                        data && data.map((e, i) => {
                          return (
                            <FormControlLabel value={e.name} name={e.uid} control={<Radio />} label={e.name} key={i} onChange={onCompanyChange} />
                          )
                        })
                      }

                    </RadioGroup>
                  </FormControl>
                  {err ? <Typography variant="caption" display="block" gutterBottom color={'red'}>
                  Select any one
                </Typography> : ""}
                  <Button variant='contained' size='large' onClick={handleSubmit}>Submit</Button>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  )
}

export default CompanyCategory



