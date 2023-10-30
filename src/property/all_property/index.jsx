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
import { Grid, Toolbar, Button, Typography, CircularProgress, ButtonGroup, Modal, Fade, TextField, Select, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import SearchIcon from '@mui/icons-material/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFileExcel, faFileCsv } from '@fortawesome/free-solid-svg-icons'
import { CSVLink } from 'react-csv';
import { ExportToExcel } from '../../excelFile';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
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


export default function All_property() {
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

    // ============== api functionality start ==============
    const [page, setPage] = useState(pageNumber);
    const [rowsPerPage, setRowsPerPage] = useState(rowPerPageCount);
    const [propertyData, setPropertyData] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterData, setFilteData] = useState([])
    const [fileData, setFileData] = useState([])
    const [pdfData, setPdfData] = useState([])
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - propertyData.length) : 0;

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
    const companyId = Cookies.get("companyId")
    const companyType = Cookies.get("companyName")
    // const router = useRouter()
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const [statusLoader, setStatusLoader] = useState(false)
    const [propertyUpdate, setPropertyUpdate] = useState(false)
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            // router.push('/')
            navigate('/')
        }
    }, [navigate])
    const getProperty = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-property-list/?get_company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                // console.log("all property res", res.data.response)
                if (res) {
                    setPropertyData(res.data.response)
                    setFilteData(res.data.response)
                    setLoader(false)

                    for (let i = 0; i < res.data.response.length; i++) {
                        let obj = {}
                        obj['S No.'] = Number(i + 1)
                        obj['Property Name'] = res.data.response[i].property_name
                        obj['Property Type'] = res.data.response[i].property_type
                        obj['Property survay Number'] = res.data.response[i].property_survey_number
                        obj['Company Name'] = res.data.response[i].company
                        obj['Address'] = res.data.response[i].address
                        obj['City'] = res.data.response[i].city
                        obj['Zip Code'] = res.data.response[i].zipcode
                        obj['Country'] = res.data.response[i].country
                        obj['State'] = res.data.response[i].state
                        obj['Total Gala'] = res.data.response[i].total_gala == 0 ? "N/A" : res.data.response[i].total_gala

                        setFileData((a) => [...a, obj])
                    }
                    for (let i = 0; i < res.data.response.length; i++) {
                        let arr = []
                        arr[0] = Number(i + 1)
                        arr[1] = res.data.response[i].property_name
                        arr[2] = res.data.response[i].property_type
                        arr[3] = res.data.response[i].property_survey_number
                        arr[4] =  res.data.response[i].company
                        arr[5] = res.data.response[i].address
                        arr[6] = res.data.response[i].city
                        arr[7] = res.data.response[i].zipcode
                        arr[8] = res.data.response[i].country
                        arr[9] = res.data.response[i].state
                        arr[10] = res.data.response[i].total_gala == 0 ? "N/A" : res.data.response[i].total_gala
                        setPdfData((arg) => [...arg, arr])
                    }
                }
            })
            .catch((err) => {
                console.log("all property err", err)
            })
    }
    useEffect(() => {
        getProperty()
    }, [navigate, propertyUpdate])

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        if (e.target.value.length > 0) {
            const searchData = propertyData.filter((val) => val.property_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                || val.city.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) || val.property_type.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                || val.property_survey_number.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
            )
            setPropertyData(searchData)
        }
        else {
            setPropertyData(filterData)
        }
    }

    const gridStyles = {
        padding: 3,
    };

    //******** download pdf*********//
    const columns = [
        { header: "S.No." },
        { header: "Property Name" },
        { header: "Property Survey Number" },
        { header: "Property Type" },
        { header: "Company Name" },
        { header: "Address" },
        { header: "City" },
        { header: "Zip Code" },
        { header: "Country" },
        { header: "State" },
        { header: "Total Gala" },
    ]

    const downloadPdf = () => {
        const headerNames = columns.map((column) => column.header);

        const doc = new jsPDF("landscape")
        doc.text(" Property Details", 20, 10)
        doc.autoTable({
            head: [headerNames],
            body: pdfData,
        })
        doc.save('property.pdf')
    }
    //******** download pdf*********//

    // ******* get property type start *******
    const [allPropertyType, setAllPropertyType] = useState([])
    const getPropertyType = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-property-type/`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                // console.log("get property res----", res.data.response)
                setAllPropertyType(res.data.response)
            })
            .catch((error) => {
                console.log("error", error)
            })
    }

    useEffect(() => {
        getPropertyType()
    }, [accessToken])
    // ******* get property type end *******

    //**********Edit Property details modal***********//
    const [open, setOpen] = useState(false);
    const [editPropertyName, setEditPropertyName] = useState("")
    const [editPropertyType, setEditPropertyType] = useState("")
    const [editAddress, setEditAddress] = useState("")
    const [editCity, setEditCity] = useState("")
    const [editZipCode, setEditZipCode] = useState("")
    const [editState, setEditState] = useState("")
    const [editCountry, setEditCountry] = useState("")
    const [editPropertySurvey, setEditPropertySurvey] = useState("")
    const [editPropertyId, setEditPropertyId] = useState("")

    const [propertyNameErr, setPropertyNameErr] = useState("")
    const [addressErr, setAddressErr] = useState("")
    const [cityErr, setCityErr] = useState("")
    const [zipcodeErr, setZipcodeErr] = useState("")
    const [stateErr, setStateErr] = useState("")
    const [countryErr, setCountryErr] = useState("")


    const handleClose = () => setOpen(false);

    const handleOpen = (e) => {
        setOpen(true)
        setEditPropertyName(e.property_name)
        setEditPropertyType(e.property_type)
        setEditAddress(e.address)
        setEditCity(e.city)
        setEditZipCode(e.zipcode)
        setEditState(e.state)
        setEditCountry(e.country)
        setEditPropertySurvey(e.property_survey_number)
        setEditPropertyId(e.uid)
    }

    useEffect(()=>{
        setPropertyNameErr("")
        setAddressErr("")
        setCityErr("")
        setZipcodeErr("")
        setStateErr("")
        setCountryErr("")
    },[open])


    var spacePattern = /^$|^\S+.*/
    var aphabeticPattern = /^[a-zA-Z() ]+$/

    const handlePropertyName = (e)=>{
        setEditPropertyName(e.target.value)
        if(e.target.value === ""){
            setPropertyNameErr("Required")
        }else if(!spacePattern.test(e.target.value)){
            setPropertyNameErr("Space not allowed")
        }else if(e.target.value.length < 3){
            setPropertyNameErr("Property name should be minimun 3 characters or more")
        }else if(!aphabeticPattern.test(e.target.value)){
            setPropertyNameErr("Property name should be contain only alphabetic value")
        }else{
            setPropertyNameErr("")
        }
    }

    const handleAddress = (e)=>{
        setEditAddress(e.target.value)
        if(e.target.value === ""){
            setAddressErr("Required")
        }else if(!spacePattern.test(e.target.value)){
            setAddressErr("Space not allowed")
        }else if(e.target.value.length < 3){
            setAddressErr("Address should be minimun 3 characters or more")
        }else{
            setAddressErr("") 
        }
    }

    const handleCity = (e)=>{
        setEditCity(e.target.value)
        if(e.target.value === ""){
            setCityErr("Required")
        }else if(!spacePattern.test(e.target.value)){
            setCityErr("Space not allowed")
        }else if(e.target.value.length < 3){
            setCityErr("City should be minimun 3 characters or more")
        }else if(!aphabeticPattern.test(e.target.value)){
            setCityErr("City should be contain only alphabetic value")
        }else{
            setCityErr("")
        }
    }

    const handleZipcode = (e)=>{
        setEditZipCode(e.target.value)
        if(e.target.value === ""){
            setZipcodeErr("Required")
        }else if(!spacePattern.test(e.target.value)){
            setZipcodeErr("Space not allowed")
        }else if(e.target.value.length < 6){
            setZipcodeErr("Zip code should be minimun 6 digits")
        }else{
            setZipcodeErr("") 
        }
    }

    const handleState = (e)=>{
        setEditState(e.target.value)
        if(e.target.value === ""){
            setStateErr("Required")
        }else if(!spacePattern.test(e.target.value)){
            setStateErr("Space not allowed")
        }else if(e.target.value.length < 3){
            setStateErr("State should be minimun 3 characters or more")
        }else if(!aphabeticPattern.test(e.target.value)){
            setStateErr("State should be contain only alphabetic value")
        }else{
            setStateErr("")
        }
    }

    const handleCountry = (e)=>{
        setEditCountry(e.target.value)
        if(e.target.value === ""){
            setCountryErr("Required")
        }else if(!spacePattern.test(e.target.value)){
            setCountryErr("Space not allowed")
        }else if(e.target.value.length < 3){
            setCountryErr("Country should be minimun 3 characters or more")
        }else if(!aphabeticPattern.test(e.target.value)){
            setCountryErr("Country should be contain only alphabetic value")
        }else{
            setCountryErr("")
        }
    }

    const handleUpdateProperty = () => {
        if(editPropertyName && editPropertyType && editAddress && editCity && editZipCode && editState && editCountry){
        setStatusLoader(true)
        let formData = new FormData()
        formData.append("property_name", editPropertyName)
        formData.append("company", companyId)
        formData.append("property_type", editPropertyType)
        formData.append("address", editAddress)
        formData.append("city", editCity)
        formData.append("zipcode", editZipCode)
        formData.append("state", editState)
        formData.append("country", editCountry)

        axios.put(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/property-update-api/${editPropertyId}/`, formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                console.log("property update res", res.data)
                if (res) {

                    setTimeout(() => {
                        setStatusLoader(false)
                        setOpen(false)
                    }, 700)

                    setTimeout(() => {
                        setPropertyUpdate(!propertyUpdate)
                    }, 2200)

                    toast.success('Property Update Successfully', {
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
                console.log("gala update err", err)
                setStatusLoader(false)
            })
        }
    }
    //**********Edit Property details modal***********//

    return (
        <>
            {statusLoader ? <div className="loader_wrap"><div className="loader"></div></div> : <div></div>}
            <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
                <Grid item lg={12} xs={12}>
                    <Toolbar />
                  <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                  <h1>Warehouse Property</h1>
                    <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                  </Box>
                    <Paper variant="outlined" sx={{
                        padding: '1em 0em',
                        width: '100%',
                        mt: 2
                    }}>
                        <Grid item lg={12} xs={12}>
                            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 2, px: "1em", pb: "1em", borderBottom: "1px solid #8080802e" }}>
                                <Typography variant="subtitle1" sx={{ fontSize: "20px" }} gutterBottom>Property List</Typography>
                                <ButtonGroup variant="contained" aria-label="outlined secondary button group" className='buttonGroup'>
                                    <Button onClick={downloadPdf}><FontAwesomeIcon icon={faFilePdf} />&nbsp; PDF</Button>
                                    <Button><CSVLink data={fileData} filename={"warehouse_property_list.csv"}><FontAwesomeIcon icon={faFileCsv} />&nbsp; CSV</CSVLink></Button>
                                    <Button><FontAwesomeIcon icon={faFileExcel} />&nbsp; <ExportToExcel details={fileData} fileName="Warehouse Property List" /></Button>
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

                                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>S. No.</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Property Name</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Property Survay No</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Property Type</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Company Name</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Address</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>City</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Zip Code</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Country</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>State</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Total Galas</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Details</StyledTableCell>
                                            <StyledTableCell>Action</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            loader ?

                                                <TableRow>
                                                    <TableCell colSpan={13} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                        <CircularProgress />
                                                    </TableCell>
                                                </TableRow>

                                                :
                                                propertyData.length > 0 ?
                                                    (rowsPerPage > 0
                                                        ? propertyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        : propertyData
                                                    ).map((e, i) => {
                                                        return (
                                                            <TableRow key={i}>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {page * rowsPerPage + i + 1}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.property_name}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.property_survey_number}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.property_type}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.company}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.address}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.city}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.zipcode}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.country}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.state}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    {e.total_gala == 0 ? "N/A" : e.total_gala}
                                                                </TableCell>

                                                                <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                    <Link to={`/property/all_property/${e.uid}`} style={{ textDecoration: "none" }}>
                                                                        <Button variant="contained" style={{ textTransform: "capitalize", marginLeft: "10px" }}> View</Button>
                                                                    </Link>
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    <Button variant="contained" onClick={() => handleOpen(e)} style={{textTransform:"capitalize"}}>Edit</Button>
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
                                                propertyData.length > 0 ?
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                        colSpan={12}
                                                        count={propertyData.length}
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
                            Edit Property Details
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Property Name</h4>
                                <TextField value={editPropertyName} onChange={handlePropertyName} sx={{ width: "100%", p: 1 }} />
                                {propertyNameErr ? <p style={{color:"red", fontSize:"12px", paddingLeft:"10px"}}>{propertyNameErr}</p> : "" }
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Property Survey Number</h4>
                                <TextField value={editPropertySurvey} sx={{ width: "100%", p: 1 }} className="renew_contract_input" />
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Property Type</h4>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={editPropertyType}
                                    sx={{ width: "96%", m: 1 }}
                                    onChange={(e) => setEditPropertyType(e.target.value)}
                                >
                                    {allPropertyType ? allPropertyType.map((ele, i) => {
                                        return (
                                            <MenuItem value={ele} key={i}>{ele}</MenuItem>
                                        )
                                    }) : ""
                                    }
                                </Select>
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Company Name</h4>
                                <TextField value={`${companyType} - ${companyId}`} sx={{ width: "100%", p: 1 }} className="renew_contract_input" />
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Address</h4>
                                <TextField value={editAddress} onChange={handleAddress} sx={{ width: "100%", p: 1 }} />
                                {addressErr ? <p style={{color:"red", fontSize:"12px", paddingLeft:"10px"}}>{addressErr}</p> : "" }
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>City</h4>
                                <TextField value={editCity} onChange={handleCity} sx={{ width: "100%", p: 1 }} />
                                {cityErr ? <p style={{color:"red", fontSize:"12px", paddingLeft:"10px"}}>{cityErr}</p> : "" }
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Zip Code</h4>
                                <TextField type="number" value={editZipCode} onChange={handleZipcode} sx={{ width: "100%", p: 1 }} />
                                {zipcodeErr ? <p style={{color:"red", fontSize:"12px", paddingLeft:"10px"}}>{zipcodeErr}</p> : "" }
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>State</h4>
                                <TextField value={editState} onChange={handleState} sx={{ width: "100%", p: 1 }} />
                                {stateErr ? <p style={{color:"red", fontSize:"12px", paddingLeft:"10px"}}>{stateErr}</p> : "" }
                            </Grid>
                            <Grid xs={12} sm={6} md={6} item>
                                <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Country</h4>
                                <TextField value={editCountry} onChange={handleCountry} sx={{ width: "100%", p: 1 }} />
                                {countryErr ? <p style={{color:"red", fontSize:"12px", paddingLeft:"10px"}}>{countryErr}</p> : "" }
                            </Grid>
                            <Grid xs={12} sm={12} item>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                                    <Button variant="contained" onClick={handleClose} sx={{ minWidth: "100px", fontSize: "1rem", mr: 2 }} className='modal_no_btn'>Cancel</Button>
                                    <Button variant="contained" onClick={handleUpdateProperty} sx={{ minWidth: "100px", fontSize: "1rem" }}>Update</Button>
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




