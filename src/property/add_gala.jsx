import React, { useEffect, useState } from 'react'
import { Grid, Toolbar, Paper, Box, Typography, TextField, Button, Autocomplete } from '@mui/material'
import { useForm, Controller } from 'react-hook-form';
import Cookies from 'js-cookie';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Add_gala() {
    const accessToken = Cookies.get("accessToken")
    const companyType = Cookies.get("companyName")

    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors }, control } = useForm()
    const [allWarehouseType, setAllWarehouseType] = useState([])
    const [warehouseId, setWarehouseId] = useState("")
    const [loader, setLoader] = useState(false)
    const [galaErr, setGalaErr] = useState(false)
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])

    // ******* get warehouse type start *******
    const getWarehouse = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-property-list/?get_company_type=${companyType}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                // console.log("get warehouse res----", res.data.response)
                setAllWarehouseType(res.data.response)
            })
            .catch((error) => {
                console.log("error", error)
            })
    }

    useEffect(() => {
        getWarehouse()
    }, [accessToken])
    // ******* get wrehouse type end *******

    // ******* add gala start *******
    const onSubmit = (data) => {

        setLoader(true)

        let formData = new FormData()
        if (warehouseId) {
            formData.append("warehouse", warehouseId.uid)
        }
        formData.append("gala_area_size", data.galaAreaSize)
        formData.append("gala_price", data.galaPrize)
        formData.append("gala_number", data.galaNumber)

        axios.post(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/add-gala-api/`, formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("add gala res----", res.data)
                if (res) {
                    setLoader(false)
                    toast.success('Gala Successful Created', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });

                    setTimeout(() => {
                        if (warehouseId) {
                            navigate(`/property/all_property/${warehouseId.uid}`)
                        }
                        reset()
                    }, 2500)
                }
            })
            .catch((error) => {
                console.log("error", error)
                if (error.response.data.response.gala_number) {
                    setGalaErr(true)
                } else {
                    setGalaErr(false)
                }
                setLoader(false)
            })
    }
    // ******* add gala end *******

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
                        <h1>Add Gala</h1>
                        <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                    </Box>
                    <Paper variant="outlined" sx={{
                        padding: '1.5em 1em',
                        width: '100%',
                        marginTop: "2em"
                    }}>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Typography variant="body1" sx={{ fontSize: "20px", marginLeft: "15px" }} gutterBottom>Gala Detail</Typography>
                            <Box
                                noValidate
                                autoComplete="off"> 
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
                                                                options={allWarehouseType}
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
                                            <TextField id="outlined-basic" label="Gala Number" variant="outlined" sx={{ width: "100%" }}
                                                {...register("galaNumber",
                                                    {
                                                        required: "Required",
                                                        pattern: {
                                                            value: /^$|^\S+.*/,
                                                            message: "Space not allowed"
                                                        }
                                                    })}
                                                error={!!errors?.galaNumber}
                                                helperText={errors?.galaNumber ? errors.galaNumber.message : null}

                                            />
                                            {galaErr ? <p style={{ color: "red", fontSize: "13px", paddingLeft: "10px" }}>Gala with this gala number already exists</p> : ""}
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <TextField id="outlined-basic" label="Gala Area Size" variant="outlined" type="number" sx={{ width: "100%" }}
                                                {...register("galaAreaSize",
                                                    {
                                                        required: "Required",
                                                        pattern: {
                                                            value: /^$|^\S+.*/,
                                                            message: "Space not allowed"
                                                        },
                                                        maxLength: {
                                                            value: 5,
                                                            message: "Ensure that there are no more than 5 digits"
                                                        },
                                                    })}
                                                error={!!errors?.galaAreaSize}
                                                helperText={errors?.galaAreaSize ? errors.galaAreaSize.message : null}
                                            />
                                            <p className='hint_icon'><WarningAmberIcon /> Area size in square fit</p>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <TextField id="outlined-basic" label="Gala Price" variant="outlined" sx={{ width: "100%" }}
                                                {...register("galaPrize",
                                                    {
                                                        required: "Required",
                                                        maxLength: {
                                                            value: 7,
                                                            message: "Ensure that there are no more than 6 digits total"
                                                        },
                                                        pattern: {
                                                            value: /^$|^\S+.*/,
                                                            message: "Space not allowed"
                                                        },
                                                        validate: (value) => {
                                                            return (
                                                                [/^\d+(\.\d+)?$/].every((pattern) =>
                                                                    pattern.test(value)
                                                                ) || "aphabets and negative values are not allowed "
                                                            );
                                                        },

                                                    })}
                                                error={!!errors?.galaPrize}
                                                helperText={errors?.galaPrize ? errors.galaPrize.message : null}
                                            />
                                            <p className='hint_icon'><WarningAmberIcon /> Price in per square fit</p>
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


// /^(\d*([.,](?=\d{2}))?\d+)+((?!\2)[.,]\d\d)?$/



