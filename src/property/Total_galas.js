
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
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFileExcel, faFileCsv } from '@fortawesome/free-solid-svg-icons'
import { CSVLink } from "react-csv";
import { ExportToExcel } from '../../src/excelFile'
import jsPDF from "jspdf";
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



export default function Total_galas() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [gala, setGala] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterData, setFilterData] = useState([])
    const [loader, setLoader] = useState(true)
    const [fileData, setFileData] = useState([])
    const [pdfData, setPdfData] = useState([])
    // Avoid a layout jump when reaching the last page with empty rows.

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - gala.length) : 0;

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



    const getGala = async () => {
        await axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-total-galas/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("gala res", res.data.response)
                if (res) {
                    setGala(res.data.response)
                    setFilterData(res.data.response)
                    setLoader(false)

                    for (let i = 0; i < res.data.response.length; i++) {
                        let obj = {}
                        obj['S No.'] = Number(i + 1)
                        obj['Gala Number'] = res.data.response[i].gala_number
                        obj['Gala Price'] = res.data.response[i].gala_price
                        obj['Gala Area Size'] = res.data.response[i].gala_area_size
                        obj['Warehouse Name'] = res.data.response[i].warehouse.property_name
                        obj['Warehouse Address'] = res.data.response[i].warehouse.address
                        obj['Owner'] = res.data.response[i].gala_rental_contract_detail === null && res.data.response[i].gala_investor_contract_detail === null && res.data.response[i].warehouse.farmer_warehouse_detail === null
                            ?
                            "Developer"
                            :
                            res.data.response[i].gala_rental_contract_detail === null && res.data.response[i].gala_investor_contract_detail === null
                                ?
                                res.data.response[i].warehouse.farmer_warehouse_detail && res.data.response[i].warehouse.farmer_warehouse_detail.user.username
                                :
                                res.data.response[i].gala_rental_contract_detail !== null ? res.data.response[i].gala_rental_contract_detail.owner.username
                                    :
                                    res.data.response[i].gala_investor_contract_detail.user.username
                        obj['Rental'] = res.data.response[i].gala_rental_contract_detail !== null ? res.data.response[i].gala_rental_contract_detail.user.username : "N/A"
                        setFileData((a) => [...a, obj])
                    }
                    for (let i = 0; i < res.data.response.length; i++) {
                        let arr = []
                        arr[0] = Number(i + 1)
                        arr[1] = res.data.response[i].gala_number
                        arr[2] = res.data.response[i].gala_price
                        arr[3] = res.data.response[i].gala_area_size
                        arr[4] = res.data.response[i].warehouse.property_name
                        arr[5] = res.data.response[i].warehouse.address
                        arr[6] = res.data.response[i].gala_rental_contract_detail === null && res.data.response[i].gala_investor_contract_detail === null && res.data.response[i].warehouse.farmer_warehouse_detail === null
                            ?
                            "Developer"
                            :
                            res.data.response[i].gala_rental_contract_detail === null && res.data.response[i].gala_investor_contract_detail === null
                                ?
                                res.data.response[i].warehouse.farmer_warehouse_detail && res.data.response[i].warehouse.farmer_warehouse_detail.user.username
                                :
                                res.data.response[i].gala_rental_contract_detail !== null ? res.data.response[i].gala_rental_contract_detail.owner.username
                                    :
                                    res.data.response[i].gala_investor_contract_detail.user.username
                        arr[7] = res.data.response[i].gala_rental_contract_detail !== null ? res.data.response[i].gala_rental_contract_detail.user.username : "N/A"
                        setPdfData((arg) => [...arg, arr])
                    }

                }
            })
            .catch((err) => {
                console.log("gala err", err)
                setLoader(false)
            })
    }
    useEffect(() => {
        getGala()
    }, [navigate])

    const gridStyles = {
        padding: 3,
    };


    // ****** search filter start******
    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        if (e.target.value.length > 0) {
            const searchData = gala.filter((val) => val.gala_number.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                || val.warehouse.property_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
            )
            setGala(searchData)
        } else {
            setGala(filterData)
        }
    }
    // ****** search filter end******

    //******** download pdf*********//
    const columns = [
        { header: "S.No." },
        { header: "Gala Number" },
        { header: "Gala Price" },
        { header: "Gala Area Size" },
        { header: "Warehouse Name" },
        { header: "Warehouse Address" },
        { header: "Owner" },
        { header: "Rental" },
    ]

    const downloadPdf = () => {
        const headerNames = columns.map((column) => column.header);

        const doc = new jsPDF('landscape')
        doc.text("Total Gala Details", 20, 10)
        doc.autoTable({
            head: [headerNames],
            body: pdfData,
        })
        doc.save('total gala.pdf')
    }
    //******** download pdf*********//




    return (

        <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
            <Grid item lg={12} xs={12}>
                <Toolbar />
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                    <h1>Galas</h1>
                    <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon /> Back</Button>
                </Box>
                <Paper variant="outlined" sx={{
                    padding: '1em 0em',
                    width: '100%',
                    mt: 2
                }}>
                    <Grid item lg={12} xs={12}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 2, px: "1em", pb: "1em", borderBottom: "1px solid #8080802e" }}>
                            <Typography variant="subtitle1" sx={{ fontSize: "20px" }} gutterBottom>Gala List</Typography>
                            <ButtonGroup variant="contained" aria-label="outlined secondary button group" className='buttonGroup'>
                                <Button onClick={downloadPdf} ><FontAwesomeIcon icon={faFilePdf} />&nbsp; PDF</Button>
                                <Button><CSVLink data={fileData} filename={"gala.csv"}><FontAwesomeIcon icon={faFileCsv} />&nbsp; CSV</CSVLink></Button>
                                <Button><FontAwesomeIcon icon={faFileExcel} />&nbsp; <ExportToExcel details={fileData} fileName="gala" /></Button>
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
                        <TableContainer component={Paper} >

                            <Table aria-label="custom pagination table" id='divToPrint' >
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>S. No.</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Number</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Price</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Area Size</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Warehouse Name</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Warehouse Address</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Owner</StyledTableCell>
                                        {/* <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Investor</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Farmer</StyledTableCell> */}
                                        <StyledTableCell>Rental</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        loader ?

                                            <TableRow>
                                                <TableCell colSpan={9} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                    <CircularProgress />
                                                </TableCell>
                                            </TableRow>

                                            :
                                            gala.length > 0 ?
                                                (rowsPerPage > 0
                                                    ? gala.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    : gala
                                                ).map((e, i) => {
                                                    return (
                                                        <TableRow key={i} hover>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {page * rowsPerPage + i + 1}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.gala_number}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.gala_price}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.gala_area_size}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.warehouse.property_name}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.warehouse.address}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {
                                                                    e.gala_rental_contract_detail === null && e.gala_investor_contract_detail === null && e.warehouse.farmer_warehouse_detail === null
                                                                        ?
                                                                        "Developer"
                                                                        :
                                                                        e.gala_rental_contract_detail === null && e.gala_investor_contract_detail === null
                                                                            ?
                                                                            e.warehouse.farmer_warehouse_detail && e.warehouse.farmer_warehouse_detail.user.username
                                                                            :
                                                                            e.gala_rental_contract_detail !== null ? e.gala_rental_contract_detail.owner.username
                                                                                :
                                                                                e.gala_investor_contract_detail.user.username
                                                                }
                                                            </TableCell>
                                                            {/* <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                              
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                               
                                                            </TableCell> */}
                                                            <TableCell component="th" scope="row">
                                                                {e.gala_rental_contract_detail !== null ? e.gala_rental_contract_detail.user.username : "N/A"}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={9} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
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
                                            gala.length > 0 ?
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                    colSpan={12}
                                                    count={gala.length}
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










