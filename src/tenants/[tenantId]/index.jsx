import React, { useState, useEffect } from 'react'
import { Grid, Toolbar, Box, Typography, Button, Paper, Divider, getTextFieldUtilityClass } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TenantContractTable from '../../components/tenantsComponents/TenantContractTable'
import axios from 'axios';
import Cookies from 'js-cookie';
import { Image } from 'react-bootstrap';
import userIcon from '../../styles/userIcon.webp'
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function TenantsDetails() {
  const accessToken = Cookies.get("accessToken")
 const navigate = useNavigate()
  const params = useParams()
  const tenantId = params.slug
  const companyType = Cookies.get("companyName")
  const [tenatnsData, setTenantsData] = useState()
  
  useEffect(() => {
    const userAccessToken = Cookies.get("accessToken")
    if (!userAccessToken) {
      navigate.push('/')
    }
}, [navigate])

  const getTenantsData = () => {
    axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-rental-warehouse-detail/${tenantId}/?company_type=${companyType}`,
    {
      headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
  }
    )
      .then((res) => {
        console.log("tenatns user res", res.data.response)
        if (res.data.status === 200) {
          setTenantsData(res.data.response)
        }
      })
      .catch((err) => {
        console.log("err", err)
      })
  }
  useEffect(() => {
    if (tenantId) {
      getTenantsData()
    }
  }, [navigate, accessToken])


  const gridStyles = {
    padding: 3,
  };
  return (
    <>
      <Grid container spacing={2} sx={gridStyles}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Toolbar />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" gutterBottom>Tenants Profile</Typography>
            <Link to="/tenants"><Button variant="contained"><ArrowBackIcon /> Back</Button></Link>
          </Box>

        </Grid>
        <Grid item lg={3} md={5} sm={12} xs={12}>
          <Paper elevation={2} sx={{
            padding: '1em',
          }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              {tenatnsData && tenatnsData.profile != null ?
               <Image src={`https://bsgroup.org.in${tenatnsData.profile}`}  alt="icon"  width="100" height="100" borderradius="100" style={{borderRadius:"100%", border:"1px solid lightgrey"}} />
               :
               <Image src={userIcon}   alt="icon"  width="100" height="100" borderradius="100" style={{borderRadius:"100%", border:"1px solid lightgrey"}} />
               }
             
              <h3 style={{ marginTop: "7px", color:"#404040" }}>{tenatnsData && tenatnsData.username}</h3>
              <Typography variant="subtitle1" gutterBottom>
                {tenatnsData && tenatnsData.email}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px" }}>
              <Typography variant="h6" sx={{ fontSize: "17px", fontWeight:"600" }} gutterBottom>
                Phone Number
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {tenatnsData && tenatnsData.phone !== null ? tenatnsData.phone : "N/A"}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px" }}>
              <Typography variant="h6" sx={{ fontSize: "17px", width:"30%", fontWeight:"600" }} gutterBottom>
                Address
              </Typography>
              <Typography variant="subtitle1" sx={{width:"70%", textAlign:"right" }} gutterBottom>
                {tenatnsData && tenatnsData.address !== "" ? tenatnsData.address : "N/A"}
              </Typography>
            </Box>
            <Divider />
          </Paper>
        </Grid>
        <Grid item lg={9} md={7} sm={12} xs={12}>
          <TenantContractTable contract={tenatnsData && tenatnsData.contract} />
        </Grid>
      </Grid>
    </>
  )
}






