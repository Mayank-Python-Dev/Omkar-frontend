import React, { useState, useEffect } from 'react'
import { Grid, Toolbar, Box, Typography, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeveloperDetails from '../../components/developersComponents/DeveloperDetails';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Link, useNavigate, useParams} from 'react-router-dom'

export default function DeveloperInvestorDetails() {
    const navigate = useNavigate()
    const path = useParams()
    const developersId = path.slug
    const companyType = Cookies.get("companyName")
    const accessToken = Cookies.get("accessToken")
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])
    const [developersData, setDevelopersData] = useState()

    const getDevelopersData = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-owner-investor-contract-detail/${developersId}/?company_type=${companyType}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
        }
        )
            .then((res) => {
                // console.log("developer res----", res.data.response)
                if (res.data.status === 200) {
                    setDevelopersData(res.data.response)
                }
            })
            .catch((err) => {
                console.log("err", err)
            })
    }
    useEffect(() => {
        if (developersId) {
            getDevelopersData()
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
                        <Typography variant="h5" gutterBottom>Owner Investors Contract Details</Typography>
                        <Link to="/developers"><Button variant="contained"><ArrowBackIcon /> Back</Button></Link>
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <DeveloperDetails contract={developersData && developersData}/>
                </Grid>
            </Grid>
        </>
    )
}


