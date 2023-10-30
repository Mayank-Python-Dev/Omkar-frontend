import React, { useState, useRef } from 'react'
import { Paper, Box, TextField, Typography, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

import Router from 'next/router'

export default function OwnerLogin() {

  // ================================================================ API Login =============================================

  const [values, setValues] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });


 

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
    let pattern = /[A-Za-z0-9]+@[A-Za-z0-9.-]+[A-Z|a-z]{2,}/ym
    let validEmail = pattern.test(e.target.value)
    setEmailState(!validEmail)
    setEmailReq(false)
  }

  const onPasswordChange = (e) => {
    let pattern = /\S\S+/g
    let ExtraSpaces = pattern.test(e.target.value)
    setPasswordState(!ExtraSpaces)
    setPasswordReq(false)
  }

  // ============================ For Empty Fields Error ======================================
  const [EmailReq, setEmailReq] = useState(false)
  const [PasswordReq, setPasswordReq] = useState(false)

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
    console.log("email" , e, "password", p)

//     let data = new FormData();
//     data.append('email', e);
//     data.append('password', p);
//  const userData = {
//       method: 'post',
//       url: `${process.env.NEXT_PUBLIC_BASE_URL}/login/`,
//       data: data,
//     }

//     axios(userData).then(res => {
//       console.log("login res", res)
//       if(res){
//         Router.push('/company_category')
//         sessionStorage.setItem("accessToken", res.data.access)
//       }
//     }).catch(err => {
//        console.log("login err", err)
//     })
  }


  // ============================ For Empty Fields Error ======================================

  return (
    <>
   
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              minHeight: '100vh',
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
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  Welcome to Owner ! 👋🏻
                </Typography>
                <TextField id="outlined-basic" inputRef={EmailVal} label="Email" type={'email'} variant="outlined" error={EmailState} onChange={email}  />
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
                <Button variant='contained' size='large' onClick={loginSubmit}>Login</Button>
              </Box>
            </Paper>
          </Box>
   

      
    </>
  )
}








