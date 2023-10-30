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
import axios from 'axios';
import Cookies from 'js-cookie';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useParams } from 'react-router-dom';
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



export default function GalaFreeAreaDetails() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [freeGala, setFreeGala] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterData, setFilterData] = useState([])
    const [galaFreeAreaSize, setGalaFreeAreaSize] = useState("")
    const [loader, setLoader] = useState(true)
    const { slug1, slug2 } = useParams()


    // Avoid a layout jump when reaching the last page with empty rows.

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - freeGala.length) : 0;

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


    const getFreeGala = async () => {
        await axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-free-gala-detail-view/?company_type=${companyType}&month=${slug1}&year=${slug2}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                // console.log("free gala res", res.data.response)
                if (res) {
                    setFreeGala(res.data.response)
                    setFilterData(res.data.response)
                    setGalaFreeAreaSize(res.data.gala_free_area_size)
                    setLoader(false)
                }
            })
            .catch((err) => {
                console.log("free gala err", err)
                setLoader(false)
            })
    }
    useEffect(() => {
        getFreeGala()
    }, [navigate])

    const gridStyles = {
        padding: 3,
    };


    // ****** search filter start******
    const handleSearch = (e) => {
        setSearchTerm(e.target.value)

        if (e.target.value.length > 0) {
            const searchData = freeGala.filter((val) => val.gala.gala_number.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                || val.gala.warehouse.property_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                || val.user.username.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
            )
            setFreeGala(searchData)
        } else {
            setFreeGala(filterData)
        }
    }
    // ****** search filter end******


    return (

        <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
            <Grid item lg={12} xs={12}>
                <Toolbar />
                <Box sx={{ display: "flex", flexWrap:"wrap", justifyContent: "space-between", alignItems: "center" }}>
                    <h1>Gala Free Area Details</h1>
                    <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                </Box>

                <Paper variant="outlined" sx={{
                    padding: '1em 0em',
                    width: '100%',
                    mt: 2
                }}>
                    <Grid item lg={12} xs={12}>
                        <Box sx={{ display: "flex", flexWrap:"wrap", justifyContent: "space-between", alignItems: "center", px: "1em", }}>
                            <Typography variant='h6'>Gala Free Area Size : {galaFreeAreaSize} sqft</Typography>
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
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Area Size</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Owner</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Rental</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Rental Contact</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Agreement End Date</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>GharPatti End Date</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Agreement Doc</StyledTableCell>
                                        <StyledTableCell>GharPatti Doc</StyledTableCell>
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
                                            freeGala.length > 0 ?
                                                (rowsPerPage > 0
                                                    ? freeGala.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    : freeGala
                                                ).map((e, i) => {
                                                    return (
                                                        <TableRow key={i} hover>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {page * rowsPerPage + i + 1}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.gala.gala_number} ({e.gala.warehouse.property_name})
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.gala.gala_area_size}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.owner.username}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.user.username}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.user.phone}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.agreement_valid_end_date}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.ghar_patti_end_date}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                <Button variant='contained' sx={{ textTransform: "capitalize" }}><a href={`${e.agreement_valid_doc}`} target="_blank">View</a></Button>
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                <Button variant='contained' sx={{ textTransform: "capitalize" }}><a href={`${e.ghar_patti_doc}`} target="_blank">View</a></Button>
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
                                            freeGala.length > 0 ?
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                    colSpan={12}
                                                    count={freeGala.length}
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












