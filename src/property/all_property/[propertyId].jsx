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
import { Grid, Toolbar, Button, Typography, Modal, Fade, TextField   } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius:3,
    p: 4,
};

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



export default function AllPropertyDetail() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([])
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

    const accessToken = Cookies.get("accessToken")
    const navigate = useNavigate()
    const path = useParams()
    const propertyId = path.slug
    const companyType = Cookies.get("companyName")
    const [loader, setLoader] = useState(true)
    const [galaUpdate, setGalaUpdate] = useState(false)
    const [statusLoader, setStatusLoader] = useState(false)
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])
    const getData = () => {
        axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-gala-with-property-uid/${propertyId}/?company_type=${companyType}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((res) => {
                // console.log("data res", res.data.response)
                if (res) {
                    setData(res.data.response)
                    setLoader(false)
                }
            })
            .catch((err) => {
                console.log("data err", err)
                setLoader(false)
            })
    }
    useEffect(() => {
        getData()
    }, [navigate, galaUpdate])

    const gridStyles = {
        padding: 3,
    };

    // *********edit gala details modal*********
    const [open, setOpen] = useState(false);
    const [editGalaSize, setEditGalaSize] = useState("")
    const [editGalaPrice, setEditGalaPrice] = useState("")
    const [editGalaDetails, setEditGalaDetails] = useState()
    const [editGalaId, setEditGalaId] = useState("")

    const [galaSizeErr, setGalaSizeErr] = useState("")
    const [galaPriceErr, setGalaPriceErr] = useState("")

    const handleClose = () => setOpen(false);

    const handleOpen = (ele) => {
        setOpen(true)
        setEditGalaDetails(ele)
        setEditGalaSize(ele.gala_area_size)
        setEditGalaPrice(ele.gala_price)
        setEditGalaId(ele.uid)
    }

    useEffect(()=>{
        setGalaSizeErr("")
        setGalaPriceErr()
    },[open])

    const handleGalaSize = (e)=>{
        var spacePattern = /^$|^\S+.*/
        setEditGalaSize(e.target.value)
        if(e.target.value === ""){
            setGalaSizeErr("Required")
        }else if(!spacePattern.test(e.target.value)){
            setGalaSizeErr("Space not allowed")
        }else if(e.target.value.length>5){
            setGalaSizeErr("Ensure that there are no more than 5 digits")
        }else{
            setGalaSizeErr("")
        }
    }

    const handleGalaPrice = (e)=>{
        var spacePattern = /^$|^\S+.*/
        var alphabetPattern = /^\d+(\.\d+)?$/
        setEditGalaPrice(e.target.value)
        if(e.target.value === ""){
            setGalaPriceErr("Required")
        }else if(!spacePattern.test(e.target.value)){
            setGalaPriceErr("Space not allowed") 
        }else if(!alphabetPattern.test(e.target.value)){
            setGalaPriceErr("aphabets and negative values are not allowed") 
        }else if(e.target.value.length>6){
            setGalaPriceErr("Ensure that there are no more than 6 digits total")
        }else{
            setGalaPriceErr("")
        }
    }

    const handleUpdateGala = ()=>{

        if(editGalaSize && editGalaPrice ){
        setStatusLoader(true)
        let formData = new FormData()
        formData.append("warehouse", propertyId)
        formData.append("gala_area_size", editGalaSize)
        formData.append("gala_price", editGalaPrice)

        axios.put(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/gala-update-api/${editGalaId}/`, formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res)=>{
            // console.log("gala update res", res.data)
            if (res) {
                   
                setTimeout(() => {
                    setStatusLoader(false)
                    setOpen(false)
                }, 700)
                
                setTimeout(() => {
                    setGalaUpdate(!galaUpdate)
                 }, 2200)

                toast.success('Gala Update Successfully', {
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
        .catch((err)=>{
            console.log("gala update err", err)
            setStatusLoader(false)
        })
    }
    }
    // *********edit gala details modal*********


    return (
        <>
        {statusLoader ? <div className="loader_wrap"><div className="loader"></div></div> : <div></div>}
            <Grid container spacing={2} justifyContent="center" sx={gridStyles}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    {/* <Toolbar/> */}
                    <Toolbar />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h1>Gala Details</h1>
                        <Link to="/property/all_property"><Button variant="contained"><ArrowBackIcon /> Back</Button></Link>
                    </Box>
                    <Paper variant="outlined" sx={{
                        padding: '1em',
                        width: '100%',
                        mt: 2
                    }}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="subtitle1" sx={{ fontSize: "20px" }} gutterBottom>Gala List</Typography>
                            </Box>
                        </Grid>

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TableContainer component={Paper}>

                                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>S. No.</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Property Name</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Number</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Area Size</StyledTableCell>
                                            <StyledTableCell sx={{ borderRight: "1px solid #1976d2" }}>Gala Price</StyledTableCell>
                                            <StyledTableCell>Action</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            !loader ? data.length > 0 ?
                                                (rowsPerPage > 0
                                                    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    : data
                                                ).map((ele, i) => {
                                                    return (
                                                        <TableRow key={i}>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {page * rowsPerPage + i + 1}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {ele.warehouse__property_name}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {ele.gala_number}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {ele.gala_area_size}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ borderRight: "1px solid #e0e0e0" }}>
                                                                {ele.gala_price}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                <Button variant="contained" onClick={()=> handleOpen(ele)} style={{textTransform:"capitalize"}}>Edit</Button>
                                                            </TableCell>

                                                        </TableRow>
                                                    )
                                                })
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={6} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
                                                        No data found
                                                    </TableCell>
                                                </TableRow>
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={6} style={{ height: '250px', textAlign: 'center', fontSize: '20px' }}>
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
                                    {
                                        data !== undefined && data.length > 0 ?
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
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
                                                </TableRow>
                                            </TableFooter>
                                            : ""
                                    }
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
                className='edit_gala_modal'
            >
                <Fade in={open}>
                    <Box sx={style} className="edit_gala_form">
                        <Typography id="transition-modal-title" variant="h5" component="h2" sx={{mb:1}}>
                            Edit Gala Details
                        </Typography>
                        <Grid container spacing={1}>
                        <Grid xs={12} sm={6} md={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Property Name</h4>
                                    <TextField value={editGalaDetails && editGalaDetails.warehouse__property_name} sx={{ width: "100%", p: 1 }} className="renew_contract_input" />
                                </Grid>
                                <Grid xs={12} sm={6} md={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Gala Number</h4>
                                    <TextField value={editGalaDetails && editGalaDetails.gala_number} sx={{ width: "100%", p: 1 }} className="renew_contract_input" />
                                </Grid>
                                <Grid xs={12} sm={6} md={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Gala Area Size</h4>
                                    <TextField value={editGalaSize} onChange={handleGalaSize} sx={{ width: "100%", p: 1 }}  />
                                    {galaSizeErr ? <p style={{color:"red", fontSize:"12px", paddingLeft:"10px"}}>{galaSizeErr}</p> : "" }
                                </Grid>
                                <Grid xs={12} sm={6} md={6} item>
                                    <h4 style={{ fontWeight: "500", paddingLeft: "10px", marginTop: "10px" }}>Gala Price</h4>
                                    <TextField value={editGalaPrice} onChange={handleGalaPrice} sx={{ width: "100%", p: 1 }}  />
                                    {galaPriceErr ? <p style={{color:"red", fontSize:"12px", paddingLeft:"10px"}}>{galaPriceErr}</p> : "" }
                                </Grid>
                                <Grid xs={12} sm={12} item>
                                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                                        <Button variant="contained" onClick={handleClose} sx={{ minWidth: "100px", fontSize: "1rem", mr: 2 }} className='modal_no_btn'>Cancel</Button>
                                        <Button variant="contained" onClick={handleUpdateGala}  sx={{ minWidth: "100px", fontSize: "1rem" }}>Update</Button>
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


