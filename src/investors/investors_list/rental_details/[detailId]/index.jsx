import React, { useEffect, useState } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Grid, Toolbar, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';

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


export default function InvestorRentalDetails() {
    const navigate = useNavigate()
    const path = useParams()
    const detailId = path.slug
    const [rentalData, setRentalData] = useState([])

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rentalData.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const accessToken = Cookies.get("accessToken")
    const companyType = Cookies.get("companyName")

    const [loader, setLoader] = useState(true)
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])

    const getDetails = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-investor-rental-detail/${detailId}/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                console.log("remaining gala list res", res.data.response)
                if (res) {
                    setRentalData(res.data.response)
                    setLoader(false)
                }
            })
            .catch((err) => {
                console.log("remaining gala list err", err)
                setLoader(false)
            })
    }
    useEffect(() => {
        getDetails()
    }, [detailId])


    const gridStyles = {
        padding: 3,
    };
    return (

        <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
            <Grid item lg={12} xs={12}>
                <Toolbar />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5" gutterBottom>Gala Details</Typography>
                    <Link to="/investors/investors_list"><Button variant="contained"><ArrowBackIcon /> Back</Button></Link>
                </Box>
                <Paper variant="outlined" sx={{
                    padding: '1em',
                    width: '100%',
                    mt: 2
                }}>

                    <Grid item lg={12} xs={12}>
                        <TableContainer component={Paper} >

                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>S. No.</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Investor</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Rental</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Property Name</StyledTableCell>
                                        <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Number</StyledTableCell>
                                        <StyledTableCell>Agreement Type</StyledTableCell>
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
                                            rentalData.length > 0 ?
                                                (rowsPerPage > 0
                                                    ? rentalData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    : rentalData
                                                ).map((e, i) => {
                                                    return (
                                                        <TableRow key={i}>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {page * rowsPerPage + i + 1}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.owner.first_name} {e.owner.last_name}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.user.first_name} {e.user.last_name}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.gala.warehouse.property_name}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {e.gala.gala_number}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {e.agreement_type}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={5} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                        No data found
                                                    </TableCell>
                                                </TableRow>
                                    }
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={5} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                {
                                    rentalData.length > 0 ?
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                    colSpan={12}
                                                    count={rentalData.length}
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
                                            </TableRow>
                                        </TableFooter>
                                        : ""
                                }
                            </Table>
                        </TableContainer>
                    </Grid>
                </Paper>
            </Grid >
        </Grid >
    );
}








