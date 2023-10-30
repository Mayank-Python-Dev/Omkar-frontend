import React, { useEffect, useState } from 'react'
import { Grid, Toolbar, Paper, Box, Typography, TextField, Button } from '@mui/material'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AddFarmers() {
    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()
    const accessToken = Cookies.get("accessToken")

    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])
    const [loader, setLoader] = useState(false)
    const [emailErr, setEmailErr] = useState("")
    const [phoneErr, setPhoneErr] = useState("")

    let email = watch("email")
    let phone = watch("phone")
    useEffect(() => {
        if (email) {
            setEmailErr("")
        }
    }, [email])

    useEffect(() => {
        if (phone) {
            setPhoneErr("")
        }
    }, [phone])


    const onSubmit = (data) => {

        setLoader(true)
        var formData = new FormData()
        formData.append("first_name", data.firstname)
        formData.append("last_name", data.lastname)
        formData.append("phone", data.phone)
        formData.append("address", data.address)
        formData.append("birth_date", data.birthDate)

        axios.post(`https://bsgroup.org.in/user/farmer-register/`, formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("add farmer  res", res)
                if (res) {
                    setLoader(false)
                    toast.success('Successfully Registered', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    setTimeout(() => {
                        reset()
                        navigate("/farmers/farmers_property")
                    }, 3500)
                }
            })
            .catch((err) => {
                setLoader(false)
                console.log("add farmer  err", err.response)
                if (err.response.data.response.phone) {
                    setPhoneErr("user with this phone already exists")
                } else {
                    setPhoneErr("")
                }

            })
    }

    const gridStyles = {
        padding: 3,
    };

    return (
        <>
            {loader ? <div className="loader_wrap"><div className="loader"></div></div> : <div></div>}
            <Grid container spacing={2} sx={gridStyles}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Toolbar />
                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                        <h1>Add Farmers</h1>
                        <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                    </Box>
                    <Paper variant="outlined" sx={{
                        padding: '1.5em 1em',
                        width: '100%',
                        marginTop: "2em"
                    }}>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            <Typography variant="body1" sx={{ fontSize: "20px", marginLeft: "15px" }} gutterBottom>Personal Detail</Typography>

                            <Box noValidate autoComplete="off">
                                <Grid container>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>First Name</h4>
                                            <TextField id="outlined-basic" placeholder="First Name" variant="outlined" sx={{ width: '100%' }}
                                                {...register("firstname",
                                                    {
                                                        required: "Required field",
                                                        pattern: {
                                                            value: /^$|^\S+.*/,
                                                            message: "Space not allowed"
                                                        }
                                                    })}
                                                error={!!errors?.firstname}
                                                helperText={errors?.firstname ? errors.firstname.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Last Name</h4>
                                            <TextField id="outlined-basic" placeholder="Last Name" variant="outlined" sx={{ width: '100%' }}
                                                {...register("lastname",
                                                    {
                                                        required: "Required field",
                                                        pattern: {
                                                            value: /^$|^\S+.*/,
                                                            message: "Space not allowed"
                                                        },
                                                    })}
                                                error={!!errors?.lastname}
                                                helperText={errors?.lastname ? errors.lastname.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Phone Number</h4>
                                            <TextField id="outlined-basic" placeholder="Phone Number" variant="outlined" type="number" sx={{ width: '100%' }}
                                                {...register("phone",
                                                    {
                                                        required: "Required field",
                                                        minLength: {
                                                            value: 10,
                                                            message: "Phone number should be 10 digits"
                                                        },
                                                        maxLength: {
                                                            value: 10,
                                                            message: "Phone number should be 10 digits"
                                                        },
                                                    })}
                                                error={!!errors?.phone}
                                                helperText={errors?.phone ? errors.phone.message : null}
                                            />
                                            <p style={{ color: "red", paddingBottom: "4px", fontSize: "0.90rem", fontWeight: "400" }}>{phoneErr}</p>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Address</h4>
                                            <TextField id="outlined-basic" placeholder="Address" variant="outlined" sx={{ width: '100%' }}
                                                {...register("address",
                                                    {
                                                        required: "Required field",
                                                        pattern: {
                                                            value: /^$|^\S+.*/,
                                                            message: "Space not allowed"
                                                        }
                                                    }
                                                )}
                                                error={!!errors?.address}
                                                helperText={errors?.address ? errors.address.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Birth Date</h4>
                                            <TextField id="outlined-basic" placeholder="" variant="outlined" type="date" sx={{ width: '100%' }}
                                                {...register("birthDate",
                                                    { required: "Required field" })}
                                                error={!!errors?.birthDate}
                                                helperText={errors?.birthDate ? errors.birthDate.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={12} md={12} sm={12} xs={12} item>
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", marginRight: "20px", marginTop: "10px" }}>
                                            <Button variant="contained" type="submit" sx={{ minWidth: "150px", fontSize: "1rem", fontWeight: "600" }}>Add</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                        </form>
                    </Paper>
                </Grid>
            </Grid>
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


