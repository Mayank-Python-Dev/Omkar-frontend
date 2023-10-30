
import React, { useEffect, useState } from 'react'
import { Grid, Toolbar, Paper, Box, Typography, Button, Divider } from '@mui/material'
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: '5px',
    boxShadow: 24,
    pt: 1,
    pl: 1,
    pr: 1,
};

export default function ServiceDetails() {
    const navigate = useNavigate()
    const path = useParams()
    const slug = path.slug

    const accessToken = Cookies.get("accessToken")
    const [serviceData, setServiceData] = useState()
    // const companyType = Cookies.get("companyName")

    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])

    const [open, setOpen] = React.useState(false);
    const [viewImg, setViewImg] = useState("")
    const handleShow = (i) => {
        setOpen(true)
        if (serviceData && serviceData.service_request_images.length > 0) {
            setViewImg(serviceData.service_request_images[i].image)
        }

    };
    const handleClose = () => setOpen(false);

    const getServiceDetails = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/service-detail-view/${slug}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("service details---", res.data.response[0])
                setServiceData(res.data.response[0])
            })
            .catch((err) => {
                console.log("err", err)
            })
    }
    useEffect(() => {
        getServiceDetails()
    }, [slug])
    const gridStyles = {
        padding: 3,
    };

    const goBack = () => {
        navigate(-1)
    }

    // ============= Read more read less state start ===========
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    // ============== Read more read less state end ===========

  
    return (
        <>
            <Grid container spacing={2} sx={gridStyles}>
                <Grid item lg={12}>
                    <Toolbar />
                    <Grid item lg={12} xs={12}>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="subtitle1" sx={{ fontSize: "22px" }} gutterBottom>Service Detail</Typography>
                            <Button variant="contained" onClick={goBack}><ArrowBackIcon /> Back</Button>
                        </Box>
                    </Grid>

                    <Box sx={{
                        width: '100%',
                        // height: '100px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        padding: '1em',

                    }}>
                        <Grid item lg={3} md={5} sm={12} xs={12}>
                            <Paper elevation={2} sx={{
                                padding: '1em',
                                width: "95%"
                            }}>
                                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    {serviceData &&
                                        <img src={serviceData.user.profile} alt="icon" width="100" height="100" borderradius="100" style={{ borderRadius: "100%", border: "1px solid lightgrey" }} />
                                    }

                                    <h3 style={{ marginTop: "7px" }}> {serviceData && serviceData.user.rental_name}</h3>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {serviceData && serviceData.user.email}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px" }}>
                                    <Typography variant="h6" sx={{ fontSize: "17px", fontWeight: "600" }} gutterBottom>
                                        Phone Number
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {serviceData && serviceData.user.phone}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px" }}>
                                    <Typography variant="h6" sx={{ fontSize: "17px", width: "30%", fontWeight: "600" }} gutterBottom>
                                        Address
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ width: "70%", textAlign: "right" }} gutterBottom>
                                        {serviceData && serviceData.user.address}
                                    </Typography>
                                </Box>
                                <Divider />

                            </Paper>
                        </Grid>
                        <Grid item lg={9} md={7} sm={12} xs={12}>
                            <Paper variant="outlined" sx={{
                                padding: '1em 1em',
                                width: '100%',
                                marginBottom: "1em"
                            }}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", width: "100%" }}>
                                    {
                                        serviceData && serviceData.service_request_images.length > 0 ?
                                            serviceData.service_request_images.map((e, i) => {
                                                return (
                                                    <img src={e.image} alt="service images" width="150" height="150" style={{ cursor: "pointer", objectFit: "fill" }} onClick={() => handleShow(i)} key={i}></img>
                                                )
                                            })
                                            :
                                            <h4 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "140px", width: "100%", color: "#333" }}>Images Not Available</h4>
                                    }
                                </div>
                            </Paper>
                            <Box sx={{
                                width: '100%',
                                display: 'flex',
                                flexWrap: 'wrap',
                            }}>
                                <Grid item lg={6} md={12} sm={12} xs={12}>
                                    <Paper variant="outlined" sx={{
                                        padding: '0em 0em',
                                        width: '97%',
                                    }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px" }} gutterBottom>
                                                Property Name
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {serviceData && serviceData.gala.warehouse.property_name}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px" }} gutterBottom>
                                                Property Type
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {serviceData && serviceData.gala.warehouse.property_type}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px" }} gutterBottom>
                                                Property Survey Number
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {serviceData && serviceData.gala.warehouse.property_survey_number}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px" }} gutterBottom>
                                                Gala Number
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {serviceData && serviceData.gala.gala_number}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px" }} gutterBottom>
                                                Gala Area Size
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {serviceData && serviceData.gala.gala_area_size}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px" }} gutterBottom>
                                                Gala Price
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {serviceData && serviceData.gala.gala_price}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item lg={6} md={12} sm={12} xs={12}>
                                    <Paper variant="outlined" sx={{
                                        padding: '0em 0em',
                                        width: '100%',
                                    }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px", width: "40%" }} gutterBottom>
                                                Address
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ width: "60%", textAlign: "right" }} gutterBottom>
                                                {serviceData && serviceData.gala.warehouse.address}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px" }} gutterBottom>
                                                City
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {serviceData && serviceData.gala.warehouse.city}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px" }} gutterBottom>
                                                Zip Code
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {serviceData && serviceData.gala.warehouse.zipcode}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px" }} gutterBottom>
                                                State
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {serviceData && serviceData.gala.warehouse.state}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px" }} gutterBottom>
                                                Country
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {serviceData && serviceData.gala.warehouse.country}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "11px", marginBottom: "5px", padding: '0em 1em' }}>
                                            <Typography variant="h6" sx={{ fontSize: "17px", width: "40%" }} gutterBottom>
                                                Description
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ width: "60%", textAlign: "right" }} gutterBottom>
                                                {isReadMore ? (serviceData && serviceData.description ? serviceData.description.slice(0, 50) : '-') : (serviceData && serviceData.description ? serviceData.description : '-')}
                                                {(serviceData && serviceData.description.length >= 50) ?
                                                    <span onClick={toggleReadMore} className="read-or-hide">
                                                        {isReadMore ? "...read more" : " show less"}
                                                    </span>
                                                    : <span></span>
                                                }
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Box>

                        </Grid>
                    </Box>

                </Grid>
            </Grid>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
                className='logout_modal'
            >
                <Box sx={style}>
                    <img src={viewImg} alt="service images" width="auto" height="600" style={{ borderRadius: "5px", objectFit: "contain", display: "block", margin: "auto" }}></img>
                </Box>
            </Modal>
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


