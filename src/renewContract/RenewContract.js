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
import { Grid, Toolbar, Button, Typography, CircularProgress, TextField, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';
import FormControl from '@mui/material/FormControl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@mui/material/Modal';
import { useForm } from 'react-hook-form'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector, useDispatch } from 'react-redux';
import { setPageNumber, setRowPerPageCount } from '../redux/reducer';

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

const renewstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 900,
    bgcolor: 'background.paper',
    borderRadius: '5px',
    boxShadow: 24,
    p: 3,
};

export default function RenewContract() {
    const pageNumber = useSelector((state) => state.adminNotification.pageNumber)
    const rowPerPageCount = useSelector((state) => state.adminNotification.rowPerPageCount)
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
    // ============= api functionality start =============
    const [page, setPage] = useState(pageNumber);
    const [rowsPerPage, setRowsPerPage] = useState(rowPerPageCount);
    const [renewContractData, setRenewContractData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [stateUpdate, setStateUpdate] = useState(false)
    const [loader, setLoader] = useState(true)

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - renewContractData.length) : 0;

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

    const getRenewContractData = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-renew-request/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("renew request res", res.data.response)
                if (res) {
                    setRenewContractData(res.data.response)
                    setFilterData(res.data.response)
                    setLoader(false)
                }
            })
            .catch((err) => {
                console.log("renew request err", err)
                setLoader(false)
            })
    }
    useEffect(() => {
        getRenewContractData()
    }, [navigate, stateUpdate])

    const gridStyles = {
        padding: 3,
    };


    // **********search filter start********
    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        if (e.target.value.length > 0) {
            const searchData = renewContractData.filter((val) => val.renew_user.username.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            setRenewContractData(searchData)
        } else {
            setRenewContractData(filterData)
        }
    }
    // **********search filter end**********

    //************contract renew modal************/
    const [openContract, setOpenContract] = React.useState(false);

    // *********** service status functionality **************
    let initialState = renewContractData.map(() => false)

    const [isEdit, setIsEdit] = useState(initialState)
    const [statusValue, setStatusvalue] = useState("");
    const [userId, setUserId] = useState("")
    const [statusIndex, setStatusIndex] = useState("")
    const [statusLoader, setStatusLoader] = useState(false)
    const [renewContractDetail, setRenewContractDetail] = useState()

    const [agreementStartDate, setAgreementStartDate] = useState("")
    const [agreementEndDate, setAgreementEndDate] = useState("")
    const [gharpattiStartDate, setGharpattiStartDate] = useState("")
    const [gharpattiEndDate, setGharpattiEndDate] = useState("")
    const [agreementDocRenew, setAgreementDocRenew] = useState("")
    const [gharpattiDocRenew, setGharpattiDocRenew] = useState("")

    const [lockingPeriod, setLockingPeriod] = useState("none");
    const [showPlaceholder, setShowPlaceholder] = useState(lockingPeriod === "none");
    const [lockingPeriodCount, setLockingPeriodCount] = useState("")
    const [renewUserUid, setRenewUserUid] = useState("")

    useEffect(() => {
        // let count = Number(agreementEndDate && agreementEndDate.split("-").shift()) - Number(agreementStartDate && agreementStartDate.split("-").shift())

        let startDate = new Date(agreementStartDate)
        let startYear = startDate.getFullYear()

        let endDate = new Date(agreementEndDate)
        let endYear = endDate.getFullYear()

        let count = endYear - startYear - 1
        setLockingPeriodCount(count)

    }, [agreementStartDate, agreementEndDate])


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

    const handleStatusChange = (e, i, contractDetail, renewId, renew_user_uid) => {
        setOpen(true)
        setStatusvalue(e.target.value)
        setUserId(renewId)
        setStatusIndex(i)
        setRenewContractDetail(contractDetail)
        setRenewUserUid(renew_user_uid)
    };

    const handleStatusUpdate = async () => {
        setOpen(false)

        let a = [...isEdit]
        a[statusIndex] = false
        setIsEdit(a)

        if (statusValue === "Approved") {
            setOpenContract(true)
        }

        if (statusValue === "Reject") {

            let formData = new FormData()
            formData.append("status", statusValue)

            axios.put(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/update-rental-contract/${renewContractDetail.uid}/${userId}/`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
                .then((res) => {
                    console.log("renew request res", res.data.response)
                    setTimeout(() => {
                        setStatusLoader(false)
                    }, 500)

                    setStatusvalue("")

                    setTimeout(() => {
                        setStateUpdate(!stateUpdate)
                    }, 2000)

                    toast.success('Status Reject Successfully', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });

                })
                .catch((err) => {
                    console.log("renew request err", err)
                })
        }
    }

    const cancleContract = () => {
        setOpenContract(false)
    }
    // *********** service status functionality **************
    const [agreementStartDateErr, setAgreementStartDateErr] = useState("")
    const [agreementEndDateErr, setAgreementEndDateErr] = useState("")
    const [gharpattiStartDateErr, setGharpattiStartDateErr] = useState("")
    const [gharpattiEndDateErr, setGharpattiEndDateErr] = useState("")
    const [agreementDocRenewErr, setAgreementDocRenewErr] = useState("")
    const [gharpattiDocRenewErr, setGharpattiDocRenewErr] = useState("")
    const [lockingErr, setLockingErr] = useState("")

    useEffect(() => {
        setAgreementStartDateErr("")
        setAgreementEndDateErr("")
        setGharpattiStartDateErr("")
        setGharpattiEndDateErr("")
        setAgreementDocRenewErr("")
        setGharpattiDocRenewErr("")
    }, [openContract])

    const handleLockingPeriod = (e) => {
        setLockingPeriod(e.target.value)
        if (e.target.value === "none") {
            setLockingErr("Required")
        } else {
            setLockingErr("")
        }
    }

    const handleAgreementDocRenew = (e) => {
        setAgreementDocRenew(e.target.files[0])
        if (e.target.files[0].name.split(".").pop() !== "pdf") {
            setAgreementDocRenewErr("Only pdf allow")
        } else {
            setAgreementDocRenewErr("")
        }
    }

    const handleGharPattiDocRenew = (e) => {
        setGharpattiDocRenew(e.target.files[0])
        if (e.target.files[0].name.split(".").pop() !== "pdf") {
            setGharpattiDocRenewErr("Only pdf allow")
        } else {
            setGharpattiDocRenewErr("")
        }
    }

    const handleAgreementStartDate = (e) => {
        setAgreementStartDate(e.target.value)
        if (e.target.value == "") {
            setAgreementStartDateErr("Required")
        } else {
            setAgreementStartDateErr("")
        }
    }

    const handleAgreementEndDate = (e) => {
        setAgreementEndDate(e.target.value)
        if (e.target.value == "") {
            setAgreementEndDateErr("Required")
        } else if (e.target.value <= agreementStartDate) {
            setAgreementEndDateErr("Agreement end date should be greater than agreement start date")
        }
        else {
            setAgreementEndDateErr("")
        }
    }

    const handleGharPattiStartDate = (e) => {
        setGharpattiStartDate(e.target.value)
        if (e.target.value == "") {
            setGharpattiStartDateErr("Required")
        } else {
            setGharpattiStartDateErr("")
        }
    }

    const handleGharPattiEndDate = (e) => {
        setGharpattiEndDate(e.target.value)
        if (e.target.value == "") {
            setGharpattiEndDateErr("Required")
        } else if (e.target.value <= gharpattiStartDate) {
            setGharpattiEndDateErr(" Gharpatti end date should be greater than gharpatti start date")
        } else {
            setGharpattiEndDateErr("")
        }
    }


    const handleUpdateContract = () => {

        if (!agreementDocRenew) {
            setAgreementDocRenewErr("Required")
        } else {
            setAgreementDocRenewErr("")
        }

        if (!gharpattiDocRenew) {
            setGharpattiDocRenewErr("Required")
        } else {
            setGharpattiDocRenewErr("")
        }

        if (!agreementStartDate) {
            setAgreementStartDateErr("Required")
        } else {
            setAgreementStartDateErr("")
        }

        if (!agreementEndDate) {
            setAgreementEndDateErr("Required")
        } else {
            setAgreementEndDateErr("")
        }

        if (!gharpattiStartDate) {
            setGharpattiStartDateErr("Required")
        } else {
            setGharpattiStartDateErr("")
        }

        if (!gharpattiEndDate) {
            setGharpattiEndDateErr("Required")
        } else {
            setGharpattiEndDateErr("")
        }

        if (lockingPeriod === "none") {
            setLockingErr("Required")
        } else {
            setLockingErr("")
        }

        if (agreementStartDate && agreementEndDate && agreementDocRenew && gharpattiDocRenew && gharpattiStartDate && gharpattiEndDate && lockingPeriod) {
            setStatusLoader(true)

            let formData = new FormData()
            formData.append("agreement_valid_start_date", agreementStartDate)
            formData.append("agreement_valid_end_date", agreementEndDate)
            formData.append("agreement_valid_doc", agreementDocRenew)
            formData.append("ghar_patti_doc", gharpattiDocRenew)
            formData.append("ghar_patti_start_date", gharpattiStartDate)
            formData.append("ghar_patti_end_date", gharpattiEndDate)
            formData.append("status", statusValue)
            formData.append("locking_period", lockingPeriod.toString())

            axios.put(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/update-rental-contract/${renewContractDetail.uid}/${userId}/`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
                .then((res) => {
                    console.log("renew request res", res.data.response)
                    if (res) {
                        setTimeout(() => {
                            setStatusLoader(false)
                            setOpenContract(false)
                        }, 500)

                        setStatusvalue("")

                        setTimeout(() => {
                            setStateUpdate(!stateUpdate)
                            navigate(`/tenants/${renewUserUid}`)
                        }, 2000)

                        toast.success('Contract Renew Successfully', {
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
                })
                .catch((err) => {
                    console.log("renew request err", err)
                    setStatusLoader(false)
                })
        }
    }


    return (
        <>
            {statusLoader ? <div className="loader_wrap"><div className="loader"></div></div> : <div></div>}
            <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
                <Grid item lg={12} xs={12}>
                    <Toolbar />
                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                        <h1><span style={{ textTransform: "capitalize" }}>Renew Contract</span></h1>
                        <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon /> Back</Button>
                    </Box>
                    <Paper variant="outlined" sx={{
                        padding: '1em',
                        width: '100%',
                        marginTop: "10px"
                    }}>
                        <Grid item lg={12} xs={12}>
                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="subtitle1" sx={{ fontSize: "20px" }} gutterBottom>Renew Contract List</Typography>
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
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Number</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Warehouse Name</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Request Date</StyledTableCell>
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
                                                renewContractData.length > 0 ?
                                                    (rowsPerPage > 0
                                                        ? renewContractData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        : renewContractData
                                                    ).map((ele, i) => {
                                                        return (
                                                            <TableRow key={i}>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {page * rowsPerPage + i + 1}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.renew_user.first_name}  {ele.renew_user.last_name}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.renew_user.email}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.renew_gala.gala_number}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.renew_gala.warehouse.property_name}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {ele.renew_created_at}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                                        {
                                                                            !isEdit[i] ?
                                                                                <>
                                                                                    {(() => {
                                                                                        if (ele.renew_status === "Pending") {
                                                                                            return (
                                                                                                <span className='pending'>{ele.renew_status}</span>
                                                                                            )
                                                                                        }
                                                                                        if (ele.renew_status === "Approved") {
                                                                                            return (
                                                                                                <span className='completed'>{ele.renew_status}</span>
                                                                                            )
                                                                                        }
                                                                                        if (ele.renew_status === "Reject") {
                                                                                            return (
                                                                                                <span className='reject'>{ele.renew_status}</span>
                                                                                            )
                                                                                        }
                                                                                    })()}
                                                                                </>

                                                                                :
                                                                                <FormControl sx={{ minWidth: 120 }} className="custom_select_css">
                                                                                    <Select
                                                                                        value=""
                                                                                        onChange={(e) => handleStatusChange(e, i, ele.contract_details, ele.renew_uid, ele.renew_user.user_uid)}
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
                                                                            ele.renew_status === "Approved" ? " " : ele.renew_status === "Reject" ? " " :
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
                                                renewContractData.length > 0 ?
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                        colSpan={13}
                                                        count={renewContractData.length}
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
                {/* =================confirm modal======================= */}
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
                {/* =================contract renew modal======================= */}
                <Modal
                    keepMounted
                    open={openContract}
                    // onClose={cancleContract}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                    className='renew_contract_modal'
                >
                    <Box sx={renewstyle} className="contract_modal_form">
                        <Typography variant="subtitle1" sx={{ fontSize: "25px", fontWeight: "500" }} gutterBottom>Contract Renew with Rental</Typography>
                        <form>
                            <Grid container spacing={1}>
                                <Grid xs={12} sm={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Owner</h4>
                                    <TextField value={renewContractDetail ? renewContractDetail.owner : " "} sx={{ width: "100%", p: 1 }} className="renew_contract_input" />
                                </Grid>

                                <Grid xs={12} sm={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Warehouse</h4>
                                    <TextField value={renewContractDetail ? renewContractDetail.warehouse : " "} sx={{ width: "100%", p: 1 }} className="renew_contract_input" />
                                </Grid>

                                <Grid xs={12} sm={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Gala</h4>
                                    <TextField value={renewContractDetail ? renewContractDetail.gala : " "} sx={{ width: "100%", p: 1 }} className="renew_contract_input" />
                                </Grid>

                                <Grid xs={12} sm={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Rental</h4>
                                    <TextField value={renewContractDetail ? renewContractDetail.rental : " "} sx={{ width: "100%", p: 1 }} className="renew_contract_input" />
                                </Grid>

                                <Grid xs={12} sm={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Upload Agreement Document</h4>
                                    <a href={renewContractDetail && renewContractDetail.agreement_valid_doc} target="_blank" style={{ fontSize: "13px", color: "#1976d2", paddingLeft: "10px", textDecoration: "underline" }}>Previous agreement document</a>
                                    <input type="file"
                                        className="renew_contract_date_input"
                                        style={{ fontSize: "auto" }}
                                        onChange={handleAgreementDocRenew}
                                    /><br></br>
                                    {agreementDocRenewErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{agreementDocRenewErr}</p> : ""}
                                </Grid>

                                <Grid xs={12} sm={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Upload GharPatti Document</h4>
                                    <a href={renewContractDetail && renewContractDetail.ghar_patti_doc} target="_blank" style={{ fontSize: "13px", color: "#1976d2", paddingLeft: "10px", textDecoration: "underline" }}>Previous gharpatti document</a>
                                    <input type="file"
                                        className="renew_contract_date_input"
                                        style={{ fontSize: "auto" }}
                                        onChange={handleGharPattiDocRenew}
                                    /><br></br>
                                    {gharpattiDocRenewErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{gharpattiDocRenewErr}</p> : ""}
                                </Grid>

                                <Grid xs={12} sm={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Agreement Start Date</h4>
                                    <input type="date"
                                        // value={renewContractDetail && agreementStartDate}
                                        className="renew_contract_date_input"
                                        onChange={handleAgreementStartDate}
                                    /><br></br>
                                    {agreementStartDateErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{agreementStartDateErr}</p> : ""}
                                </Grid>

                                <Grid xs={12} sm={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Agreement End Date </h4>
                                    <input type="date"
                                        // value={renewContractDetail && agreementEndDate}
                                        className="renew_contract_date_input"
                                        onChange={handleAgreementEndDate}
                                    /><br></br>
                                    {agreementEndDateErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{agreementEndDateErr}</p> : ""}
                                </Grid>

                                <Grid xs={12} sm={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>GharPatti Start Date</h4>
                                    <input type="date"
                                        // value={renewContractDetail && gharpattiStartDate}
                                        className="renew_contract_date_input"
                                        onChange={handleGharPattiStartDate}
                                    /><br></br>
                                    {gharpattiStartDateErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{gharpattiStartDateErr}</p> : ""}
                                </Grid>

                                <Grid xs={12} sm={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>GharPatti End Date</h4>
                                    <input type="date"
                                        // value={renewContractDetail && gharpattiEndDate}
                                        className="renew_contract_date_input"
                                        onChange={handleGharPattiEndDate}
                                    /><br></br>
                                    {gharpattiEndDateErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{gharpattiEndDateErr}</p> : ""}
                                </Grid>

                                <Grid xs={12} sm={6} item>

                                    <h4 style={{ fontWeight: "500", marginLeft: "12px", paddingBottom: "8px" }}>Locking Period (Year<span style={{ color: "red" }}>*</span> )</h4>
                                    <Select
                                        value={lockingPeriod}
                                        onChange={handleLockingPeriod}
                                        onFocus={(e) => setShowPlaceholder(false)}
                                        onClose={(e) => setShowPlaceholder(e.target.value === undefined)}
                                        sx={{ width: "97%", marginLeft: "7px" }}

                                    >
                                        <MenuItem value="none">Select Locking Period</MenuItem>
                                        {lockingPeriodCount > 0 ?
                                            Array(lockingPeriodCount).fill("").map((e, i) => {
                                                return (
                                                    <MenuItem value={i + 1} key={i}>{i + 1}</MenuItem>
                                                )
                                            }) : ""
                                        }
                                    </Select>
                                    {lockingErr ? <p style={{ fontSize: "0.75rem", color: "#d32f2f", marginLeft: "14px", marginTop: "3px" }}>{lockingErr}</p> : ""}

                                </Grid>

                                <Grid xs={12} sm={12} item>
                                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                                        <Button variant="contained" onClick={cancleContract} sx={{ minWidth: "100px", fontSize: "1rem", mr: 2 }} className='modal_no_btn'>Cancel</Button>
                                        <Button variant="contained" onClick={handleUpdateContract} sx={{ minWidth: "100px", fontSize: "1rem" }}>Renew</Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
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










