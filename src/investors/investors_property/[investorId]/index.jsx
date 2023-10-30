import React, { useState, useEffect } from 'react'
import { Grid, Toolbar, Box, Typography, Button, Paper, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UserTable from '../../../components/investorComponents/UserTable';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Link, useNavigate, useParams} from 'react-router-dom'

export default function InvestorDetails() {
    const path = useParams()
    const navigate = useNavigate()
    const investorId = path.slug
    const accessToken = Cookies.get("accessToken")
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])
    const companyType = Cookies.get("companyName")
    const [investorData, setInvestorData] = useState()
    const getInvestorsData = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-investors-gala-detail/${investorId}/?company_type=${companyType}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
        }
        )
            .then((res) => {
                console.log("inverts gala res", res.data.response)
                if (res.data.status === 200) {
                    setInvestorData(res.data.response)
                }
            })
            .catch((err) => {
                console.log("err", err)
            })
    }
    useEffect(() => {
        if (investorId) {
            getInvestorsData()
        }
    }, [navigate])


    const gridStyles = {
        padding: 3,
    };

    return (
        <>
            <Grid container spacing={2} sx={gridStyles}>
                <Grid item lg={12} xs={12}>
                    <Toolbar />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h5" gutterBottom>Investors Property Gala Details</Typography>
                        <Link to="/investors/investors_property"><Button variant="contained"><ArrowBackIcon /> Back</Button></Link>
                    </Box>

                </Grid>
                {/* <Grid item lg={3}>
                    <Paper elevation={2} sx={{
                        padding: '1em',
                    }}>
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <img src="https://institutional-initiatives.utdallas.edu/institutional-initiatives/files/2022/03/no-profile-picture-icon-15-omqilctwnnaw5c9dnu5i4bvw9ui5vymmtjrwsaz3q0.png" style={{ width: "100px", height: "100px", borderRadius: "100%" }} />
                            <h3 style={{ marginTop: "7px" }}>{investorData && investorData.username}</h3>
                            <Typography variant="subtitle1" gutterBottom>
                               {investorData && investorData.email}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px"}} gutterBottom>
                                Phone Number
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                            {investorData && investorData.phone !== null ? investorData.phone : "N/A"}
                            </Typography>
                        </Box>
                           <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px"}} gutterBottom>
                                Address
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                            {investorData && investorData.address !== "" ? investorData.address : "N/A"}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px"}} gutterBottom> 
                                City
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                            {investorData && investorData.city !== null ? investorData.city : "N/A"}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px"}} gutterBottom>
                                Zip Code
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                            {investorData && investorData.zip_code !== null ? investorData.zip_code : "N/A"}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px"}} gutterBottom>
                                Birth Date
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                            {investorData && investorData.birth_date !== null ? investorData.birth_date : "N/A"}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px"}} gutterBottom>
                                Number of Gala
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                {investorData && investorData.numbers_of_gala}
                            </Typography>
                        </Box>
                        <Divider />
                    </Paper>
                </Grid> */}

                <Grid item lg={12} xs={12}>
                    <UserTable contract={investorData && investorData}  />
                </Grid>
            </Grid>
        </>
    )
}






