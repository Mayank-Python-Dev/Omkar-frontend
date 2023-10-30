import React, { useEffect, useState, useRef } from 'react'
import { Grid, Toolbar, Paper, Box, Typography, TextField, Button, MenuItem, RadioGroup, FormControlLabel, FormControl, Radio, Autocomplete, Select } from '@mui/material'
import { useForm, Controller } from 'react-hook-form';
import Cookies from 'js-cookie';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Contract_with_rental() {
    const accessToken = Cookies.get("accessToken")
    const companyId = Cookies.get("companyId")
    const companyType = Cookies.get("companyName")

    // const router = useRouter()
    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors }, watch, control } = useForm()
    const [userType, setUsertype] = useState("Owner")
    const [allUserType, setAllUserType] = useState([])
    const [allWarehouse, setAllWarehouse] = useState([])
    const [allGala, setAllGala] = useState([])
    const [allRentals, setAllRentals] = useState([])
    const [loader, setLoader] = useState(false)
    const [agreementDateErr, setAgreementDateErr] = useState(false)
    const [gharPattiDateErr, setGharPattiDateErr] = useState(false)

    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])

    const [userId, setUserId] = useState("")
    const [warehouseId, setWarehouseId] = useState("")
    const [galaId, setGalaId] = useState("")
    const [rentalId, setRentalId] = useState("")

    // const onwerId = watch('owner')
    // const warehouseId = watch('warehouse')
    // const galaId = watch('gala')
    // const rentalId = watch('user')
    // useEffect(() => {
    //     if (onwerId) {
    //         setValue('warehouse', '')
    //         setValue('gala', '')
    //     }
    // }, [onwerId])
    // useEffect(() => {
    //     if (warehouseId) {
    //         setValue('gala', '')
    //     }
    // }, [warehouseId])


    let agreementStartDate = watch('agreement_start_date')
    let agreementEndDate = watch('agreement_end_date')
    let gharPattiStartDate = watch('gharpatti_start_date')
    let gharPattiEndDate = watch('gharpatti_end_date')

    // agreementEndDate = new Date(agreementEndDate)
    // agreementEndDate = agreementEndDate.getFullYear()

    // agreementStartDate = new Date(agreementStartDate)
    // agreementStartDate = agreementStartDate.getFullYear() + 4

    // gharPattiEndDate = new Date(gharPattiEndDate)
    // gharPattiEndDate = gharPattiEndDate.getFullYear()

    // gharPattiStartDate = new Date(gharPattiStartDate)
    // gharPattiStartDate = gharPattiStartDate.getFullYear() + 1

    useEffect(() => {
        if (agreementStartDate && agreementEndDate) {

            if (agreementEndDate <= agreementStartDate) {
                setAgreementDateErr(true)
            } else {
                setAgreementDateErr(false)
            }
        }

        if (gharPattiStartDate && gharPattiEndDate) {
            if (gharPattiEndDate <= gharPattiStartDate) {
                setGharPattiDateErr(true)
            } else {
                setGharPattiDateErr(false)
            }
        }

    }, [agreementStartDate, agreementEndDate, gharPattiStartDate, gharPattiEndDate])

    // ******* get all user type start *******
    const cUserType = useRef(null);
    const cWarehouse = useRef(null);
    const cGala = useRef(null);

    const handleUserType = (e) => {
        setUsertype(e.target.value)
    }
    useEffect(() => {
        const clearUserType = cUserType.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
        if (clearUserType) {
            clearUserType.click()
        }

        const clearWarehouse = cWarehouse.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
        if (clearWarehouse) {
            clearWarehouse.click()
        }

        const clearGala = cGala.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
        if (clearGala) {
            clearGala.click()
        }
    }, [userType])
    const getUserType = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-users-with-usertype/?get_user_type=${userType}&company_type=${companyType}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                // console.log("get user type res----", res.data.response)
                setAllUserType(res.data.response)
            })
            .catch((error) => {
                console.log("error", error)
            })
    }

    useEffect(() => {
        getUserType()
    }, [accessToken, userType])
    // ******* get all user type end *******

    // ****** get all warehouse start ******
    const getAllWarehouse = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-warehouse-with-usertype/${userId.user__user_uid}/?get_user_type=${userType}&company_type=${companyType}`,
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
        if (userId) {
            getAllWarehouse()

            const clearWarehouse = cWarehouse.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
            if (clearWarehouse) {
                clearWarehouse.click()
            }

            const clearGala = cGala.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
            if (clearGala) {
                clearGala.click()
            }
        }
    }, [accessToken, userId, userType])
    // ****** get all warehouse end ******

    // ******* get all gala name start *******
    const getAllGala = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-remaining-gala-with-usertype/${userId.user__user_uid}/?company_type=${companyType}&get_user_type=${userType}&get_warehouse_uid=${warehouseId.uid}`,
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
        if (userId && warehouseId) {
            getAllGala()
            const clearGala = cGala.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
            if (clearGala) {
                clearGala.click()
            }
        }
    }, [accessToken, userId, userType, warehouseId])
    // ******* get all gala name end *******

    // ******* get all rental name start *******
    const getAllRentalList = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-rental-list-with-company_type/?company_type=${companyType}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                // console.log("get rental list res----", res.data.response)
                setAllRentals(res.data.response)
            })
            .catch((error) => {
                console.log("error", error)
            })
    }

    useEffect(() => {
        getAllRentalList()
    }, [navigate])
    // ******* get all rental name end *******

    //*********locking period select dropdown start********* */

    useEffect(() => {
        // let count = Number(agreementEndDate && agreementEndDate.split("-").shift()) - Number(agreementStartDate && agreementStartDate.split("-").shift())
        let agreementStartDate1 = watch('agreement_start_date')
        let agreementEndDate1 = watch('agreement_end_date')

        let startDate = new Date(agreementStartDate1)
        let startYear = startDate.getFullYear()

        let endDate = new Date(agreementEndDate1)
        let endYear = endDate.getFullYear()

        let count = endYear - startYear - 1
        setLockingPeriodCount(count)

    }, [agreementStartDate, agreementEndDate])


    const [lockingPeriod, setLockingPeriod] = useState("none");
    const [showPlaceholder, setShowPlaceholder] = useState(lockingPeriod === "none");
    const [lockingPeriodCount, setLockingPeriodCount] = useState("")
    const [lockingErr, setLockingErr] = useState("")

    const handleLockingPeriod = (e) => {
        setLockingPeriod(e.target.value)
        setLockingErr("")
    }
    //*********locking period select dropdown end********* */

    // ******* add contract start *******
    const onSubmit = (data) => {
        if (lockingPeriod === "none") {
            setLockingErr("Required")
            return
        }

        setLoader(true)
        let formData = new FormData()
        if (userId) {
            formData.append("owner", userId.user__user_uid)
        }
        if (galaId) {
            formData.append("gala", galaId.uid)
        }
        if (rentalId) {
            formData.append("user", rentalId.user_uid)
        }
        formData.append("agreement_valid_doc", data.agreement_doc[0])
        formData.append("ghar_patti_doc", data.gharpatti_doc[0])
        formData.append("agreement_valid_start_date", data.agreement_start_date)
        formData.append("agreement_valid_end_date", data.agreement_end_date)
        formData.append("ghar_patti_start_date", data.gharpatti_start_date)
        formData.append("ghar_patti_end_date", data.gharpatti_end_date)
        formData.append("locking_period", lockingPeriod)

        axios.post(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/contract-with-rental/`, formData,
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
                    toast.success('Contract successful created with rental', {
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
                        navigate(`/tenants/${rentalId.user_uid}`)
                        reset()
                    }, 2500)
                }
            })
            .catch((error) => {
                console.log("error", error)
                setLoader(false)
                reset()
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
                        <h1>Add Contract With Rental</h1>
                        <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                    </Box>
                    <Paper variant="outlined" sx={{
                        padding: '1em',
                        width: '100%',
                        marginTop: "1.5em"
                    }}>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Typography variant="body1" sx={{ fontSize: "23px", marginLeft: "13px" }} gutterBottom>Contract Detail</Typography>

                            <Grid container>
                                <Grid lg={12} md={12} sm={12} xs={12} item>
                                    <Box style={{ marginTop: "10px", paddingLeft: "15px" }}>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                                defaultValue="Owner"
                                            >
                                                <FormControlLabel value="Owner" onClick={handleUserType} control={<Radio />} label="Owner" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value="Investor" onClick={handleUserType} control={<Radio />} label="Investor" style={{ marginRight: "100px" }} />
                                                <FormControlLabel value="Farmer" onClick={handleUserType} control={<Radio />} label="Farmer" style={{ marginRight: "100px" }} />
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>


                            <Box noValidate autoComplete="off">

                                <Grid container>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>{userType}</h4>
                                            <div className='formGroup'>
                                                <Controller
                                                    name="userType"
                                                    control={control}
                                                    rules={{
                                                        required: "Required"
                                                    }}
                                                    render={({ field, fieldState }) => {
                                                        return (
                                                            <Autocomplete
                                                                {...field}
                                                                options={allUserType}
                                                                getOptionLabel={(e) => e.user__username || ""}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        placeholder={`Select ${userType} Name`}
                                                                        variant="outlined"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
                                                                        className="userType_field"
                                                                    />
                                                                )}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data)
                                                                    setUserId(data)
                                                                }}

                                                                ref={cUserType}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </div>
                                            {/* <TextField id="outlined-basic" label={`Select ${userType} Name`} variant="outlined" select
                                        {...register("owner", { required: "Required" })}
                                        error={!!errors?.owner}
                                        helperText={errors?.owner ? errors.owner.message : null}
                                    >
                                        {allUserType.length > 0 ? <MenuItem value="">Select {userType} Name</MenuItem> : <MenuItem></MenuItem>}
                                        {
                                            allUserType.length > 0 &&
                                            allUserType.map((e, i) => {
                                                return (
                                                    <MenuItem value={e.user__user_uid} key={i}>{e.user__username}</MenuItem>
                                                )
                                            })
                                        }
                                    </TextField> */}
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Warehouse</h4>
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
                                                                        placeholder="Select Warehouse"
                                                                        variant="outlined"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
                                                                        className="warehouse_field"
                                                                    />
                                                                )}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data)
                                                                    setWarehouseId(data)
                                                                }}
                                                                ref={cWarehouse}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </div>
                                            {/* <TextField id="outlined-basic" label="Select Warehouse Name" variant="outlined" select
                                        {...register("warehouse", { required: "Required" })}
                                        error={!!errors?.warehouse}
                                        helperText={errors?.warehouse ? errors.warehouse.message : null}
                                    >
                                        {allWarehouse.length > 0 ? <MenuItem value="">Select Warehouse </MenuItem> : <MenuItem></MenuItem>}
                                        {
                                            allWarehouse.length > 0 ?
                                                allWarehouse.map((e, i) => {
                                                    return (
                                                        <MenuItem value={e.uid} key={i}>{e.property_name}</MenuItem>
                                                    )
                                                })
                                                :
                                                <MenuItem>No Warehouse Found</MenuItem>
                                        }
                                    </TextField> */}
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Gala</h4>
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
                                                                getOptionLabel={(e) => e.gala__uid_with_warehouse || ""}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        placeholder="Select Gala"
                                                                        variant="outlined"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
                                                                        className="gala_field"
                                                                    />
                                                                )}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data)
                                                                    setGalaId(data)
                                                                }}
                                                                ref={cGala}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </div>
                                            {/* <TextField id="outlined-basic" label="Select Gala Name" variant="outlined" select
                                        {...register("gala", { required: "Required" })}
                                        error={!!errors?.gala}
                                        helperText={errors?.gala ? errors.gala.message : null}
                                    >
                                        {allGala.length > 0 ? <MenuItem value="">Select Gala </MenuItem> : <MenuItem></MenuItem>}
                                        {
                                            allGala.length > 0 ?
                                                allGala.map((e, i) => {
                                                    return (
                                                        <MenuItem value={e.uid} key={i}>{e.gala__uid_with_warehouse}</MenuItem>
                                                    )
                                                })
                                                :
                                                <MenuItem>No Gala Found</MenuItem>
                                        }
                                    </TextField> */}
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Rental</h4>
                                            <div className='formGroup'>
                                                <Controller
                                                    name="rental"
                                                    control={control}
                                                    rules={{
                                                        required: "Required"
                                                    }}
                                                    render={({ field, fieldState }) => {
                                                        return (
                                                            <Autocomplete
                                                                {...field}
                                                                options={allRentals}
                                                                getOptionLabel={(e) => e.username || ""}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        placeholder="Select Rental"
                                                                        variant="outlined"
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
                                                                    />
                                                                )}
                                                                onChange={(_, data) => {
                                                                    field.onChange(data)
                                                                    setRentalId(data)
                                                                }}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </div>
                                            {/* <TextField id="outlined-basic" label="Select Rental" variant="outlined" select
                                        {...register("user", { required: "Required" })}
                                        error={!!errors?.user}
                                        helperText={errors?.user ? errors.user.message : null}
                                    >
                                        {allRentals.length > 0 ? <MenuItem value="">Select Rental</MenuItem> : <MenuItem></MenuItem>}
                                        {
                                            allRentals.length > 0 &&
                                            allRentals.map((e, i) => {
                                                return (
                                                    <MenuItem value={e.user_uid} key={i}>{e.username}</MenuItem>
                                                )
                                            })
                                        }
                                    </TextField> */}
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Upload Agreement Document</h4>
                                            <TextField id="outlined-basic" label="" variant="outlined" type="file" sx={{ width: "100%" }}
                                                {...register("agreement_doc", {
                                                    required: "Required",
                                                    validate: {
                                                        // lessThan10MB: files => files[0]?.size < 10000000 || 'Max 10MB',
                                                        acceptedFormats: files =>
                                                            ['application/pdf'].includes(
                                                                files[0]?.type
                                                            ) || 'Only PDF allow',
                                                    },
                                                })}
                                                error={!!errors?.agreement_doc}
                                                helperText={errors?.agreement_doc ? errors.agreement_doc.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Upload GharPatti Document</h4>
                                            <TextField id="outlined-basic" label="" variant="outlined" type="file" sx={{ width: "100%" }}
                                                {...register("gharpatti_doc", {
                                                    required: "Required",
                                                    validate: {
                                                        // lessThan10MB: files => files[0]?.size < 10000000 || 'Max 10MB',
                                                        acceptedFormats: files =>
                                                            ['application/pdf'].includes(
                                                                files[0]?.type
                                                            ) || 'Only PDF allow',
                                                    },
                                                })}
                                                error={!!errors?.gharpatti_doc}
                                                helperText={errors?.gharpatti_doc ? errors.gharpatti_doc.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Agreement Start Date</h4>
                                            <TextField id="outlined-basic" label="" variant="outlined" type="date" sx={{ width: "100%" }}
                                                {...register("agreement_start_date", { required: "Required" })}
                                                error={!!errors?.agreement_start_date}
                                                helperText={errors?.agreement_start_date ? errors.agreement_start_date.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Agreement End Date </h4>
                                            <TextField id="outlined-basic" label="" variant="outlined" type="date" sx={{ width: "100%" }}
                                                {...register("agreement_end_date", { required: "Required" })}
                                                error={!!errors?.agreement_end_date}
                                                helperText={errors?.agreement_end_date ? errors.agreement_end_date.message : null}
                                            />
                                            {agreementDateErr ? <p style={{ color: "#cd0b0b", fontSize: "14px", paddingLeft: "20px" }}>End date should be greater than to Start date</p> : ""}
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>GharPatti Start Date</h4>
                                            <TextField id="outlined-basic" label="" variant="outlined" type="date" sx={{ width: "100%" }}
                                                {...register("gharpatti_start_date", { required: "Required" })}
                                                error={!!errors?.gharpatti_start_date}
                                                helperText={errors?.gharpatti_start_date ? errors.gharpatti_start_date.message : null}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>GharPatti End Date</h4>
                                            <TextField id="outlined-basic" label="" variant="outlined" type="date" sx={{ width: "100%" }}
                                                {...register("gharpatti_end_date", { required: "Required" })}
                                                error={!!errors?.gharpatti_end_date}
                                                helperText={errors?.gharpatti_end_date ? errors.gharpatti_end_date.message : null}
                                            />
                                            {gharPattiDateErr ? <p style={{ color: "#cd0b0b", fontSize: "14px", paddingLeft: "20px" }}>End date should be greater than to Start date</p> : ""}
                                        </Box>
                                    </Grid>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "500", paddingBottom: "4px" }}>Locking Period (Year<span style={{ color: "red" }}>*</span> )</h4>
                                            <Select
                                                value={lockingPeriod}
                                                onChange={handleLockingPeriod}
                                                onFocus={(e) => setShowPlaceholder(false)}
                                                onClose={(e) => setShowPlaceholder(e.target.value === undefined)}
                                                sx={{ width: "100%" }}
                                            >
                                                <MenuItem value="none">Select Locking Period</MenuItem>
                                                {lockingPeriodCount > 0 ?
                                                    Array(lockingPeriodCount).fill("").map((e, i) => {
                                                        return (
                                                            <MenuItem value={i + 1} key={i}>{i + 1}</MenuItem>
                                                        )
                                                    }) : ""
                                                }
                                            </Select>
                                            {lockingErr ? <p style={{ fontSize: "0.75rem", color: "#d32f2f", marginLeft: "14px", marginTop: "3px" }}>{lockingErr}</p> : ""}
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

