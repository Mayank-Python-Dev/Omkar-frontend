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
import { Grid, Toolbar, Button, Typography, CircularProgress, ButtonGroup, Modal, Fade, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFileExcel, faFileCsv } from '@fortawesome/free-solid-svg-icons'
import { CSVLink } from "react-csv";
import { ExportToExcel } from '../../excelFile'
import jsPDF from "jspdf";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector, useDispatch } from 'react-redux';
import { setPageNumber, setRowPerPageCount } from '../../redux/reducer';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};

export default function Investors_list() {
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

    // =================api functionality start ==================
    const [page, setPage] = useState(pageNumber);
    const [rowsPerPage, setRowsPerPage] = useState(rowPerPageCount);
    const [investors, setInvestors] = useState([])
    const [filterData, setFilterData] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [fileData, setFileData] = useState([])
    const [pdfData, setPdfData] = useState([])
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - investors.length) : 0;

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
    // const router = useRouter()
    const navigate = useNavigate()

    const [loader, setLoader] = useState(true)
    const [investorUpdate, setInvestorUpdate] = useState(false)
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])

    const getInvestors = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-investor-list-with-company/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                // console.log("investors list res", res.data.response)
                if (res) {
                    setInvestors(res.data.response)
                    setFilterData(res.data.response)
                    setLoader(false)

                    for (let i = 0; i < res.data.response.length; i++) {
                        let obj = {}
                        obj['S No.'] = Number(i + 1)
                        obj['Investor Name'] = res.data.response[i].first_name + " " + res.data.response[i].last_name
                        obj['Phone Number'] = res.data.response[i].phone
                        obj['Address'] = res.data.response[i].address
                        obj['City'] = res.data.response[i].city
                        obj['Zip Code'] = res.data.response[i].zip_code
                        obj['Total Gala'] = res.data.response[i].total_galas == 0 ? "N/A" : res.data.response[i].total_galas
                        setFileData((a) => [...a, obj])
                    }
                    for (let i = 0; i < res.data.response.length; i++) {
                        let arr = []
                        arr[0] = Number(i + 1)
                        arr[1] = res.data.response[i].first_name + " " + res.data.response[i].last_name
                        arr[2] = res.data.response[i].phone
                        arr[3] = res.data.response[i].address
                        arr[4] = res.data.response[i].city
                        arr[5] = res.data.response[i].zip_code
                        arr[6] = res.data.response[i].total_galas == 0 ? "N/A" : res.data.response[i].total_galas
                        setPdfData((arg) => [...arg, arr])
                    }
                }
            })
            .catch((err) => {
                console.log("investors list err", err)
                setLoader(false)
            })
    }
    useEffect(() => {
        getInvestors()
    }, [navigate, investorUpdate])

    const gridStyles = {
        padding: 3,
    };


    // **********search filter start********
    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        if (e.target.value.length > 0) {
            const searchData = investors.filter((val) => val.username.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            setInvestors(searchData)
        } else {
            setInvestors(filterData)
        }
    }
    // **********search filter end**********

    //******** download pdf*********//
    const columns = [
        { header: "S.No." },
        { header: "Investor Name" },
        { header: "Phone Number" },
        { header: "Address" },
        { header: "City" },
        { header: "Zip Code" },
        { header: "Total Gala" }
    ]

    const downloadPdf = () => {
        const headerNames = columns.map((column) => column.header);

        const doc = new jsPDF()
        doc.text("Investor Details", 20, 10)
        doc.autoTable({
            head: [headerNames],
            body: pdfData,
        })
        doc.save('investor.pdf')
    }
    //******** download pdf*********//

    //*************Edit Investor Details Start**************//
    const [open, setOpen] = useState(false);
    const [statusLoader, setStatusLoader] = useState(false)


    const [editFirstName, setEditFirstName] = useState("")
    const [editLastName, setEditLastName] = useState("")
    const [editEmail, setEditEmail] = useState("")
    const [editPhoneNumber, setEditPhoneNumber] = useState("")
    const [editAddress, setEditAddress] = useState("")
    const [editCity, setEditCity] = useState("")
    const [editZipCode, setEditZipCode] = useState("")
    const [editBirthDate, setEditBirthDate] = useState("")
    const [investorId, setInvestorId] = useState("")



    const [firstNameErr, setFirstNameErr] = useState("")
    const [lastNameErr, setLastNameErr] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [phoneNumberErr, setPhoneNumberErr] = useState("")
    const [addressErr, setAddressErr] = useState("")
    const [cityErr, setCityErr] = useState("")
    const [zipCodeErr, setZipCodeErr] = useState("")
    const [birthDateErr, setBirthDateErr] = useState("")



    const handleClose = () => setOpen(false);

    const handleOpen = (e) => {
        setOpen(true)
        setEditFirstName(e.first_name)
        setEditLastName(e.last_name)
        setEditEmail(e.email)
        setEditPhoneNumber(e.phone)
        setEditAddress(e.address)
        setEditCity(e.city)
        setEditZipCode(e.zip_code)
        setEditBirthDate(e.birth_date)
        setInvestorId(e.user_uid)
    }

    useEffect(() => {
        setFirstNameErr("")
        setLastNameErr("")
        setEmailErr("")
        setPhoneNumberErr("")
        setAddressErr("")
        setCityErr("")
        setZipCodeErr("")
        setBirthDateErr("")

    }, [open])
    var spacePattern = /^$|^\S+.*/
    var aphabeticPattern = /^[a-zA-Z() ]+$/
    var emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

    const handleFirstName = (e) => {
        setEditFirstName(e.target.value)
        if (e.target.value === "") {
            setFirstNameErr("Required")
        } else if (!spacePattern.test(e.target.value)) {
            setFirstNameErr("Space not allowed")
        } else {
            setFirstNameErr("")
        }
    }

    const handleLastName = (e) => {
        setEditLastName(e.target.value)
        if (e.target.value === "") {
            setLastNameErr("Required")
        } else if (!spacePattern.test(e.target.value)) {
            setLastNameErr("Space not allowed")
        } else {
            setLastNameErr("")
        }
    }

    const handleEmail = (e) => {
        setEditEmail(e.target.value)

        if (e.target.value === "") {
            setEmailErr("Required")
        } else if (!spacePattern.test(e.target.value)) {
            setEmailErr("Space not allowed")
        } else if (!emailPattern.test(e.target.value)) {
            setEmailErr("Invalid email address")
        } else {
            setEmailErr("")
        }
    }

    const handleAddress = (e) => {
        setEditAddress(e.target.value)
        if (e.target.value === "") {
            setAddressErr("Required")
        } else if (!spacePattern.test(e.target.value)) {
            setAddressErr("Space not allowed")
        } else if (e.target.value.length < 3) {
            setAddressErr("Address should be minimun 3 characters or more")
        } else {
            setAddressErr("")
        }
    }

    const handlePhoneNumber = (e) => {
        setEditPhoneNumber(e.target.value)
        if (e.target.value === "") {
            setPhoneNumberErr("Required")
        } else if (!spacePattern.test(e.target.value)) {
            setPhoneNumberErr("Space not allowed")
        } else if (e.target.value.length < 10 || e.target.value.length > 10) {
            setPhoneNumberErr("PhoneNumber should be 10 digits")
        } else {
            setPhoneNumberErr("")
        }
    }

    const handleCity = (e) => {
        setEditCity(e.target.value)
        if (e.target.value === "") {
            setCityErr("Required")
        } else if (!spacePattern.test(e.target.value)) {
            setCityErr("Space not allowed")
        } else if (e.target.value.length < 3) {
            setCityErr("City should be minimun 3 characters or more")
        } else if (!aphabeticPattern.test(e.target.value)) {
            setCityErr("City should be contain only alphabetic value")
        } else {
            setCityErr("")
        }
    }

    const handleZipcode = (e) => {
        setEditZipCode(e.target.value)
        if (e.target.value === "") {
            setZipCodeErr("Required")
        } else if (!spacePattern.test(e.target.value)) {
            setZipCodeErr("Space not allowed")
        } else if (e.target.value.length < 6) {
            setZipCodeErr("Zip code should be minimun 6 digits")
        } else {
            setZipCodeErr("")
        }
    }

    const handleBirthDate = (e) => {
        setEditBirthDate(e.target.value)
        if (e.target.value === "") {
            setBirthDateErr("Required")
        } else {
            setBirthDateErr("")
        }
    }




    const handleUpdateInvestor = () => {
        if (editFirstName && editLastName && editEmail && editPhoneNumber && editAddress && editCity && editZipCode && editBirthDate) {
            setStatusLoader(true)
            let formData = new FormData()
            formData.append("first_name", editFirstName)
            formData.append("last_name", editLastName)
            formData.append("email", editEmail)
            formData.append("phone", editPhoneNumber)
            formData.append("address", editAddress)
            formData.append("city", editCity)
            formData.append("zip_code", editZipCode)
            formData.append("birth_date", editBirthDate)


            axios.put(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/update-investor-profile/${investorId}/`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then((res) => {
                    console.log("investor update res", res.data)
                    if (res) {

                        setTimeout(() => {
                            setStatusLoader(false)
                            setOpen(false)
                        }, 700)

                        setTimeout(() => {
                            setInvestorUpdate(!investorUpdate)
                        }, 2200)

                        toast.success('Investor Update Successfully', {
                            position: "top-center",
                            autoClose: 2200,
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
                    console.log("investor update err", err)
                    setStatusLoader(false)
                    if (err.response.data.response.email) {
                        setEmailErr("user with this email already exists")
                    } else {
                        setEmailErr("")
                    }
                    if (err.response.data.response.phone) {
                        setPhoneNumberErr("user with this phone already exists")
                    } else {
                        setPhoneNumberErr("")
                    }
                })
        }
    }


    //*************Edit Investor Details End**************//

    return (
        <>
            {statusLoader ? <div className="loader_wrap"><div className="loader"></div></div> : <div></div>}
            <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Toolbar />
                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                        <h1>Investors</h1>
                       <Box>
                       <Button variant="contained" onClick={() => navigate(-1)} sx={{ marginTop: "8px", marginRight: "20px", marginRight: "20px" }}><ArrowBackIcon />Back</Button>
                        <Link to="/investors/addInvestors"><Button variant="contained" style={{marginTop: "8px", fontWeight: "bold" }}><AddIcon /> Add Investor</Button></Link>
                       </Box>
                    </Box>

                    <Paper variant="outlined" sx={{
                        padding: '1em 0em',
                        width: '100%',
                        marginTop: "20px"
                    }}>
                        <Grid item lg={12} xs={12}>
                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 2, px: "1em", pb: "1em", borderBottom: "1px solid #8080802e" }}>
                                <Typography variant="subtitle1" sx={{ fontSize: "20px" }} gutterBottom>Investors List</Typography>
                                <ButtonGroup variant="contained" aria-label="outlined secondary button group" className='buttonGroup'>
                                    <Button onClick={downloadPdf}><FontAwesomeIcon icon={faFilePdf} />&nbsp; PDF</Button>
                                    <Button><CSVLink data={fileData} filename={"investors_list.csv"}><FontAwesomeIcon icon={faFileCsv} />&nbsp; CSV</CSVLink></Button>
                                    <Button><FontAwesomeIcon icon={faFileExcel} />&nbsp; <ExportToExcel details={fileData} fileName="Investor List" /></Button>
                                </ButtonGroup>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", px: "1em", }}>
                                <div className='search_field'>
                                    <SearchIcon />
                                    <input type="search" placeholder='Search .....' value={searchTerm} onChange={(e) => handleSearch(e)} />
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} sx={{ mt: 2, px: "1em" }}>
                            <TableContainer component={Paper}>

                                <Table aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>S. No.</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Investor Name</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Phone Number</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Address</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>City</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Zip Code</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Total Galas</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Total Rentals</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Remaining Galas</StyledTableCell>
                                            <StyledTableCell>Action</StyledTableCell>
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
                                                investors.length > 0 ?
                                                    (rowsPerPage > 0
                                                        ? investors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        : investors
                                                    ).map((e, i) => {
                                                        return (
                                                            <TableRow key={i} hover>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {page * rowsPerPage + i + 1}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.first_name} {e.last_name}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.phone}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.address}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.city}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.zip_code}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.total_galas == 0 ? "N/A" : e.total_galas}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    <Link to={`/investors/investors_list/rental_details/${e.user_uid}`} style={{ textDecoration: "none" }} className="btn_link">
                                                                        <span className='count'>{e.total_rentals == null ? "0" : e.total_rentals}</span><Button variant="contained" style={{ textTransform: "capitalize", marginLeft: "10px" }}> View</Button>
                                                                    </Link>
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    <Link to={`/investors/investors_list/gala_details/${e.user_uid}`} style={{ textDecoration: "none" }} className="btn_link">
                                                                        <span className='count'>{e.total_remaining_galas}</span><Button variant="contained" style={{ textTransform: "capitalize", marginLeft: "10px" }}> View</Button>
                                                                    </Link>
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    <Button variant="contained" onClick={() => handleOpen(e)} style={{ textTransform: "capitalize" }}>Edit</Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                    :
                                                    <TableRow>
                                                        <TableCell colSpan={10} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                            No data found
                                                        </TableCell>
                                                    </TableRow>

                                        }

                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={9} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            {
                                                investors.length > 0 ?
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                        colSpan={12}
                                                        count={investors.length}
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
            <Modal
                open={open}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
                keepMounted
                className='renew_contract_modal'
            >
                <Fade in={open}>
                    <Box sx={style} className="contract_modal_form">
                        <Typography id="transition-modal-title" variant="h5" component="h2" sx={{ mb: 1 }}>
                            Edit Investor Details
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>First Name</h4>
                                <TextField value={editFirstName} onChange={handleFirstName} sx={{ width: "100%", p: 1 }} />
                                {firstNameErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{firstNameErr}</p> : ""}
                            </Grid>

                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Last Name</h4>
                                <TextField value={editLastName} onChange={handleLastName} sx={{ width: "100%", p: 1 }} />
                                {lastNameErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{lastNameErr}</p> : ""}
                            </Grid>

                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Email</h4>
                                <TextField value={editEmail} onChange={handleEmail} type="email" sx={{ width: "100%", p: 1 }} />
                                {emailErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{emailErr}</p> : ""}
                            </Grid>

                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Phone Number</h4>
                                <TextField value={editPhoneNumber} type="number" onChange={handlePhoneNumber} sx={{ width: "100%", p: 1 }} />
                                {phoneNumberErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{phoneNumberErr}</p> : ""}
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Address</h4>
                                <TextField value={editAddress} onChange={handleAddress} sx={{ width: "100%", p: 1 }} />
                                {addressErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{addressErr}</p> : ""}
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>City</h4>
                                <TextField value={editCity} onChange={handleCity} sx={{ width: "100%", p: 1 }} />
                                {cityErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{cityErr}</p> : ""}
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Zip Code</h4>
                                <TextField value={editZipCode} onChange={handleZipcode} sx={{ width: "100%", p: 1 }} type="number" />
                                {zipCodeErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{zipCodeErr}</p> : ""}
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Birth Date</h4>
                                <TextField value={editBirthDate} onChange={handleBirthDate} sx={{ width: "100%", p: 1 }} type="date" />
                                {birthDateErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{birthDateErr}</p> : ""}
                            </Grid>
                            <Grid xs={12} sm={12} item>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                                    <Button variant="contained" onClick={handleClose} sx={{ minWidth: "100px", fontSize: "1rem", mr: 2 }} className='modal_no_btn'>Cancel</Button>
                                    <Button variant="contained" onClick={handleUpdateInvestor} sx={{ minWidth: "100px", fontSize: "1rem" }}>Update</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>
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
    );
}



