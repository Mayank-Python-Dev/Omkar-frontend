import React, { useState, useEffect } from 'react'
import { Grid, Toolbar, Box, Typography, Button, Paper, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom'
import RentalDetails from '../../components/developersComponents/RentalDetails '
import axios from 'axios';
import Cookies from 'js-cookie';
export default function DeveloperRentalDetails() {
    const path = useParams()
    const navigate = useNavigate()
    const rentalId = path.slug
    const companyType = Cookies.get("companyName")
    const accessToken = Cookies.get("accessToken")
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])
    const [rentalData, setRentalData] = useState()

    const getRentalData = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-owner-rental-contract-detail/${rentalId}/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("rental res----", res.data.response)
                if (res.data.status === 200) {
                    setRentalData(res.data.response)
                }
            })
            .catch((err) => {
                console.log("err", err)
            })
    }
    useEffect(() => {
        if (rentalId) {
            getRentalData()
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
                        <Typography variant="h5" gutterBottom>Owner Rental Contract Details</Typography>
                        <Link to="/developers"><Button variant="contained"><ArrowBackIcon /> Back</Button></Link>
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <RentalDetails contract={rentalData && rentalData} />
                </Grid>
            </Grid>
        </>
    )
}
