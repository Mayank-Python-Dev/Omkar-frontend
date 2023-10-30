import { Grid, Paper, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import BarChart from './ghraphCharts/BarChart';
import PieChart from './ghraphCharts/PieChart';


export default function Dashboard() {
    const navigate = useNavigate()
    const gridStyles = {
        padding: 3,
    };

    const companyType = Cookies.get("companyName")
    const accessToken = Cookies.get("accessToken")

    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])

    const [dashboardData, setDashboardData] = useState()
    const getDashboardData = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/dashboard-view/?company_type=${companyType}`)
            .then((res) => {
                // console.log("dashboard res", res.data.response)
                setDashboardData(res.data.response[0])
            })
            .catch((err) => {
                console.log("dashboard err", err)
            })
    }

    useEffect(() => {
        getDashboardData()
    }, [navigate])


    //***********get gala datapoints for barchart start************ */
    const [monthYear, setMonthYear] = useState([])
    const [galaAreaSize, setGalaAreaSize] = useState([])
    const [galaCount, setGalaCount] = useState([])
    const [showPieChart, setShowPieChart] = useState(true)

    const getGalaDataPoints = async () => {
        await axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-vertical-bat-plot-datapoints/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("gala data point res", res);
                setMonthYear(res.data.response.get_month_year)
                setGalaAreaSize(res.data.response.free_gala_area_size)
                setGalaCount(res.data.response.pie_chart_data_points)
                // setShowPieChart(res.data.response.show_pie_charts)
            })
            .catch((err) => {
                console.log("data point err", err)
            })
    }

    useEffect(() => {
        getGalaDataPoints()
    }, [navigate])



    return (
        <>
            <Grid container justifyContent={'center'} sx={gridStyles}>
                <Toolbar />
                <Toolbar />
                <Grid item lg={12} xs={12}>
                    <Grid item xl={12} lg={12}>
                        <h1>Dashboard</h1>
                    </Grid>
                    <Box sx={{
                        width: '100%',
                        // height: '100px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        // padding: '1em',

                    }}>

                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <Link to="/investors/investors_list">
                                <Paper sx={{
                                    width: '95%',
                                    padding: '1.5em 1.5rem',
                                    marginTop: "0.5em",
                                    background: 'linear-gradient(90deg,#ffbf96,#fe7096)',
                                    color: '#fff',
                                    position: 'relative'
                                }}>
                                    <Box>
                                        <img src="https://themewagon.github.io/purple-react/static/media/circle.953c9ca0.svg" alt="img" style={{ position: 'absolute', top: '0', right: '0', height: '100%' }} />
                                        <Typography component={'h4'} variant="h4" sx={{ fontWeight: 'bold' }}>{dashboardData && dashboardData.total_investor_count !== null ? dashboardData.total_investor_count : "0"}</Typography>
                                        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>Total Investor</Typography>
                                    </Box>
                                </Paper>
                            </Link>
                        </Grid>
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <Link to="/tenants">
                                <Paper sx={{
                                    width: '95%',
                                    padding: '1.5em 1.5rem',
                                    marginTop: "0.5em",
                                    background: 'linear-gradient(90deg,#90caf9,#047edf 99%)',
                                    color: '#fff',
                                    position: 'relative'
                                }}>
                                    <Box>
                                        <img src="https://themewagon.github.io/purple-react/static/media/circle.953c9ca0.svg" alt="img" style={{ position: 'absolute', top: '0', right: '0', height: '100%' }} />
                                        <Typography component={'h4'} variant="h4" sx={{ fontWeight: 'bold' }}>{dashboardData && dashboardData.total_rental_count !== null ? dashboardData.total_rental_count : "0"}</Typography>
                                        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>Total Rental</Typography>
                                    </Box>
                                </Paper>
                            </Link>
                        </Grid>
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <Link to="/farmers/farmers_list">
                                <Paper sx={{
                                    width: '95%',
                                    padding: '1.5em 1.5rem',
                                    marginTop: "0.5em",
                                    background: 'linear-gradient(90deg,#84d9d2,#07cdae)',
                                    color: '#fff',
                                    position: 'relative'
                                }}>
                                    <Box>
                                        <img src="https://themewagon.github.io/purple-react/static/media/circle.953c9ca0.svg" alt="img" style={{ position: 'absolute', top: '0', right: '0', height: '100%' }} />
                                        <Typography component={'h4'} variant="h4" sx={{ fontWeight: 'bold' }}>{dashboardData && dashboardData.total_farmer_count !== null ? dashboardData.total_farmer_count : "0"}</Typography>
                                        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>Total Farmer</Typography>
                                    </Box>
                                </Paper>
                            </Link>
                        </Grid>
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <Link to="/property/all_property">
                                <Paper sx={{
                                    width: '95%',
                                    padding: '1.5em 1.5rem',
                                    marginTop: "1em",
                                    background: 'linear-gradient(90deg,#84d9d2,#07cdae)',
                                    color: '#fff',
                                    position: 'relative'
                                }}>
                                    <Box>
                                        <img src="https://themewagon.github.io/purple-react/static/media/circle.953c9ca0.svg" alt="img" style={{ position: 'absolute', top: '0', right: '0', height: '100%' }} />
                                        <Typography component={'h4'} variant="h4" sx={{ fontWeight: 'bold' }}>{dashboardData && dashboardData.total_warehouse_count !== null ? dashboardData.total_warehouse_count : "0"}</Typography>
                                        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>Total Warehouse</Typography>
                                    </Box>
                                </Paper>
                            </Link>
                        </Grid>
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <Link to="/total_galas">
                                <Paper sx={{
                                    width: '95%',
                                    padding: '1.5em 1.5rem',
                                    marginTop: "1em",
                                    background: 'linear-gradient(90deg,#ff95ab,#e37619)',
                                    color: '#fff',
                                    position: 'relative'
                                }}>
                                    <Box>
                                        <img src="https://themewagon.github.io/purple-react/static/media/circle.953c9ca0.svg" alt="img" style={{ position: 'absolute', top: '0', right: '0', height: '100%' }} />
                                        <Typography component={'h4'} variant="h4" sx={{ fontWeight: 'bold' }}>{dashboardData && dashboardData.total_gala_count !== null ? dashboardData.total_gala_count : "0"}</Typography>
                                        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>Total Gala</Typography>
                                    </Box>
                                </Paper>
                            </Link>
                        </Grid>
                        <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                            <Link to="/total_remaining_galas">
                                <Paper sx={{
                                    width: '95%',
                                    padding: '1.5em 1.5rem',
                                    marginTop: "1em",
                                    background: 'linear-gradient(90deg,#ebd66e,#fed713)',
                                    color: '#fff',
                                    position: 'relative'
                                }}>
                                    <Box>
                                        <img src="https://themewagon.github.io/purple-react/static/media/circle.953c9ca0.svg" alt="img" style={{ position: 'absolute', top: '0', right: '0', height: '100%' }} />
                                        <Typography component={'h4'} variant="h4" sx={{ fontWeight: 'bold' }}>{dashboardData && dashboardData.total_remaining_gala_count !== null ? dashboardData.total_remaining_gala_count : "0"}</Typography>
                                        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "10px" }}>Total Remaining Gala </Typography>
                                    </Box>
                                </Paper>
                            </Link>
                        </Grid>
                    </Box>
                </Grid>

                <Grid item  lg={12} xs={12} sx={{ mt: 3 }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <Grid item xl={showPieChart === true ? 6 : 12} lg={showPieChart === true ? 6 : 12} md={12} sm={12} xs={12}>
                            <Paper sx={{ p: 2, width: '97%', height: "485px", mt: "1em" }}>
                                <Box sx={{ textAlign: "center" }}><h4> Gala Free Area Size</h4></Box>
                                <BarChart monthYear={monthYear} galaAreaSize={galaAreaSize} galaCount={galaCount} />
                            </Paper>
                        </Grid>
                        <Grid item xl={6} lg={6} md={12} sm={12} xs={12}  style={ showPieChart === true ? { display:'block'} : {display : 'none'} } >
                            <Paper sx={{ p: 3, width: '97%', height: "485px", mt: "1em" }}>
                                <Box sx={{ textAlign: "center", marginBottom: "10px" }}><h4>Total Gala Count</h4></Box>
                               <Box className="chart_div_box">
                               <PieChart galaCount={galaCount} showPieChart={showPieChart} />
                               </Box>
                            </Paper>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

