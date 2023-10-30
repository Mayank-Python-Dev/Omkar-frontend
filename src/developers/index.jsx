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
import axios from 'axios';
import Cookies from 'js-cookie';
import SearchIcon from '@mui/icons-material/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFileExcel, faFileCsv } from '@fortawesome/free-solid-svg-icons'
import { CSVLink } from 'react-csv';
import { ExportToExcel } from '../excelFile';
import jsPDF from 'jspdf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector, useDispatch } from 'react-redux';
import { setPageNumber, setRowPerPageCount } from '../redux/reducer';

export default function Developers() {
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

// ======================== api functionality start =======================

    const [page, setPage] = useState(pageNumber);
    const [rowsPerPage, setRowsPerPage] = useState(rowPerPageCount);
    const [developers, setDevelopers] = useState([])
    // ========================= THIS IS ERROR ROWS IS NOT DEFINED ================================
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - developers.length) : 0;

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
    // ====================== THIS NEEED TO BE SEE ================================
    // const path = router.asPath.split("?").pop()
   
    const [loader, setLoader] = useState(true)
    const [filterData, setFilterData] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [fileData, setFileData] = useState([])
    const [pdfData, setPdfData] = useState([])

    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])
    const getDevelopers = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-owner-warehouses/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("developers res", res.data.response)
                if (res) {
                    setDevelopers(res.data.response)
                    setFilterData(res.data.response)
                    setLoader(false)

                    for (let i = 0; i < res.data.response.length; i++) {
                        let obj = {}
                        obj['S No.'] = Number(i + 1)
                        obj['Property Name'] = res.data.response[i].property_name
                        obj['Property Type'] = res.data.response[i].property_type
                        obj['Property survay Number'] = res.data.response[i].property_survey_number
                        obj['Address'] = res.data.response[i].address
                        obj['City'] = res.data.response[i].city
                        obj['State'] = res.data.response[i].state
                        obj['Country'] = res.data.response[i].country
                        obj['Total Gala'] = res.data.response[i].total_number_of_galas == 0 ? "N/A" : res.data.response[i].total_number_of_galas
                        obj['Total Remaining Gala'] = res.data.response[i].total_number_of_remaining_galas == 0 ? "N/A" : res.data.response[i].total_number_of_remaining_galas
                        setFileData((a) => [...a, obj])
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
                        arr[9] = res.data.response[i].total_number_of_remaining_galas == 0 ? "N/A" : res.data.response[i].total_number_of_remaining_galas
                        setPdfData((arg) => [...arg, arr])
                    }
                }
            })
            .catch((err) => {
                console.log("developers err", err)
                setLoader(false)
            })
    }
    useEffect(() => {
        getDevelopers()
    }, [navigate])

    const gridStyles = {
        padding: 3,
    };


    // **********search filter start********
    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        if (e.target.value.length > 0) {
            const searchData = developers.filter((val) => val.property_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                              || val.property_survey_number.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
            )
            setDevelopers(searchData)
        } else {
            setDevelopers(filterData)
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
    { header: "Remaining Gala" }
]

const downloadPdf = () => {
    const headerNames = columns.map((column) => column.header);

    const doc = new jsPDF("landscape")
    doc.text("Developers Details", 20, 10)
    doc.autoTable({
        head: [headerNames],
        body: pdfData,
    })
    doc.save('developers.pdf')
}
//******** download pdf*********//


    return (
        <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
            <Grid item lg={12} xs={12}>
                <Toolbar />
               <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
               <h1>Developers</h1>
                <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
               </Box>
                <Paper variant="outlined" sx={{
                    padding: '1em 0em',
                    width: '100%',
                    mt: 2
                }}>
                    <Grid item lg={12} xs={12}>
                        <Box sx={{ display: "flex", flexWrap:"wrap", justifyContent: "space-between", alignItems: "center", mb: 2, px: "1em", pb: "1em", borderBottom: "1px solid #8080802e" }}>
                            <Typography variant="subtitle1" sx={{ fontSize: "20px" }} gutterBottom>Developers List</Typography>
                            <ButtonGroup variant="contained" aria-label="outlined secondary button group" className='buttonGroup'>
                                <Button onClick={downloadPdf}><FontAwesomeIcon icon={faFilePdf} />&nbsp; PDF</Button>
                                <Button><CSVLink data={fileData} filename={"development_list.csv"}><FontAwesomeIcon icon={faFileCsv} />&nbsp; CSV</CSVLink></Button>
                                <Button><FontAwesomeIcon icon={faFileExcel} />&nbsp; <ExportToExcel details={fileData} fileName="Development List" /></Button>
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
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Property Name</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Property Type</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Property Survay Number</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Address</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>City</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>State</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Country</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Total Galas</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Total Remaining Galas</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Total Investors</StyledTableCell>
                                        <StyledTableCell>Total Rentals</StyledTableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        loader ?

                                            <TableRow>
                                                <TableCell colSpan={12} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                    <CircularProgress />
                                                </TableCell>
                                            </TableRow>

                                            :
                                            developers.length > 0 ?
                                                (rowsPerPage > 0
                                                    ? developers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    : developers
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
                                                                {e.property_type}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.property_survey_number}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.address}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.city}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.state}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.country}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.total_number_of_galas == 0 ? "N/A" : e.total_number_of_galas}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.total_number_of_remaining_galas == 0 ? "N/A" : e.total_number_of_remaining_galas}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                <Link to={`/developers/owner-investor-contract-detail/${e.uid}`} style={{ textDecoration: "none" }} className="btn_link">
                                                                    <span className='count'>{e.total_number_of_investors}</span> <Button variant="contained" style={{ textTransform: "capitalize", marginLeft: "10px" }}> View</Button>
                                                                </Link>

                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                <Link to={`/developers/owner-rental-contract-detail/${e.uid}`} style={{ textDecoration: "none" }} className="btn_link">
                                                                    <span className='count'>{e.total_number_of_rentals}</span><Button variant="contained" style={{ textTransform: "capitalize", marginLeft: "10px" }}> View</Button>
                                                                </Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={12} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                        No data found
                                                    </TableCell>
                                                </TableRow>

                                    }

                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={12} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        {
                                            developers.length > 0 ?
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                    colSpan={12}
                                                    count={developers.length}
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

