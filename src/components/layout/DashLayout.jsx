import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BoltIcon from '@mui/icons-material/Bolt';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import GppGoodIcon from '@mui/icons-material/GppGood';
import WaterIcon from '@mui/icons-material/Water';
import ConstructionIcon from '@mui/icons-material/Construction';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import MenuItem from '@mui/material/MenuItem';
import ApprovalIcon from '@mui/icons-material/Approval';
import PaymentIcon from '@mui/icons-material/Payment';
import LogoutIcon from '@mui/icons-material/Logout';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AddHomeIcon from '@mui/icons-material/AddHome';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Cookies from 'js-cookie';
import ListIcon from '@mui/icons-material/List';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../../src/styles/logo.png'
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {useSelector, useDispatch} from 'react-redux'
import { setPageNumber, setRowPerPageCount } from '../../redux/reducer';

const drawerWidth = 240;


const style = {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 450,
    bgcolor: 'background.paper',
    borderRadius: '5px',
    boxShadow: 24,
    pt: 3,
    pb: 3,
};

function MyLayout({ children }, props) {
    const dispatch = useDispatch()
    const [companyName, setCompanyName] = useState('')
    const companyType = Cookies.get("companyName")
    const accessToken = Cookies.get("accessToken")
    const companyId = Cookies.get("companyId")

    useEffect(() => {
        setCompanyName(companyType)
    }, [])

    // const router = useRouter()
    const navigate = useNavigate()
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [open, setOpen] = React.useState(false);
    const handleLogoutShow = () => {
        setOpen(true)
        setAnchorEl(null);
    };
    const cancleLogout = () => setOpen(false);

    const handleCloseLogout = () => {

        //logout function goes here
        Cookies.remove("accessToken")
        Cookies.remove("companyName")
        Cookies.remove("companyId")
        // router.push("/")
        navigate('/')
    }

    const handleNotification = () => {
        navigate("/notifications")
    }

    const handleClearPagination = ()=>{
        dispatch(setPageNumber(0))
        dispatch(setRowPerPageCount(10))
    }

    //=========get notification count functionality===========
    const [notificationCount, setNotificationCount] = useState("")
    const notificationState = useSelector((state) => state.adminNotification.notificationUpdate)

let socket = new WebSocket(`ws://127.0.0.1:8000/ws/room/${companyType}`);

    useEffect(() => {
        socket.onopen = function (e) {
            // console.log("[open] Connection established", e);
        };

        socket.onmessage = function (event) {
            var getJson = JSON.parse(event.data);
            // console.log(getJson.payload)
            setNotificationCount(getJson.payload.is_seen_count)
        };

        socket.onerror = function (error) {
            console.log(`[error]`);
        };
    }, [notificationState])

    useEffect(() => {
        let $bell = document.getElementById('notification_bell');
        if (notificationCount > 0) {
            $bell.classList.add('notify');
        }

        let $count = document.getElementById('notification_count');
        setTimeout(function () {
            $count.classList.add('new-not');
        }, 800);

        $bell.addEventListener("animationend", function (event) {
            $bell.classList.remove('notify');
        });
        //      $count.addEventListener("popupend", function (event) {
        //         $count.classList.remove('new-not');
        //      });
        if (notificationCount > 0) {
            $count.classList.remove('new-not');
        }
    }, [notificationCount])

    //=========get notification count functionality===========

    // ==================================================== 
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const listItemsData = [
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: <InboxIcon />
        },
        {
            name: 'Tenants',
            url: '/tenants',
            icon: <PeopleAltIcon />
        },
        {
            name: 'Leave and Licence',
            url: '/leaveAndLicense',
            icon: <PaymentIcon />
        },
        // {
        //     name: 'Plans and Approval',
        //     url: '/plansAndApproval',
        //     icon: <ApprovalIcon />
        // },
    ]



    const [ServiceOpen, setOpenService] = React.useState(false);
    const ServiceHandleClickToggle = () => {
        setOpenService(!ServiceOpen);
    };
    const [OwnerOpen, setOpenOwner] = React.useState(true);
    const OwnerHandleClickToggle = () => {
        setOpenOwner(!OwnerOpen);
    };
    const [propertyOpen, setOpenProperty] = React.useState(false);
    const PropertyHandleClickToggle = () => {
        setOpenProperty(!propertyOpen);
    };

    const [ContractOpen, setOpenContract] = React.useState(false);
    const ContractHandleClickToggle = () => {
        setOpenContract(!ContractOpen);
    };

    const [InvestorOpen, setOpenInvestor] = React.useState(false);
    const InvestorHandleClickToggle = () => {
        setOpenInvestor(!InvestorOpen);
    };
    const [FarmerOpen, setOpenFarmer] = React.useState(false);
    const FarmerHandleClickToggle = () => {
        setOpenFarmer(!FarmerOpen);
    };




    const drawer = (
        <div className='sidebar'>
            <Toolbar sx={{ justifyContent: 'center' }} >
                {/* <Box
                    component="img"
                    sx={{
                        height: 64,
                        width: '70%',
                        height: '100%',
                        padding: '1em 0em',
                    }}
                    alt="Your logo."
                    src={'/logo.png'}
                /> */}
                <Link to="/dashboard">
                    <img src={Logo} className='img-fluid' alt="omkar_logo" style={{ width: "140px", padding: "1em 0em" }} />
                </Link>

            </Toolbar>
            <Divider />
            <List>
                {listItemsData.map(({ name, url, icon }, index) => (
                    <ListItem key={index} disablePadding>
                        <Link to={url} style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton >
                                <ListItemIcon>
                                    {icon}
                                </ListItemIcon>
                                <ListItemText primary={name} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                <ListItemButton onClick={OwnerHandleClickToggle}>
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Owner" />
                    {OwnerOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={OwnerOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ backgroundColor: '#f5f5f5' }}>
                        <ListItemButton sx={{ pl: 4 }} onClick={InvestorHandleClickToggle}>
                            <ListItemIcon>
                                <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText primary="Investor" />
                            {InvestorOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={InvestorOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ backgroundColor: '#f5f5f5' }}>
                                <Link to="/investors/investors_list" style={{ width: '100%' }} onClick={handleClearPagination}>
                                    <ListItemButton style={{ paddingLeft: "38px" }}>
                                        <ListItemIcon>
                                            <ListIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Investors List" />
                                    </ListItemButton>
                                </Link>
                                <Link to="/investors/investors_property" style={{ width: '100%' }} onClick={handleClearPagination}>
                                    <ListItemButton style={{ paddingLeft: "38px" }}>
                                        <ListItemIcon>
                                            <ListIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Investors Property" />
                                    </ListItemButton>
                                </Link>
                            </List>
                        </Collapse>


                        <ListItemButton sx={{ pl: 4 }} onClick={FarmerHandleClickToggle}>
                            <ListItemIcon>
                                <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText primary="Farmer" />
                            {FarmerOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={FarmerOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ backgroundColor: '#f5f5f5' }}>
                                <Link to="/farmers/farmers_list" style={{ width: '100%' }} onClick={handleClearPagination}>
                                    <ListItemButton style={{ paddingLeft: "38px" }}>
                                        <ListItemIcon>
                                            <ListIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Farmers List" />
                                    </ListItemButton>
                                </Link>
                                <Link to="/farmers/farmers_property" style={{ width: '100%' }} onClick={handleClearPagination}>
                                    <ListItemButton style={{ paddingLeft: "38px" }}>
                                        <ListItemIcon>
                                            <ListIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Farmers Property" />
                                    </ListItemButton>
                                </Link>
                            </List>
                        </Collapse>

                        <Link to="/developers" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <PeopleAltIcon />
                                </ListItemIcon>
                                <ListItemText primary="Developer" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>
                <ListItemButton onClick={PropertyHandleClickToggle}>
                    <ListItemIcon>
                        <RoomPreferencesIcon />
                    </ListItemIcon>
                    <ListItemText primary="Property" />
                    {propertyOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={propertyOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ backgroundColor: '#f5f5f5' }}>
                        <Link to="/property/add_warehouse" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <WarehouseIcon />
                                </ListItemIcon>
                                <ListItemText primary="Add Warehouse" />
                            </ListItemButton>
                        </Link>
                        <Link to="/property/add_gala" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <AddHomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Add Gala" />
                            </ListItemButton>
                        </Link>
                        <Link to="/property/all_property" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <WarehouseIcon />
                                </ListItemIcon>
                                <ListItemText primary="All Property" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>

                <ListItemButton onClick={ServiceHandleClickToggle}>
                    <ListItemIcon>
                        <EngineeringIcon />
                    </ListItemIcon>
                    <ListItemText primary="Services" />
                    {ServiceOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={ServiceOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ backgroundColor: '#f5f5f5' }}>
                        <Link to="/services/electricity" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }} >
                                <ListItemIcon>
                                    <BoltIcon />
                                </ListItemIcon>
                                <ListItemText primary="Electricity" />
                            </ListItemButton>
                        </Link>
                        <Link to="/services/cleaning" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <CleaningServicesIcon />
                                </ListItemIcon>
                                <ListItemText primary="Cleaning" />
                            </ListItemButton>
                        </Link>
                        <Link to="/services/security" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <GppGoodIcon />
                                </ListItemIcon>
                                <ListItemText primary="Security" />
                            </ListItemButton>
                        </Link>
                        <Link to="/services/water_supply" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <WaterIcon />
                                </ListItemIcon>
                                <ListItemText primary="Water Supply" />
                            </ListItemButton>
                        </Link>
                        <Link to="/services/repair" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <ConstructionIcon />
                                </ListItemIcon>
                                <ListItemText primary="Repair" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>

                <ListItemButton onClick={ContractHandleClickToggle}>
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Contract" />
                    {ContractOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={ContractOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ backgroundColor: '#f5f5f5' }}>
                        <Link to="/contract/contract_with_investors" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <PeopleAltIcon />
                                </ListItemIcon>
                                <ListItemText primary="Investor's" />
                            </ListItemButton>
                        </Link>
                        <Link to="/contract/contract_with_farmers" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <PeopleAltIcon />
                                </ListItemIcon>
                                <ListItemText primary="Farmer" />
                            </ListItemButton>
                        </Link>
                        <Link to="/contract/contract_with_rental" style={{ width: '100%' }} onClick={handleClearPagination}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <PeopleAltIcon />
                                </ListItemIcon>
                                <ListItemText primary="Rental" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>

                <ListItem>
                    <Link to="/leave_request" style={{ width: '100%' }} onClick={handleClearPagination}>
                        <ListItemButton sx={{ p: 0 }}>
                            <ListItemIcon>
                                <TextSnippetIcon />
                            </ListItemIcon>
                            <ListItemText primary="Leave Request" />
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem>
                    <Link to="/renew_contract" style={{ width: '100%' }} onClick={handleClearPagination}>
                        <ListItemButton sx={{ p: 0 }}>
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Renew Contract" />
                        </ListItemButton>
                    </Link>
                </ListItem>
            </List>
            {/* <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;




    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                    }}
                >
                    <Toolbar sx={{ minHeight: "80px !important" }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            {companyName} Development
                        </Typography>
                        <div style={{ display: "flex" }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleNotification}
                                color="inherit"
                                className='notification_btn'
                            >
                                {notificationCount !== 0 ? <div className='notification_count' id="notification_count">{notificationCount}</div> : ""}
                                <NotificationsIcon className='notification_bell' id="notification_bell" />
                            </IconButton>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                                className='profile_btn'
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                sx={{ top: '35px' }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Link to={'/profile'} style={{ textDecoration: "none", color: '#000' }}>
                                        Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleLogoutShow}>
                                    Logout
                                </MenuItem>
                                <Modal
                                    keepMounted
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="keep-mounted-modal-title"
                                    aria-describedby="keep-mounted-modal-description"
                                    className='logout_modal'
                                >
                                    <Box sx={style} className="logout_modal_box">
                                        <Typography id="keep-mounted-modal-title" variant="h6" component="h2" sx={{ pl: 3 }}>
                                            Admin Logout
                                        </Typography>

                                        <Typography id="keep-mounted-modal-description" sx={{ borderTop: "1px solid #dbdbdb", borderBottom: "1px solid #dbdbdb", px: 3, py: 2, mt: 2, mb: 3 }}>
                                            Are you sure want to logout?
                                        </Typography>

                                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                            <Button variant="contained" className='modal_no_btn' onClick={cancleLogout} sx={{ mr: 2 }}>
                                                No
                                            </Button>
                                            <Button variant="contained" onClick={handleCloseLogout} sx={{ mr: 2 }}>
                                                Yes
                                            </Button>
                                        </Box>
                                    </Box>
                                </Modal>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                {/* <Component {...pageProps} /> */}
                {children}
            </Box>


        </>
    )
}

export default MyLayout
