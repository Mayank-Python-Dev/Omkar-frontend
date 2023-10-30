import React, { useState, useEffect } from 'react'
import { Grid, Toolbar, Box, Typography, Button, Paper, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FarmerContractTable from '../../../components/farmersComponents/FarmerContractTable'
import axios from 'axios';
import Cookies from 'js-cookie';
import user from '../../../styles/userIcon.webp'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function FarmerDetails() {
    const navigate = useNavigate()
    const path = useParams()
    const { slug, id } = path

    const accessToken = Cookies.get("accessToken")

    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])
    const companyType = Cookies.get("companyName")
    const [farmersData, setFarmersData] = useState()

    const getFarmersData = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-farmers-gala-detail/${slug}/${id}/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("farmer gala res", res.data.response)
                if (res.data.status === 200) {
                    setFarmersData(res.data.response)
                }
            })
            .catch((err) => {
                console.log("err", err)
            })
    }
    useEffect(() => {
        if (slug && id) {
            getFarmersData()
        }
    }, [navigate, slug, id])


    const gridStyles = {
        padding: 3,
    };


    return (

        <>
            <Grid container spacing={2} sx={gridStyles}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    {/* <Toolbar /> */}
                    <Toolbar />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h5" gutterBottom>Farmers Gala Details</Typography>
                        <Link to="/farmers/farmers_property"><Button variant="contained"><ArrowBackIcon /> Back</Button></Link>
                    </Box>

                </Grid>
                <Grid item lg={3} md={5} sm={12} xs={12}>
                    <Paper elevation={2} sx={{
                        padding: '1em',
                    }}>
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <img src={user} alt="icon" width="100" height="100" borderRadius="100" style={{ borderRadius: "100%" }} />
                            <h3 style={{ marginTop: "7px", marginBottom: "12px", color: "#404040" }}>{farmersData && farmersData.username}</h3>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px" }}>
                            <Typography variant="h6" sx={{ fontSize: "17px", fontWeight: "600" }} gutterBottom>
                                Phone Number
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                {farmersData && farmersData.phone !== null ? farmersData.phone : "N/A"}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px" }}>
                            <Typography variant="h6" sx={{ fontSize: "17px", fontWeight: "600" }} gutterBottom>
                                Address
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                {farmersData && farmersData.address !== "" ? farmersData.address : "N/A"}
                            </Typography>
                        </Box>
                        <Divider />

                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px" }}>
                            <Typography variant="h6" sx={{ fontSize: "17px", fontWeight: "600" }} gutterBottom>
                                Birth Date
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                {farmersData && farmersData.birth_date !== null ? farmersData.birth_date : "N/A"}
                            </Typography>
                        </Box>
                        <Divider />
                    </Paper>
                </Grid>

                <Grid item lg={9} md={7} sm={12} xs={12}>
                    <FarmerContractTable contract={farmersData && farmersData.get_investor_contract} />
                </Grid>
            </Grid>
        </>
    )
}
