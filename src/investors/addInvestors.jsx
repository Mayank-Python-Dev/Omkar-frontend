import React, { useEffect, useState } from 'react'
import { Grid, Toolbar, Paper, Box, Typography, TextField, Button } from '@mui/material'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AddInvestors() {
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
        formData.append("email", data.email)
        formData.append("phone", data.phone)
        formData.append("address", data.investoraddress)
        formData.append("city", data.investorcity)
        formData.append("zip_code", data.investorzipcode)
        formData.append("birth_date", data.birthDate)

        axios.post(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/investor-register/`, formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                // console.log("add investor res", res)
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
                        navigate("/investors/investors_list")
                    }, 3500)
                }
            })
            .catch((err) => {
                setLoader(false)
                // console.log("add investor err", err.response.data.response)
                if (err.response.data.response.email) {
                    setEmailErr("user with this email already exists")
                } else {
                    setEmailErr("")
                }
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
                        <h1>Add Investors</h1>
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
                                            <TextField id="outlined-basic" placeholder="First Name" variant="outlined" sx={{ width: "100%" }}
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
                                            <TextField id="outlined-basic" placeholder="Last Name" variant="outlined" sx={{ width: "100%" }}
                                                {...register("lastname",
                                                    {
                                                        required: "Required field",
                                                        pattern: {
                                                            value: /^$|^\S+.*/,
                                                            message: "Space not allowed"
                                                        }
                                                    })}
                                                error={!!errors?.lastname}
                                                helperText={errors?.lastname ? errors.lastname.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Email</h4>
                                            <TextField id="outlined-basic" placeholder="Email" variant="outlined" sx={{ width: "100%" }}
                                                {...register("email", {
                                                    required: "Required field",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address",
                                                    }
                                                })}
                                                error={!!errors?.email}
                                                helperText={errors?.email ? errors.email.message : null}
                                            />
                                            <p style={{ color: "red", paddingBottom: "4px", fontSize: "0.90rem", fontWeight: "400" }}>{emailErr}</p>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Phone Number</h4>
                                            <TextField id="outlined-basic" placeholder="Phone Number" variant="outlined" type="number" sx={{ width: "100%" }}
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
                                            <TextField id="outlined-basic" placeholder="Address" variant="outlined" sx={{ width: "100%" }}
                                                {...register("investoraddress",
                                                    {
                                                        required: "Required field",
                                                        pattern: {
                                                            value: /^$|^\S+.*/,
                                                            message: "Space not allowed"
                                                        }
                                                    })}
                                                error={!!errors?.investoraddress}
                                                helperText={errors?.investoraddress ? errors.investoraddress.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>City</h4>
                                            <TextField id="outlined-basic" placeholder="City" variant="outlined" sx={{ width: "100%" }}
                                                {...register("investorcity",
                                                    {
                                                        required: "Required field",
                                                        pattern: {
                                                            value: /^$|^\S+.*/,
                                                            message: "Space not allowed"
                                                        }
                                                    })}
                                                error={!!errors?.investorcity}
                                                helperText={errors?.investorcity ? errors.investorcity.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Zip Code</h4>
                                            <TextField id="outlined-basic" placeholder="Zip Code" variant="outlined" sx={{ width: "100%" }}
                                                {...register("investorzipcode",
                                                    {
                                                        required: "Required field",
                                                        pattern: {
                                                            value: /^$|^\S+.*/,
                                                            message: "Space not allowed"
                                                        }
                                                    })}
                                                error={!!errors?.investorzipcode}
                                                helperText={errors?.investorzipcode ? errors.investorzipcode.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Birth Date</h4>
                                            <TextField id="outlined-basic" placeholder="" variant="outlined" type="date" sx={{ width: "100%" }}
                                                {...register("birthDate", { required: "Required field" })}
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


