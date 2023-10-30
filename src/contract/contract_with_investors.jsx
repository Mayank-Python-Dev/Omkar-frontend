import React, { useEffect, useState } from 'react'
import { Grid, Toolbar, Paper, Box, Typography, TextField, Button, MenuItem, Autocomplete } from '@mui/material'
import { useForm, Controller } from 'react-hook-form';
import Cookies from 'js-cookie';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-select-search/style.css'
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Contract_with_investors() {
    const accessToken = Cookies.get("accessToken")
    const companyType = Cookies.get("companyName")

    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors }, watch, control } = useForm()
    const [allGala, setAllGala] = useState([])
    const [allInvestors, setAllInvestors] = useState([])
    const [allWarehouse, setAllWarehouse] = useState("")
    const [loader, setLoader] = useState(false)
    const [warehouseId, setWarehouseId] = useState("")
    const [galaId, setGalaId] = useState("")
    const [investorId, setInvestorId] = useState("")
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])


    // ******* get all user type start *******

    const getUserType = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-owner-warehouse-list/?company_type=${companyType}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("get user type res----", res.data.response)
                setAllWarehouse(res.data.response)
            })
            .catch((error) => {
                console.log("error", error)
            })
    }

    useEffect(() => {
        getUserType()
    }, [accessToken])
    // ******* get all user type end *******

    // ******* get all investor start *******

    const getInvestors = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-investor-list/?company_type=${companyType}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("get user type res----", res.data.response)
                setAllInvestors(res.data.response)
            })
            .catch((error) => {
                console.log("error", error)
            })
    }

    useEffect(() => {
        getInvestors()
    }, [accessToken])
    // ******* get all investor end *******



    // ******* get all gala name start ******
    const getAllGala = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-owner-warehouse-galas/${warehouseId.uid}?company_type=${companyType}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("get gala res----", res.data.response)
                setAllGala(res.data.response)

            })
            .catch((error) => {
                console.log("error", error)
            })
    }

    useEffect(() => {
        if (warehouseId) {
            getAllGala()
        }
    }, [accessToken, warehouseId])
    // ******* get all gala name end *******



    // ******* add contract start *******
    const onSubmit = (data) => {
        setLoader(true)

        let formData = new FormData()
        if (galaId) {
            formData.append("gala", galaId.uid)
        }
        if (investorId) {
            formData.append("user", investorId.user_uid)
        }

        axios.post(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/investor-contract-post-api/`, formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
            .then((res) => {
                console.log("add contract res----", res.data)
                if (res) {
                    setLoader(false)
                    toast.success('Contract successful created with investor', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    reset()
                    navigate(`/investors/investors_property/${warehouseId.uid}`)
                }
            })
            .catch((error) => {
                console.log("error", error)
                setLoader(false)
            })
    }
    // ******* add contract end *******
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
                        <h1>Add Contract With Investor</h1>
                        <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                    </Box>
                    <Paper variant="outlined" sx={{
                        padding: '1.5em 1em',
                        width: '100%',
                        marginTop: "2em"
                    }}>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Typography variant="body1" sx={{ fontSize: "23px", marginLeft: "15px" }} gutterBottom>Contract Detail</Typography>

                            <Box noValidate autoComplete="off">
                                <Grid container>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <div className='formGroup'>
                                                <Controller
                                                    name="warehouse"
                                                    control={control}
                                                    rules={{
                                                        required: "Required"
                                                    }}
                                                    render={({ field, fieldState }) => {
                                                        return (
                                                            <Autocomplete
                                                                {...field}
                                                                options={allWarehouse}
                                                                getOptionLabel={(e) => e.property_name || ""}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="Select Warehouse"
                                                                        variant="outlined"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
                                                                    />
                                                                )}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data)
                                                                    setWarehouseId(data)
                                                                }}
                                                            />
                                                        );

                                                    }}
                                                />
                                            </div>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <div className='formGroup'>
                                                <Controller
                                                    name="gala"
                                                    control={control}
                                                    rules={{
                                                        required: "Required"
                                                    }}
                                                    render={({ field, fieldState }) => {
                                                        return (
                                                            <Autocomplete
                                                                {...field}
                                                                options={allGala}
                                                                getOptionLabel={(e) => e.gala_number || ""}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="Select Gala"
                                                                        variant="outlined"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
                                                                    />
                                                                )}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data)
                                                                    setGalaId(data)
                                                                }}
                                                            />
                                                        );

                                                    }}
                                                />
                                            </div>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <div className='formGroup'>
                                                <Controller
                                                    name="investor"
                                                    control={control}
                                                    rules={{
                                                        required: "Required"
                                                    }}
                                                    render={({ field, fieldState }) => {
                                                        return (
                                                            <Autocomplete
                                                                {...field}
                                                                options={allInvestors}
                                                                getOptionLabel={(e) => e.username || ""}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="Select Investor"
                                                                        variant="outlined"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
                                                                    />
                                                                )}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data)
                                                                    setInvestorId(data)

                                                                }}
                                                            />
                                                        );

                                                    }}
                                                />
                                            </div>
                                            {/* <TextField id="outlined-basic" label="Select Investor" variant="outlined" select
                                        {...register("user", { required: "Required" })}
                                        error={!!errors?.user}
                                        helperText={errors?.user ? errors.user.message : null}
                                    >
                                        {allInvestors.length > 0 ? <MenuItem value="">Select Investor</MenuItem> : <MenuItem></MenuItem>}
                                        {
                                            allInvestors.length > 0 &&
                                            allInvestors.map((e, i) => {
                                                return (
                                                    <MenuItem value={e.user_uid} key={i}>{e.username}</MenuItem>
                                                )
                                            })
                                        }
                                    </TextField> */}
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
