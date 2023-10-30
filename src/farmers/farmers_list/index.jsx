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
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFileExcel, faFileCsv } from '@fortawesome/free-solid-svg-icons'
import { CSVLink } from 'react-csv';
import { ExportToExcel } from '../../excelFile';
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

export default function FarmersList() {
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

    // ===============api functionality start =================
    const [page, setPage] = useState(pageNumber);
    const [rowsPerPage, setRowsPerPage] = useState(rowPerPageCount);
    const [farmers, setFarmers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterData, setFilterData] = useState([])
    const [loader, setLoader] = useState(true)
    const [fileData, setFileData] = useState([])
    const [pdfData, setPdfData] = useState([])

    const [farmerUpdate, setFarmerUpdate] = useState(false)
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - farmers.length) : 0;

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
    const getFarmers = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-farmer-list/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                // console.log("farmers res", res.data.response)
                if (res) {
                    console.log(res.data.response);
                    setFarmers(res.data.response)
                    setFilterData(res.data.response)
                    setLoader(false)

                    for (let i = 0; i < res.data.response.length; i++) {
                        let obj = {}
                        obj['S No.'] = Number(i + 1)
                        obj['Farmer Name'] = res.data.response[i].first_name + " " + res.data.response[i].last_name
                        obj['Phone Number'] = res.data.response[i].phone
                        obj['Address'] = res.data.response[i].address
                        obj['Birth Date'] = res.data.response[i].birth_date
                        setFileData((a) => [...a, obj])
                    }
                    for (let i = 0; i < res.data.response.length; i++) {
                        let arr = []
                        arr[0] = Number(i + 1)
                        arr[1] = res.data.response[i].first_name + " " + res.data.response.last_name
                        arr[2] = res.data.response[i].phone
                        arr[3] = res.data.response[i].address;
                        arr[4] = res.data.response[i].birth_date
                        setPdfData((arg) => [...arg, arr])
                    }
                }
            })
            .catch((err) => {
                console.log("farmers err", err)
                setLoader(false)
            })
    }
    useEffect(() => {
        getFarmers()
    }, [navigate, farmerUpdate])


    const gridStyles = {
        padding: 3,
    };

    // ****** search filter start******
    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        if (e.target.value.length > 0) {
            const searchData = farmers.filter((val) => val.username.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            setFarmers(searchData)
        } else {
            setFarmers(filterData)
        }
    }
    // ****** search filter end******

    //******** download pdf*********//
    const columns = [
        { header: "S.No." },
        { header: "Farmer Name" },
        { header: "Phone Number" },
        { header: "Address" },
        { header: "Birth Date" },

    ]

    const downloadPdf = () => {
        const headerNames = columns.map((column) => column.header);

        const doc = new jsPDF()
        doc.text("Farmers Details", 20, 10)
        doc.autoTable({
            head: [headerNames],
            body: pdfData,
        })
        doc.save('farmers.pdf')
    }
    //******** download pdf*********//

    //*************Edit Farmer Detail Start **************//
    const [open, setOpen] = useState(false);
    const [statusLoader, setStatusLoader] = useState(false)

    const [editFirstName, setEditFirstName] = useState("")
    const [editLastName, setEditLastName] = useState("")
    const [editPhoneNumber, setEditPhoneNumber] = useState("")
    const [editAddress, setEditAddress] = useState("")
    const [editBirthDate, setEditBirthDate] = useState("")
    const [farmerId, setFarmerId] = useState("")

    const [firstNameErr, setFirstNameErr] = useState("")
    const [lastNameErr, setLastNameErr] = useState("")
    const [phoneNumberErr, setPhoneNumberErr] = useState("")
    const [addressErr, setAddressErr] = useState("")
    const [birthDateErr, setBirthDateErr] = useState("")

    const handleClose = () => setOpen(false);

    const handleOpen = (e) => {
        setOpen(true)
        setEditFirstName(e.first_name)
        setEditLastName(e.last_name)
        setEditPhoneNumber(e.phone)
        setEditAddress(e.address)
        setEditBirthDate(e.birth_date)
        setFarmerId(e.user_uid)
    }

    useEffect(() => {
        setFirstNameErr("")
        setLastNameErr("")
        setPhoneNumberErr("")
        setAddressErr("")
        setBirthDateErr("")

    }, [open])

    var spacePattern = /^$|^\S+.*/
    var aphabeticPattern = /^[a-zA-Z() ]+$/

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

    const handleBirthDate = (e) => {
        setEditBirthDate(e.target.value)
        if (e.target.value === "") {
            setBirthDateErr("Required")
        } else {
            setBirthDateErr("")
        }
    }


    const handleUpdateFarmer = () => {
        if (editFirstName && editLastName && editPhoneNumber && editAddress && editBirthDate) {
            setStatusLoader(true)
            let formData = new FormData()
            formData.append("first_name", editFirstName)
            formData.append("last_name", editLastName)
            formData.append("phone", editPhoneNumber)
            formData.append("address", editAddress)
            formData.append("birth_date", editBirthDate)


            axios.put(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/update-farmer-profile/${farmerId}/`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then((res) => {
                    console.log("farmer update res", res.data)
                    if (res) {

                        setTimeout(() => {
                            setStatusLoader(false)
                            setOpen(false)
                        }, 700)

                        setTimeout(() => {
                            setFarmerUpdate(!farmerUpdate)
                        }, 2200)

                        toast.success('Farmer Update Successfully', {
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
                    console.log("farmer update err", err)
                    setStatusLoader(false)
                    if (err.response.data.response.phone) {
                        setPhoneNumberErr("user with this phone already exists")
                    } else {
                        setPhoneNumberErr("")
                    }
                })
        }
    }


    //*************Edit Farmer Detail End **************//
    return (
        <>
            {statusLoader ? <div className="loader_wrap"><div className="loader"></div></div> : <div></div>}

            <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
                <Grid item lg={12} xs={12}>
                    <Toolbar />
                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                        <h1>Farmers</h1>
                        <Box>
                            <Button variant="contained" onClick={() => navigate(-1)} sx={{ marginTop: "8px", marginRight: "20px" }}><ArrowBackIcon />Back</Button>
                            <Link to="/farmers/addFarmers"><Button variant="contained" style={{ fontWeight: "bold", marginTop: "8px" }}><AddIcon /> Add Farmers</Button></Link>
                        </Box>
                    </Box>
                    <Paper variant="outlined" sx={{
                        padding: '1em 0em',
                        width: '100%',
                        mt: 3
                    }}>
                        <Grid item lg={12} xs={12}>
                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 2, px: "1em", pb: "1em", borderBottom: "1px solid #8080802e" }}>
                                <Typography variant="subtitle1" sx={{ fontSize: "20px" }} gutterBottom>Farmers List</Typography>
                                <ButtonGroup variant="contained" aria-label="outlined secondary button group" className='buttonGroup'>
                                    <Button onClick={downloadPdf}><FontAwesomeIcon icon={faFilePdf} />&nbsp; PDF</Button>
                                    <Button><CSVLink data={fileData} filename={"farmers_list.csv"}><FontAwesomeIcon icon={faFileCsv} />&nbsp; CSV</CSVLink></Button>
                                    <Button><FontAwesomeIcon icon={faFileExcel} />&nbsp; <ExportToExcel details={fileData} fileName="Farmer List" /></Button>
                                </ButtonGroup>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", px: "1em", }}>
                                <div className='search_field'>
                                    <SearchIcon />
                                    <input type="search" placeholder='Search .....' value={searchTerm} onChange={(e) => handleSearch(e)} />
                                </div>
                            </Box>
                        </Grid>

                        <Grid item lg={12} xs={12} sx={{ mt: 2, px: "1em" }}>
                            <TableContainer component={Paper}>

                                <Table aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>S. No.</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Farmer Name</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Phone Number</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Address</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Birth Date</StyledTableCell>
                                            <StyledTableCell>Action</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            loader ?

                                                <TableRow>
                                                    <TableCell colSpan={5} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                        <CircularProgress />
                                                    </TableCell>
                                                </TableRow>

                                                :
                                                farmers.length > 0 ?
                                                    (rowsPerPage > 0
                                                        ? farmers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        : farmers
                                                    ).map((e, i) => {
                                                        return (
                                                            <TableRow key={i}>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {page * rowsPerPage + i + 1}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    <span style={{ textTransform: "capitalize" }}>{e.first_name}</span> {e.last_name}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }} >
                                                                    {e.phone}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }} >
                                                                    {e.address}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }} >
                                                                    {e.birth_date}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" >
                                                                    <Button variant="contained" onClick={() => handleOpen(e)} style={{ textTransform: "capitalize" }}>Edit</Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                    :
                                                    <TableRow>
                                                        <TableCell colSpan={4} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                            No data found
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
                                        <TableRow>
                                            {
                                                farmers.length > 0 ?
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                        colSpan={12}
                                                        count={farmers.length}
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
                            Edit Farmer Details
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
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Birth Date</h4>
                                <TextField value={editBirthDate} onChange={handleBirthDate} sx={{ width: "100%", p: 1 }} type="date" />
                                {birthDateErr ? <p style={{ color: "red", fontSize: "12px", paddingLeft: "10px" }}>{birthDateErr}</p> : ""}
                            </Grid>
                            <Grid xs={12} sm={12} item>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                                    <Button variant="contained" onClick={handleClose} sx={{ minWidth: "100px", fontSize: "1rem", mr: 2 }} className='modal_no_btn'>Cancel</Button>
                                    <Button variant="contained" onClick={handleUpdateFarmer} sx={{ minWidth: "100px", fontSize: "1rem" }}>Update</Button>
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







