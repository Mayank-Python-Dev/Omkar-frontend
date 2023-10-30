import React, { useEffect, useState } from 'react'
import { Grid, Toolbar, Paper, Box, Typography, TextField, Button, Autocomplete } from '@mui/material'
import { useForm, Controller } from 'react-hook-form';
import Cookies from 'js-cookie';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Add_warehouse() {
    const accessToken = Cookies.get("accessToken")
    const companyId = Cookies.get("companyId")
    const companyType = Cookies.get("companyName")

    // const router = useRouter()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm()
    const [allPropertyType, setAllPropertyType] = useState([])
    const [propertyId, setPropertyId] = useState("")
    const [loader, setLoader] = useState(false)
    const [propertySurveyErr, setPropertySurveyErr] = useState("")
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])

    // ******* get property type start *******
    const getPropertyType = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-property-type/`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("get property res----", res.data.response)
                setAllPropertyType(res.data.response)
            })
            .catch((error) => {
                console.log("error", error)
            })
    }

    useEffect(() => {
        getPropertyType()
    }, [accessToken])
    // ******* get property type end *******

    // ******* add warehouse start *******
    let property_survey_number = watch("property_survey_number")
    useEffect(() => {
        if (property_survey_number) {
            setPropertySurveyErr("")
        }
    }, [property_survey_number])


    const onSubmit = (data) => {
        setLoader(true)

        let formData = new FormData()
        formData.append("property_name", data.propertyname)
        if (propertyId) {
            formData.append("property_type", propertyId)
        }

        formData.append("property_survey_number", data.property_survey_number)
        formData.append("company", companyId)
        formData.append("address", data.address)
        formData.append("city", data.city)
        formData.append("zipcode", data.zipcode)
        formData.append("state", data.state)
        formData.append("country", data.country)


        axios.post(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/add-property-api/`, formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("add warehouse res----", res.data)
                if (res) {
                    setLoader(false)
                    toast.success('Warehouse Successful Created', {
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
                        navigate("/property/all_property")
                        reset()
                    }, 2000)
                }
            })
            .catch((error) => {
                console.log("error", error)
                setLoader(false)
                if (error.response.data.response.property_survey_number) {
                    setPropertySurveyErr("Property with this property survey number already exists")
                } else {
                    setPropertySurveyErr(" ")
                }
            })
    }
    // ******* add warehouse end *******


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
                    <h1>Add Warehouse</h1>
                    <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                    </Box>
                    <Paper variant="outlined" sx={{
                        padding: '1.5em 1em',
                        width: '100%',
                        marginTop: "2em"
                    }}>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Typography variant="body1" sx={{ fontSize: "20px", marginLeft: "15px" }} gutterBottom>Add Property Detail</Typography>
                            <Box noValidate autoComplete="off">

                                <Grid container>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <TextField id="outlined-basic" label="Property Name" variant="outlined" sx={{ width: "100%" }}
                                                {...register("propertyname",
                                                    {
                                                        required: "Required",
                                                        pattern: {
                                                            value: /^[^\s].+[^\s]/,
                                                            message: "Space not allowed"
                                                        },
                                                        minLength: {
                                                            value: 3,
                                                            message: "Property name should be minimun 3 characters or more"
                                                        },
                                                        // validate: (value) => {
                                                        //     return (
                                                        //         [/^[a-zA-Z(0-9) ]+$/].every((pattern) =>
                                                        //             pattern.test(value)
                                                        //         ) || "Property name should be contain only alphabetic value"
                                                        //     );
                                                        // },
                                                    })}
                                                error={!!errors?.propertyname}
                                                helperText={errors?.propertyname ? errors.propertyname.message : null}

                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <div className='formGroup'>
                                                <Controller
                                                    name="propertyType"
                                                    control={control}
                                                    rules={{
                                                        required: "Required"
                                                    }}
                                                    render={({ field, fieldState }) => {
                                                        return (
                                                            <Autocomplete
                                                                {...field}
                                                                options={allPropertyType}
                                                                getOptionLabel={(e) => e || ""}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="Select Warehouse Type"
                                                                        variant="outlined"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
                                                                    />
                                                                )}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data)
                                                                    setPropertyId(data)
                                                                    console.log(data)
                                                                }}
                                                            />
                                                        );

                                                    }}
                                                />
                                            </div>
                                            {/* <TextField id="outlined-basic" label="Select Property Type" variant="outlined" select
                                        {...register("propertyType", { required: "Required" })}
                                        error={!!errors?.propertyType}
                                        helperText={errors?.propertyType ? errors.propertyType.message : null}
                                    >
                                        {allPropertyType.length > 0 ? <MenuItem value="">Select Property Type</MenuItem> : <MenuItem></MenuItem>}
                                        {
                                            allPropertyType.length > 0 ?
                                                allPropertyType.map((e, i) => {
                                                    return (
                                                        <MenuItem value={e} key={i}>{e}</MenuItem>
                                                    )
                                                })
                                                :
                                                <MenuItem></MenuItem>
                                        }
                                    </TextField> */}
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <TextField id="outlined-basic" label="Property Survey Number" variant="outlined" sx={{ width: "100%" }}
                                                {...register("property_survey_number",
                                                    {
                                                        required: "Required",
                                                        pattern: {
                                                            value: /^$|^\S+.*/,
                                                            message: "Space not allowed"
                                                        }
                                                    })}
                                                error={!!errors?.property_survey_number}
                                                helperText={errors?.property_survey_number ? errors.property_survey_number.message : null}
                                            />
                                            <p style={{ paddingLeft: "22px", color: "#d32f2f", fontSize: "0.80rem" }}>{propertySurveyErr}</p>
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <TextField id="outlined-read-only-input" defaultValue={`${companyType} - ${companyId}`} variant="outlined" disabled sx={{ width: "100%" }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <TextField id="outlined-basic" label="Address" variant="outlined" sx={{ width: "100%" }}
                                                {...register("address",
                                                    {
                                                        required: "Required",
                                                        pattern: {
                                                            value: /^[^\s].+[^\s]/,
                                                            message: "Space not allowed"
                                                        },
                                                        minLength: {
                                                            value: 3,
                                                            message: "Address should be minimun 3 characters or more"
                                                        },
                                                    })}
                                                error={!!errors?.address}
                                                helperText={errors?.address ? errors.address.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <TextField id="outlined-basic" label="City" variant="outlined" sx={{ width: "100%" }}
                                                {...register("city",
                                                    {
                                                        required: "Required",
                                                        pattern: {
                                                            value: /^[^\s].+[^\s]/,
                                                            message: "Space not allowed"
                                                        },
                                                        minLength: {
                                                            value: 3,
                                                            message: "City should be minimun 3 characters or more"
                                                        },
                                                        validate: (value) => {
                                                            return (
                                                                [/^[a-zA-Z() ]+$/].every((pattern) =>
                                                                    pattern.test(value)
                                                                ) || "City name should be contain only alphabetic value"
                                                            );
                                                        },
                                                    })}
                                                error={!!errors?.city}
                                                helperText={errors?.city ? errors.city.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <TextField id="outlined-basic" label="Zip Code" variant="outlined" type="number" sx={{ width: "100%" }}
                                                {...register("zipcode",
                                                    {
                                                        required: "Required",
                                                        pattern: {
                                                            value: /^[^\s].+[^\s]/,
                                                            message: "Space not allowed"
                                                        },
                                                        minLength: {
                                                            value: 6,
                                                            message: "Zip code should be minimun 6 digits"
                                                        },
                                                    })}
                                                error={!!errors?.zipcode}
                                                helperText={errors?.zipcode ? errors.zipcode.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <TextField id="outlined-basic" label="State" variant="outlined" sx={{ width: "100%" }}
                                                {...register("state",
                                                    {
                                                        required: "Required",
                                                        pattern: {
                                                            value: /^[^\s].+[^\s]/,
                                                            message: "Space not allowed"
                                                        },
                                                        minLength: {
                                                            value: 3,
                                                            message: "State should be minimun 3 characters or more"
                                                        },
                                                        validate: (value) => {
                                                            return (
                                                                [/^[a-zA-Z() ]+$/].every((pattern) =>
                                                                    pattern.test(value)
                                                                ) || "State name should be contain only alphabetic value"
                                                            );
                                                        },
                                                    })}
                                                error={!!errors?.state}
                                                helperText={errors?.state ? errors.state.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <TextField id="outlined-basic" label="Country" variant="outlined" sx={{ width: "100%" }}
                                                {...register("country",
                                                    {
                                                        required: "Required",
                                                        pattern: {
                                                            value: /^[^\s].+[^\s]/,
                                                            message: "Space not allowed"
                                                        },
                                                        minLength: {
                                                            value: 3,
                                                            message: "Country should be minimun 3 characters or more"
                                                        },
                                                        validate: (value) => {
                                                            return (
                                                                [/^[a-zA-Z() ]+$/].every((pattern) =>
                                                                    pattern.test(value)
                                                                ) || "Country name should be contain only alphabetic value"
                                                            );
                                                        },
                                                    })}
                                                error={!!errors?.country}
                                                helperText={errors?.country ? errors.country.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={12} md={12} sm={12} xs={12} item>
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", marginRight:"20px", marginTop: "10px" }}>
                                            <Button variant="contained" type="submit" sx={{ minWidth: "150px", fontSize: "1rem", fontWeight:"600" }}>Add</Button>
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
