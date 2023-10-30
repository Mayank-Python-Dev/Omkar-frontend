import React, { useState } from 'react';
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
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Delete from "../../styles/delete.png"
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Visibility } from '@mui/icons-material';
import { Button } from '@mui/material';


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

export default function CustomPaginationActionsTable(props) {
    const data = props.contract
    const path = useParams()
    const investorId = path.slug

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper variant="outlined" sx={{
            padding: '1em',
            width: '100%'
        }}>
            <TableContainer component={Paper} >

                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>S. No.</StyledTableCell>
                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Number</StyledTableCell>
                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Investor</StyledTableCell>
                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Rental</StyledTableCell>
                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Agreement Type</StyledTableCell>
                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Is Allotted to Rental</StyledTableCell>
                            <StyledTableCell>Details</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data !== undefined ? data.length > 0 ?
                            (rowsPerPage > 0
                                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : data
                            ).map((e, i) => {
                                return (
                                    <TableRow key={e.uid}>
                                        <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                            {page * rowsPerPage + i + 1}
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                            {e.gala_number}
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                            {
                                                e.gala_rental_contract_detail === null ?
                                                    e.gala_investor_contract_detail.user.username :
                                                    e.gala_rental_contract_detail.owner.username
                                            }
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                            {
                                                e.gala_rental_contract_detail === null ?
                                                    "N/A" :
                                                    e.gala_rental_contract_detail.user.username
                                            }
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                            {
                                                e.gala_rental_contract_detail === null ?
                                                    "N/A" :
                                                    e.gala_rental_contract_detail.agreement_type
                                            }
                                        </TableCell>
                                        <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                            {e.is_allotted_to_rental === true ? <CheckBoxIcon style={{ color: "#299807", fontSize: "2em" }} /> : <img src={Delete} width="27" height="25" alt="delete" style={{ marginbottom: "-4px" }} />}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {
                                                e.gala_rental_contract_detail === null ? "-" :
                                                    <Link to={`/investors/investors_property/${investorId}/contract_detail/${e.uid}`} style={{ textDecoration: "none" }}>
                                                        <Button variant="contained" style={{ textTransform: "capitalize", marginLeft: "10px" }}> View</Button>
                                                    </Link>
                                            }

                                        </TableCell>
                                    </TableRow>
                                )
                            })
                            :
                            <TableRow>
                                <TableCell colSpan={7} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                    No data found
                                </TableCell>
                            </TableRow>
                            :
                            <TableRow>
                                <TableCell colSpan={7} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                    <CircularProgress />
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
                            {data !== undefined && data.length > 0 ?
                                < TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={12}
                                    count={data.length}
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
        </Paper>
    );
}



