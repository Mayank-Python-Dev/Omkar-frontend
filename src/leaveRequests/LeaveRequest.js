import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
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
import { Grid, Toolbar, Button, Typography, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@mui/material/Modal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector, useDispatch } from 'react-redux';
import { setRowPerPageCount, setPageNumber } from '../redux/reducer';

const style = {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 450,
    bgcolor: 'background.paper',
    borderRadius: '5px',
    boxShadow: 24,
    pt: 3,
    pb: 3,
};


export default function LeaveRequest() {
    const pageNumber = useSelector((state)=> state.adminNotification.pageNumber)
    const rowPerPageCount = useSelector((state)=> state.adminNotification.rowPerPageCount)
    const dispatch = useDispatch()

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
            dispatch(setPageNumber(0))
        };
    
        const handleBackButtonClick = (event) => {
            onPageChange(event, page - 1);
            dispatch(setPageNumber(page - 1))
        };
    
        const handleNextButtonClick = (event) => {
            onPageChange(event, page + 1);
            dispatch(setPageNumber(page + 1))
        };
    
        const handleLastPageButtonClick = (event) => {
            onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
            dispatch(setPageNumber(Math.max(0, Math.ceil(count / rowsPerPage) - 1)))
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

    // ============ api functionality start ============
    const [page, setPage] = useState(pageNumber);
    const [rowsPerPage, setRowsPerPage] = useState(rowPerPageCount);
    const [leaveRequest, setLeaveRequest] = useState([])
    const [filterData, setFilterData] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [stateUpdate, setStateUpdate] = useState(false)
    const [loader, setLoader] = useState(true)

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - leaveRequest.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        dispatch(setPageNumber(newPage))
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);

        
        dispatch(setPageNumber(0))
        dispatch(setRowPerPageCount(parseInt(event.target.value, 10)))
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

    const getLeaveRequest = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-leave-request/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("leave request res", res.data.response)
                if (res) {
                    setLeaveRequest(res.data.response)
                    setFilterData(res.data.response)
                    setLoader(false)
                }
            })
            .catch((err) => {
                console.log("leave request err", err)
                setLoader(false)
            })
    }
    useEffect(() => {
        getLeaveRequest()
    }, [navigate, stateUpdate])

    const gridStyles = {
        padding: 3,
    };


    // **********search filter start********
    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        if (e.target.value.length > 0) {
            const searchData = leaveRequest.filter((val) => val.user.username.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            setLeaveRequest(searchData)
        } else {
            setLeaveRequest(filterData)
        }
    }
    // **********search filter end**********

    // *********** service status functionality **************
    let initialState = leaveRequest.map(() => false)

    const [isEdit, setIsEdit] = useState(initialState)
    const [statusValue, setStatusvalue] = useState("");
    const [userId, setUserId] = useState("")
    const [statusIndex, setStatusIndex] = useState("")
    const [statusLoader, setStatusLoader] = useState(false)

    const [open, setOpen] = React.useState(false);
    const cancleStatus = () => {
        setOpen(false)
        let a = [...isEdit]
        a[statusIndex] = false
        setIsEdit(a)
    }

    const handleEdit = (i) => {
        let a = [...isEdit]
        a[i] = true
        setIsEdit(a)
    }

    const handleStatusChange = (e, i, id) => {
        setOpen(true)
        setStatusvalue(e.target.value)
        setUserId(id)
        setStatusIndex(i)
    };

    const handleStatusUpdate = async () => {
        setOpen(false)

        let a = [...isEdit]
        a[statusIndex] = false
        setIsEdit(a)

        setStatusLoader(true)

        await axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-leave-request/${userId}/?company_type=${companyType}&status=${statusValue}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            // console.log("status res----", res.data)
            if (res) {
                setStatusvalue("")

                setTimeout(() => {
                    setStatusLoader(false)
                }, 500)

                setTimeout(() => {
                    setStateUpdate(!stateUpdate)
                }, 2000)

                toast.success('Status Updated Successfully', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }).catch((error) => {
            console.log("status error", error)
            setStatusLoader(false)
        })
    }

    // *********** service status functionality **************

    // =============Read more read less state===============
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    return (
        <>
            {statusLoader ? <div className="loader_wrap"><div className="loader"></div></div> : <div></div>}
            <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
                <Grid item lg={12} xs={12}>
                    <Toolbar />
                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                        <h1><span style={{ textTransform: "capitalize" }}>Leave Request</span></h1>
                        <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                    </Box>

                    <Paper variant="outlined" sx={{
                        padding: '1em',
                        width: '100%',
                        marginTop: "10px"
                    }}>
                        <Grid item lg={12} xs={12}>

                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="subtitle1" sx={{ fontSize: "20px" }} gutterBottom>Leave Request List</Typography>
                                <div className='search_field'>
                                    <SearchIcon />
                                    <input type="search" placeholder='Search here.....' value={searchTerm} onChange={(e) => handleSearch(e)} />
                                </div>
                            </Box>
                        </Grid>
                        <Grid item lg={12} xs={12}>
                            <TableContainer component={Paper} sx={{ marginTop: "15px" }}>

                                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>S. No.</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Rental Name</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Rental Email</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Rental Contact</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Number</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Warehouse Type</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Survey Number</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Warehouse Address</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Warehouse City / State</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Request Date</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Leave Reason</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Status</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            loader ?

                                                <TableRow>
                                                    <TableCell colSpan={10} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                        <CircularProgress />
                                                    </TableCell>
                                                </TableRow>
                                                :
                                                leaveRequest.length > 0 ?
                                                    (rowsPerPage > 0
                                                        ? leaveRequest.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        : leaveRequest
                                                    ).map((ele, i) => {
                                                        return (
                                                            <TableRow key={i}>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {page * rowsPerPage + i + 1}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.user.first_name}  {ele.user.last_name}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.user.email}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.user.phone}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.gala.gala_number} ({ele.gala.warehouse.property_name})
                                                                </TableCell>

                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.gala.warehouse.property_type}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.gala.warehouse.property_survey_number}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.gala.warehouse.address}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.gala.warehouse.city}/ {ele.gala.warehouse.state}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.created_at}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {isReadMore ? (ele.reason_for_leaving ? ele.reason_for_leaving.slice(0, 45) : '-') : (ele.reason_for_leaving ? ele.reason_for_leaving : '-')}
                                                                    {(ele.reason_for_leaving.length >= 45) ?
                                                                        <span onClick={toggleReadMore} className="read-or-hide">
                                                                            {isReadMore ? "...read more" : " show less"}
                                                                        </span>
                                                                        : <span></span>
                                                                    }
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                                        {
                                                                            !isEdit[i] ?
                                                                                <>
                                                                                    {(() => {
                                                                                        if (ele.status === "Pending") {
                                                                                            return (
                                                                                                <span className='pending'>{ele.status}</span>
                                                                                            )
                                                                                        }
                                                                                        if (ele.status === "Approved") {
                                                                                            return (
                                                                                                <span className='completed'>{ele.status}</span>
                                                                                            )
                                                                                        }
                                                                                        if (ele.status === "Reject") {
                                                                                            return (
                                                                                                <span className='reject'>{ele.status}</span>
                                                                                            )
                                                                                        }
                                                                                    })()}
                                                                                </>

                                                                                :
                                                                                <FormControl sx={{ minWidth: 120 }} className="custom_select_css">
                                                                                    <Select
                                                                                        value=""
                                                                                        onChange={(e) => handleStatusChange(e, i, ele.uid)}
                                                                                        displayEmpty
                                                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                                                        className="select_class"
                                                                                    >
                                                                                        <MenuItem value="">Select Status</MenuItem>
                                                                                        <MenuItem value="Pending">Pending</MenuItem>
                                                                                        <MenuItem value="Approved">Approved</MenuItem>
                                                                                        <MenuItem value="Reject">Reject</MenuItem>
                                                                                    </Select>
                                                                                </FormControl>
                                                                        }
                                                                        {
                                                                            ele.status === "Approved" ? " " : ele.status === "Reject" ? " " :
                                                                                <Tooltip title="Update Status" placement="top" className='custom_tooltip' arrow>
                                                                                    <Button variant="contained" onClick={() => handleEdit(i)} className='edit_service_btn'><FontAwesomeIcon icon={faPenToSquare} /></Button>
                                                                                </Tooltip>
                                                                        }


                                                                    </div>

                                                                </TableCell>

                                                            </TableRow>
                                                        )
                                                    })
                                                    :
                                                    <TableRow>
                                                        <TableCell colSpan={13} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                            No data found
                                                        </TableCell>
                                                    </TableRow>
                                        }

                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={13} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            {
                                                leaveRequest.length > 0 ?
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                        colSpan={13}
                                                        count={leaveRequest.length}
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
                <Modal
                    keepMounted
                    open={open}
                    // onClose={cancleStatus}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                    className='logout_modal'
                >
                    <Box sx={style} className="logout_modal_box">
                        <Typography id="keep-mounted-modal-description" sx={{ borderBottom: "1px solid #dbdbdb", px: 3, py: 2, mb: 3 }}>
                            Are you sure want to {statusValue} Request ?
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button variant="contained" className='modal_no_btn' onClick={cancleStatus} sx={{ mr: 2 }}>
                                No
                            </Button>
                            <Button variant="contained" onClick={handleStatusUpdate} sx={{ mr: 2 }}>
                                Yes
                            </Button>
                        </Box>
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
            </Grid>
        </>
    );
}



