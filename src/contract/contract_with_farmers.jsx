import React, { useEffect, useState } from 'react'
import { Grid, Toolbar, Paper, Box, Typography, TextField, Button, Autocomplete } from '@mui/material'
import { useForm, Controller } from 'react-hook-form';
import Cookies from 'js-cookie';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Contract_with_farmers() {
    const accessToken = Cookies.get("accessToken")
    const companyType = Cookies.get("companyName")

    // const router = useRouter()
    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors }, control, setValue } = useForm()
    const [allWarehouse, setAllWarehouse] = useState([])
    const [allFarmer, setAllFarmer] = useState([])
    const [loader, setLoader] = useState(false)
    const [warehouseId, setWarehouseId] = useState("")
    const [farmerId, setFarmerId] = useState("")
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            // router.push('/')
            navigate('/')
        }
    }, [navigate])



    // ******* get all user start *******

    const getFarmer = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-farmer-list/?company_type=${companyType}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("get farmer res----", res.data.response)
                setAllFarmer(res.data.response)
            })
            .catch((error) => {
                console.log("error", error)
            })
    }

    useEffect(() => {
        getFarmer()
    }, [accessToken])
    // ******* get all user end *******

    // ******* get all warehouse start ******
    const getAllWarehouse = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-owner-warehouse-list-for-farmer/?company_type=${companyType}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("get warehouse res----", res.data.response)
                setAllWarehouse(res.data.response)

            })
            .catch((error) => {
                console.log("error", error)
            })
    }

    useEffect(() => {
        getAllWarehouse()
    }, [accessToken])
    // ******* get all warehouse end *******



    // ******* add contract start *******
    const onSubmit = (data) => {
        setLoader(true)

        let formData = new FormData()
        if (warehouseId) {
            formData.append("warehouse", warehouseId.uid)
        }
        if (farmerId) {
            formData.append("user", farmerId.user_uid)
        }

        axios.post(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/create-contract-with-farmer/`, formData,
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
                    toast.success('Contract successful created with farmer', {
                        position: "top-center",
                        autoClose: 2500,
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
                        document.getElementsByClassName('required_farmer_field')[0].getElementsByTagName("button")[0].click()
                        document.getElementsByClassName('required_warehouse_field')[0].getElementsByTagName("button")[0].click()
                    }, 2500)
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
                        <h1>Add Contract With Farmer</h1>
                        <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                    </Box>
                    <Paper variant="outlined" sx={{
                        padding: '1.5em 1em',
                        width: '100%',
                        marginTop: "2em"
                    }}>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            <Typography variant="body1" sx={{ fontSize: "23px", marginLeft:"15px" }} gutterBottom>Contract Detail</Typography>

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
                                                                        className="required_warehouse_field"
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
                                                    name="farmer"
                                                    control={control}
                                                    rules={{
                                                        required: "Required"
                                                    }}
                                                    render={({ field, fieldState }) => {
                                                        return (
                                                            <Autocomplete
                                                                {...field}
                                                                options={allFarmer}
                                                                getOptionLabel={(e) => e.username || ""}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="Select Farmer"
                                                                        variant="outlined"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
                                                                        className="required_farmer_field"
                                                                    />
                                                                )}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data)
                                                                    setFarmerId(data)
                                                                }}
                                                            />
                                                        );

                                                    }}
                                                />
                                            </div>
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









