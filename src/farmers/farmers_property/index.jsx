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
import { Grid, Toolbar, Button, Typography, CircularProgress, ButtonGroup } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFilePdf, faFileExcel, faFileCsv } from '@fortawesome/free-solid-svg-icons'
import { CSVLink } from 'react-csv';
import { ExportToExcel } from '../../excelFile';
import jsPDF from 'jspdf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector, useDispatch } from 'react-redux';
import { setPageNumber, setRowPerPageCount } from '../../redux/reducer';

export default function Farmers_property() {
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

    // =============api functionality start ===============
    const [page, setPage] = useState(pageNumber);
    const [rowsPerPage, setRowsPerPage] = useState(rowPerPageCount);
    const [farmers, setFarmers] = useState([])
    const [filterData, setFilterData] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [fileData, setFileData] = useState([])
    const [pdfData, setPdfData] = useState([])
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
    // const router = useRouter()
    const navigate = useNavigate()
    // ========== NEED TO SEE AND FIXED ========
    // const path = router.asPath.split("?").pop()

    const [loader, setLoader] = useState(true)
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            // router.push('/')
            navigate('/')
        }
    }, [navigate])
    const getFarmers = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-farmers-warehouses/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("farmers res", res.data.response)
                if (res) {
                    setFarmers(res.data.response)
                    setFilterData(res.data.response)
                    setLoader(false)

                    for(let i=0; i<res.data.response.length; i++){
                        let obj = {}
                        obj['S No.'] = Number(i+1)
                        obj['Property Name'] = res.data.response[i].property_name
                        obj['Property Type'] = res.data.response[i].property_type
                        obj['Property survey Number'] = res.data.response[i].property_survey_number
                        obj['Address'] = res.data.response[i].address
                        obj['City'] = res.data.response[i].city
                        obj['State'] = res.data.response[i].state
                        obj['Country'] = res.data.response[i].country
                        obj['Total Gala'] = res.data.response[i].total_number_of_galas == 0 ? "N/A" : res.data.response[i].total_number_of_galas
                        obj['Remaining Gala'] = res.data.response[i].total_remaining_galas == 0 ? "N/A" : res.data.response[i].total_remaining_galas
                        obj['Total Rental'] = res.data.response[i].total_number_of_rentals == 0 ? "N/A" : res.data.response[i].total_number_of_rentals
                        obj['Farmer Name'] = res.data.response[i].farmer_name
                        setFileData((a)=> [...a, obj])
                    }
                    for (let i = 0; i < res.data.response.length; i++) {
                        let arr = []
                        arr[0] = Number(i + 1)
                        arr[1] = res.data.response[i].property_name
                        arr[2] = res.data.response[i].property_type
                        arr[3] = res.data.response[i].property_survey_number
                        arr[4] = res.data.response[i].address
                        arr[5] = res.data.response[i].city
                        arr[6] = res.data.response[i].state
                        arr[7] = res.data.response[i].country
                        arr[8] = res.data.response[i].total_number_of_galas == 0 ? "N/A" : res.data.response[i].total_number_of_galas
                        arr[9] = res.data.response[i].total_remaining_galas == 0 ? "N/A" : res.data.response[i].total_remaining_galas
                        arr[10] = res.data.response[i].total_number_of_rentals == 0 ? "N/A" : res.data.response[i].total_number_of_rentals
                        arr[11] = res.data.response[i].farmer_name
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
    }, [navigate])

    const gridStyles = {
        padding: 3,
    };

    // **********search filter start********
    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        if (e.target.value.length > 0) {
            const searchData = farmers.filter((val) => val.property_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                              || val.property_survey_number.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
            )
            setFarmers(searchData)
        } else {
            setFarmers(filterData)
        }
    }
    // **********search filter end**********

    //******** download pdf*********//
    const columns = [
        { header: "S.No." },
        { header: "Property Name" },
        { header: "Property Type" },
        { header: "Property Survey Number" },
        { header: "Address" },
        { header: "City" },
        { header: "State" },
        { header: "Country" },
        { header: "Total Gala" },
        { header: "Remaining Gala" },
        { header: "Total Rental" },
        { header: "Farmer Name" },
    ]

    const downloadPdf = () => {
        const headerNames = columns.map((column) => column.header);

        const doc = new jsPDF("landscape")
        doc.text("Farmer Property Details", 20, 10)
        doc.autoTable({
            head: [headerNames],
            body: pdfData,
        })
        doc.save('farmer_property.pdf')
    }
    //******** download pdf*********//
    return (

        <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
            <Grid item lg={12} xs={12}>
                {/* <Toolbar /> */}
                <Toolbar />
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                    <h1>Farmers</h1>
                    <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                </Box>
                <Paper variant="outlined" sx={{
                    padding: '1em 0em',
                    width: '100%',
                    mt:2
                }}>
                    <Grid item lg={12} xs={12}>
                        <Box sx={{ display: "flex", flexWrap:"wrap", justifyContent: "space-between", alignItems: "center", mb: 2, px: "1em", pb: "1em", borderBottom: "1px solid #8080802e" }}>
                            <Typography variant="subtitle1" sx={{ fontSize: "20px" }} gutterBottom>Property List</Typography>
                            <ButtonGroup variant="contained" aria-label="outlined secondary button group" className='buttonGroup'>
                                <Button onClick={downloadPdf}><FontAwesomeIcon icon={faFilePdf} />&nbsp; PDF</Button>
                                <Button><CSVLink data={fileData} filename={"farmers_property_list.csv"}><FontAwesomeIcon icon={faFileCsv} />&nbsp; CSV</CSVLink></Button>
                                <Button><FontAwesomeIcon icon={faFileExcel} />&nbsp; <ExportToExcel details={fileData} fileName="Farmer Property List" /></Button>
                            </ButtonGroup>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", px: "1em", }}>
                            <div className='search_field'>
                                <SearchIcon />
                                <input type="search" placeholder='Search .....' value={searchTerm} onChange={(e) => handleSearch(e)} />
                            </div>
                        </Box>
                    </Grid>
                    <Grid item lg={12} xs={12} sx={{ mt: 2, px:"1em" }}>
                        <TableContainer component={Paper}>

                            <Table aria-label="custom pagination table">
                                <TableHead>
                                    <TableRow>
                                    <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>S. No.</StyledTableCell>
                                        <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Property Name</StyledTableCell>
                                        <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Property Type</StyledTableCell>
                                        <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Property Survey Number</StyledTableCell>
                                        <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Address</StyledTableCell>
                                        <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>City</StyledTableCell>
                                        <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>State</StyledTableCell>
                                        <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Country</StyledTableCell>
                                        <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Total Galas</StyledTableCell>
                                        <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}> Remaining Galas</StyledTableCell>
                                        <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Total Rentals</StyledTableCell>
                                        <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Farmer Name</StyledTableCell>
                                        <StyledTableCell>Details</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        loader ?

                                            <TableRow>
                                                <TableCell colSpan={11} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
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
                                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                                {e.property_name}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                                {e.property_type}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                                {e.property_survey_number}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                                {e.address}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                                {e.city}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                                {e.state}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                                {e.country}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                                {e.total_number_of_galas == 0 ? "N/A" : e.total_number_of_galas}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                                {e.total_remaining_galas == 0 ? "N/A" : e.total_remaining_galas}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                                {e.total_number_of_rentals == 0 ? "N/A" : e.total_number_of_rentals}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                                {e.farmer_name}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                <Link to={`/farmers/farmers_property/${e.farmer_uid}/${e.uid}`} style={{ textDecoration: "none" }}>
                                                                    <Button variant="contained" style={{ textTransform: "capitalize", marginLeft: "10px" }}> View</Button>
                                                                </Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={11} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                        No data found
                                                    </TableCell>
                                                </TableRow>

                                    }

                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
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
    );
}


