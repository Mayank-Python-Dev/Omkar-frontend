import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Grid, Toolbar, Typography, CircularProgress, Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationUpdate } from '../redux/reducer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };


    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};



export default function CustomPaginationActionsTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [notifications, setNotifications] = useState([])
    const [loader, setLoader] = useState(true)
    const [stateUpdate, setStateUpdate] = useState(false)
    const dispatch = useDispatch()
    const notificationState = useSelector((state) => state.adminNotification.notificationUpdate)


    // Avoid a layout jump when reaching the last page with empty rows.

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - notifications.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const accessToken = Cookies.get("accessToken")
    const companyType = Cookies.get("companyName")
    const navigate = useNavigate()

    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])


    // ********* get notifiaction function start ***********
    let socket = new WebSocket(`ws://127.0.0.1:8000/ws/room/${companyType}`);
    useEffect(() => {
        socket.onopen = function (e) {
            // console.log("[open] Connection established", e);
        };

        socket.onmessage = function (event) {
            var getJson = JSON.parse(event.data);
            console.log(getJson.payload)
            setNotifications(getJson.payload.data)
            setLoader(false)
        };

        socket.onerror = function (error) {
            console.log(error);
        };
    }, [])
    // ********* get notifiaction function end ***********

    // ********* update notifiaction function start ***********
    const handleClick = (uid) => {

        let payload = JSON.stringify({
            "uid": uid,
            "company_name": companyType
        })
        socket.send(payload);

        socket.onmessage = function (event) {
            var getJson = JSON.parse(event.data);
            console.log(getJson.payload)
            setNotifications(getJson.payload.data)
            setLoader(false)
        };
        dispatch(setNotificationUpdate(!notificationState))
    }
    // ********* update notifiaction function end ***********

    const gridStyles = {
        padding: 3,
    };
    return (

        <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
            <Grid item lg={12} xs={12}>
                <Toolbar />
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                    <h1>Notifications</h1>
                    <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                </Box>
                <Paper variant="outlined" sx={{
                    padding: '1em 0em',
                    width: '100%',
                    mt: 2
                }}>

                    <Grid item lg={12} xs={12} sx={{ mt: 2, px: "1em" }}>
                        <TableContainer component={Paper} className="custom_accordian_style">

                            <Table aria-label="custom pagination table" id='divToPrint' >

                                <TableBody>
                                    {
                                        loader ?

                                            <TableRow>
                                                <TableCell colSpan={5} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                    <CircularProgress />
                                                </TableCell>
                                            </TableRow>

                                            :
                                            notifications.length > 0 ?
                                                (rowsPerPage > 0
                                                    ? notifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    : notifications
                                                ).map((e, i) => {
                                                    return (
                                                        <TableRow key={i} hover>

                                                            <TableCell component="th" scope="row" className={e.status === "Leave_Gala" && e.is_seen === true ? 'trow_leave' : e.status === "Service_Gala" && e.is_seen === true ? 'trow_service' : e.status === "Renew_Gala" && e.is_seen === true ? 'trow_renew' : 'trow_uncheck'} sx={{ borderBottom: "1px solid #d3d3d3", padding: "10px 16px" }}>
                                                                <Accordion className={e.status === "Leave_Gala" && e.is_seen === true ? 'according_main_leave' : e.status === "Service_Gala" && e.is_seen === true ? 'according_main_service' : e.status === "Renew_Gala" && e.is_seen === true ? 'according_main_renew' : 'according_main_uncheck'} onClick={() => handleClick(e.uid)}>
                                                                    <AccordionSummary
                                                                        expandIcon={<ExpandMoreIcon />}
                                                                        aria-controls="panel1a-content"
                                                                        id="panel1a-header"
                                                                        className='accordian_head'
                                                                    >
                                                                        <Typography className='title'><span><EmailIcon className='mail_icon' />{e.is_seen === true ? <CheckIcon className='check_icon' /> : ""}</span> {e.status} {e.sub_service_name !== "" ? <span>&#40; {e.sub_service_name} &#41;</span> : ""}</Typography>
                                                                        <p>{e.get_date_time}</p>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails style={{ marginLeft: "25px" }}>
                                                                        <Typography style={{ color: '#7e7979' }}>
                                                                            {e.message}
                                                                        </Typography>
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            </TableCell>

                                                        </TableRow>
                                                    )
                                                })
                                                :
                                                <TableRow>
                                                    <TableCell style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                        No Notifications
                                                    </TableCell>
                                                </TableRow>
                                    }

                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={4} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow style={{ background: "white" }}>
                                        {
                                            notifications.length > 0 ?
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                    colSpan={12}
                                                    count={notifications.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    SelectProps={{
                                                        inputProps: {
                                                            'aria-label': 'rows per page',
                                                        },
                                                        native: true,
                                                    }}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                    ActionsComponent={TablePaginationActions}
                                                />
                                                : ""
                                        }
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}







