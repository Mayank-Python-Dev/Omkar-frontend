
import React, { useEffect, useState } from 'react'
import { Grid, Toolbar, Paper, Box, Typography, TextField, Button } from '@mui/material'
import axios from 'axios';
// import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import Link from 'next/link';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function TenantFormDetail() {
    // const router = useRouter()

    const navigate = useNavigate()
    const pathRoute = useParams()
    const { slug, id } = pathRoute

    const accessToken = Cookies.get("accessToken")

    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])

    const companyType = Cookies.get("companyName")
    const [contractData, setContractData] = useState()
    const getInvestorDetails = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-investor-rental-gala-detail-view/${id}/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
            .then((res) => {
                console.log("investor contract gala details---", res.data.response[0])
                setContractData(res.data.response[0]);
                
            })
            .catch((err) => {
                console.log("err", err)
            })
    }
    useEffect(() => {
        getInvestorDetails();
        
        
    }, [id, navigate])
    console.log(contractData);


    const gridStyles = {
        padding: 3,
    };

    return (
        <>

            <Grid container spacing={2} sx={gridStyles}>
                <Grid item lg={12}>
                    <Toolbar />
                    <Grid item lg={12} md={12} sm={12} xs={12}>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="subtitle1" sx={{ fontSize: "22px" }} gutterBottom>View Contract Detail</Typography>
                            <Link to={`/tenants/${slug}`}><Button variant="contained"><ArrowBackIcon /> Back</Button></Link>
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
                                            <h4 style={{ fontWeight: "400" }}>Investor</h4>
                                            <TextField id="outlined-read-only-input" label={contractData && contractData.owner.username} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Rental</h4>
                                            <TextField id="outlined-read-only-input" label={contractData && contractData.user.username} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Gala</h4>
                                            <TextField id="outlined-read-only-input" label={contractData && contractData.gala.gala_number} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Agreement type</h4>
                                            <TextField id="outlined-read-only-input" label={contractData && contractData.agreement_type} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Agreement Start Date</h4>
                                            <TextField id="outlined-read-only-input" label={contractData && contractData.agreement_valid_start_date} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Agreement End Date</h4>
                                            <TextField id="outlined-read-only-input" label={contractData && contractData.agreement_valid_end_date} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Ghar Patti Start Date</h4>
                                            <TextField id="outlined-read-only-input" label={contractData && contractData.ghar_patti_start_date} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Ghar Patti End Date</h4>
                                            <TextField id="outlined-read-only-input" label={contractData && contractData.ghar_patti_end_date} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ margin: "15px" }}>
                                            <h4 style={{ fontWeight: "400" }}>Locking Period</h4>
                                            <TextField id="outlined-read-only-input" label={contractData && contractData.locking_period} variant="outlined" sx={{ width: "100%" }} disabled />
                                        </Box>
                                    </Grid>

                                    <Grid lg={6} md={6} sm={12} xs={12} item>
                                        <Box style={{ marginTop: "58px", display: "flex", flexFlow: "wrap", gap: "30px" }}>
                                            <h4 style={{ fontWeight: "400", paddingLeft: "10px" }}>Agreement Doc - <a href={contractData && contractData.agreement_valid_doc} target="_blank">View and Download</a></h4>
                                            <h4 style={{ fontWeight: "400", paddingLeft: "10px" }}>Ghar Patti Doc - <a href={contractData && contractData.ghar_patti_doc} target="_blank">View and Download</a></h4>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}


