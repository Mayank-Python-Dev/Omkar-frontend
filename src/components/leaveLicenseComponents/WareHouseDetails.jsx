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
import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import Delete from "../../public/delete.png"
// import Image from 'next/image'
import CircularProgress from '@mui/material/CircularProgress';

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
    const data = props.galaDetails


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    
    // const [searchTerm, setSearchTerm] = useState("")
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
                            <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Gala Number</StyledTableCell>
                            <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Owner</StyledTableCell>
                            <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Rental</StyledTableCell>
                            <StyledTableCell sx={{borderRight:"1px solid #1976d2"}}>Gala Price</StyledTableCell>
                            <StyledTableCell>Gala Area Size</StyledTableCell>
                            {/* <StyledTableCell>Allotted to Farmer</StyledTableCell>
                            <StyledTableCell>Allotted to Rental</StyledTableCell>
                            <StyledTableCell>Allotted to Investor</StyledTableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data !== undefined ? data.length > 0 ?
                            (rowsPerPage > 0
                                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : data
                            )
                                // .filter((val)=>{
                                //     if(searchTerm === ""){
                                //         return val
                                //     }else if(val.gala_number.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) || 
                                //     val.gala_rental_contract_detail.owner.username.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                                //     val.gala_rental_contract_detail.user.username.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
                                //     ){
                                //         return val
                                //     }
                                // })
                                .map((e, i) => {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                               { page*rowsPerPage + i +1}
                                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                {e.gala_number}
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                {
                                                    (e.gala_rental_contract_detail == null && e.gala_investor_contract_detail == null)
                                                        ?
                                                        "N/A"
                                                        :
                                                        (e.gala_rental_contract_detail == null)
                                                            ?
                                                            e.gala_investor_contract_detail.user.username
                                                            :
                                                            e.gala_rental_contract_detail.owner.username
                                                }

                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                {
                                                    (e.gala_rental_contract_detail == null && e.gala_investor_contract_detail == null)
                                                        ?
                                                        "N/A"
                                                        :
                                                        (e.gala_rental_contract_detail == null)
                                                            ?
                                                           "N/A"
                                                            :
                                                            e.gala_rental_contract_detail.user.username
                                                }
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{borderRight:"1px solid #e0e0e0"}}>
                                                {e.gala_price}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {e.gala_area_size}
                                            </TableCell>
                                            {/* <TableCell component="th" scope="row">
                                                {e.is_allotted_to_farmer === true ? <CheckBoxIcon style={{ color: "#299807", fontSize: "2em" }} /> : <Image src={Delete.src} width="27" height="25" alt="delete" style={{ marginbottom: "-4px" }} />}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {e.is_allotted_to_rental === true ? <CheckBoxIcon style={{ color: "#299807", fontSize: "2em" }} /> : <Image src={Delete.src} width="27" height="25" alt="delete" style={{ marginbottom: "-4px" }} />}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {e.is_allotted === true ? <CheckBoxIcon style={{ color: "#299807", fontSize: "2em" }} /> : <Image src={Delete.src} width="27" height="25" alt="delete" style={{ marginbottom: "-4px" }} />}
                                            </TableCell> */}
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





