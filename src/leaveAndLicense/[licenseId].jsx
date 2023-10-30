import React, { useState, useEffect } from 'react'
import { Grid, Toolbar, Box, Typography, Button, Paper, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WareHouseDetails from "../components/leaveLicenseComponents/WareHouseDetails"
import axios from 'axios';
import Cookies from 'js-cookie';
import warehouseImg from "../styles/warehouseImg.webp"
import {useParams, useNavigate, Link } from 'react-router-dom';

export default function LeaveAndLicenceDetails() {
    const path = useParams()
    const navigate = useNavigate()
    const slug = path.slug
 
    const accessToken = Cookies.get("accessToken")
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate("/")
        }
    }, [navigate])


    const [data, setData] = useState()
    const companyType = Cookies.get("companyName")

    const getData = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-live-and-license-detail-api/${slug}/?company_type=${companyType}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
        }
        )
            .then((res) => {
                console.log("leave and licence details res", res.data.response)
                if (res.data.status === 200) {
                    setData(res.data.response)
                }
            })
            .catch((err) => {
                console.log("err", err)
            })
    }
    useEffect(() => {
        if (slug) {
            getData()
        }
    }, [navigate])


    const gridStyles = {
        padding: 3,
    };

   
    return (
        <>
            <Grid container spacing={2} sx={gridStyles}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Toolbar />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h5" gutterBottom>WareHouse Details</Typography>
                        <Link to="/leaveAndLicense"><Button variant="contained"><ArrowBackIcon /> Back</Button></Link>
                    </Box>
                </Grid>
               <Grid item lg={3} md={5} sm={12} xs={12}>
                    <Paper elevation={2} sx={{
                        padding: '1em',
                    }}>
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <img src={warehouseImg} width="500" height="150" alt="warehouse_img"
                            style={{ marginBottom:"7px",width:"100%" }} />
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px", fontWeight:"600"}} gutterBottom>
                              Property Name
                            </Typography>
                            <Typography variant="subtitle1" sx={{textAlign:"right"}} gutterBottom>
                            {data && data.property_name }
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px", fontWeight:"600"}} gutterBottom>
                                Property Survay Number
                            </Typography>
                            <Typography variant="subtitle1" sx={{textAlign:"right"}} gutterBottom>
                            {data && data.property_survey_number}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px", fontWeight:"600"}} gutterBottom>
                               Property Type
                            </Typography>
                            <Typography variant="subtitle1" sx={{textAlign:"right"}} gutterBottom>
                            {data && data.property_type}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px", fontWeight:"600"}} gutterBottom>
                              Address
                            </Typography>
                            <Typography variant="subtitle1" sx={{textAlign:"right"}} gutterBottom>
                            {data && data.address}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px", fontWeight:"600"}} gutterBottom>
                                City
                            </Typography>
                            <Typography variant="subtitle1" sx={{textAlign:"right"}} gutterBottom>
                            {data && data.city}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px", fontWeight:"600"}} gutterBottom>
                                Zip Code
                            </Typography>
                            <Typography variant="subtitle1" sx={{textAlign:"right"}} gutterBottom>
                                {data && data.zipcode}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px", fontWeight:"600"}} gutterBottom>
                                State
                            </Typography>
                            <Typography variant="subtitle1" sx={{textAlign:"right"}} gutterBottom>
                                {data && data.state}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px", fontWeight:"600"}} gutterBottom>
                               Country
                            </Typography>
                            <Typography variant="subtitle1" sx={{textAlign:"right"}} gutterBottom>
                                {data && data.country}
                            </Typography>
                        </Box>
                        <Divider />
                        {/* <Box sx={{ display: "flex", justifyContent:"space-between", marginTop:"11px", marginBottom:"5px" }}>
                        <Typography variant="h6" sx={{fontSize:"17px", fontWeight:"600"}} gutterBottom>
                               Allotted to Farmer
                            </Typography>
                            <Typography variant="subtitle1" className={data && data.is_allotted_to_farmer === true ? 'green' : 'red'} gutterBottom>
                                {data && data.is_allotted_to_farmer === true ? <span>Yes</span> : <span>No</span>}
                            </Typography>
                        </Box>
                        <Divider /> */}
                    </Paper>
                </Grid> 
                <Grid item lg={9} md={7} sm={12} xs={12}>
                    <WareHouseDetails galaDetails = {data && data.get_gala} />
                </Grid>
            </Grid>
        </>
    )
}


