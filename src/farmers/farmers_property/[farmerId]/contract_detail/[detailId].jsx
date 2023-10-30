
import React, { useEffect, useState } from 'react'
import { Grid, Toolbar, Paper, Box, Typography, TextField, Button } from '@mui/material'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function FarmerDetailForm() {
    const navigate = useNavigate()
    const path = useParams()
    const { slug, id } = path
    const accessToken = Cookies.get("accessToken")
    const [farmerGalaDetail, setFarmerGalaDetail] = useState()
    const companyType = Cookies.get("companyName")
    const [warehouseId, setWarehouseId] = useState("")
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])

    const getFarmerGalaDetails = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-farmer-gala-detail/${id}/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
            .then((res) => {
                console.log("farmer gala details---", res.data.response)
                setFarmerGalaDetail(res.data.response)
                setWarehouseId(res.data.response.gala.warehouse.uid)
            })
            .catch((err) => {
                console.log("err", err)
            })
    }
    useEffect(() => {
        getFarmerGalaDetails()
    }, [id, navigate])
    const gridStyles = {
        padding: 3,
    };

    return (
        <>

            <Grid container spacing={2} sx={gridStyles}>
                <Grid item lg={12}>
                    <Toolbar />
                    <Grid item lg={12} xs={11}>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="subtitle1" sx={{ fontSize: "22px" }} gutterBottom>View Contract Detail</Typography>
                            <Link to={`/farmers/farmers_property/${slug}/${warehouseId}`}><Button variant="contained"><ArrowBackIcon /> Back</Button></Link>
                        </Box>
                    </Grid>
                    <Paper variant="outlined" sx={{
                        padding: '1.5em 1em',
                        width: '100%',
                        marginTop: "1em"
                    }}>

                        <form className='farmer_detail_form'>

                            <Box
                                noValidate
                                autoComplete="off">
                                <Grid container>
                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Farmer</h4>
                                            <TextField id="outlined-read-only-input" label={farmerGalaDetail && farmerGalaDetail.owner.username} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Rental</h4>
                                            <TextField id="outlined-read-only-input" label={farmerGalaDetail && farmerGalaDetail.user.username} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Gala</h4>
                                            <TextField id="outlined-read-only-input" label={farmerGalaDetail && farmerGalaDetail.gala.gala_number} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Agreement type</h4>
                                            <TextField id="outlined-read-only-input" label={farmerGalaDetail && farmerGalaDetail.agreement_type} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Agreement Start Date</h4>
                                            <TextField id="outlined-read-only-input" label={farmerGalaDetail && farmerGalaDetail.agreement_valid_start_date} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Agreement End Date</h4>
                                            <TextField id="outlined-read-only-input" label={farmerGalaDetail && farmerGalaDetail.agreement_valid_end_date} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Ghar Patti Start Date</h4>
                                            <TextField id="outlined-read-only-input" label={farmerGalaDetail && farmerGalaDetail.ghar_patti_start_date} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Ghar Patti End Date</h4>
                                            <TextField id="outlined-read-only-input" label={farmerGalaDetail && farmerGalaDetail.ghar_patti_end_date} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Locking Period</h4>
                                            <TextField id="outlined-read-only-input" label={farmerGalaDetail && farmerGalaDetail.locking_period} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ marginTop: "58px", display: "flex", flexFlow: "wrap", gap: "30px" }}>
                                            <h4 style={{ fontWeight: "400", paddingLeft: "10px" }}>Agreement Doc - <a href={farmerGalaDetail && farmerGalaDetail.agreement_valid_doc} target="_blank">View and Download</a></h4>
                                            <h4 style={{ fontWeight: "400", paddingLeft: "10px" }}>Ghar Patti Doc - <a href={farmerGalaDetail && farmerGalaDetail.ghar_patti_doc} target="_blank">View and Download</a></h4>
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


