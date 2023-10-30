import { useEffect } from 'react'
import {
    Grid, Paper, Toolbar, Box, Typography, Button, TextField,
} from '@mui/material'
import React, { useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from 'axios';
import defaultUserIcon from './styles/userIcon.webp'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Profile() {
    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const accessToken = Cookies.get("accessToken")
    const [profileData, setProfileData] = useState()
    const [profilePic, setProfilePic] = useState()
    const [imgPreview, setImgPreview] = useState();
    const [loader, setLoader] = useState(false)
    const [userName, setUsername] = useState("")
    const [usernameErr, setusernameErr] = useState(false)
    useEffect(() => {
        const userAccessToken = Cookies.get("accessToken")
        if (!userAccessToken) {
            navigate('/')
        }
    }, [navigate])

    //==================get profile data start==================
    const getProfileDetail = async () => {
        await axios.get(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/get-admin-profile/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log("get profile res", res.data.response)
                setProfileData(res.data.response)
                setUsername(res.data.response.username)
            })
            .catch((err) => {
                console.log("get profile err", err)
            })
    }
    useEffect(() => {
        getProfileDetail()
    }, [navigate])
    //==================get profile data end====================

    const handlePicChange = (e) => {
        setImgPreview(URL.createObjectURL(e.target.files[0]));
        setProfilePic(e.target.files[0])
    }

    const handleUserName = (e)=>{
        setUsername(e.target.value)
        setusernameErr(false)
    }

    //==================update profile data start====================
    const handleSave = () => {
      
        if(!userName){
            setusernameErr(true)
        }
        if(userName){
            setLoader(true)
        let formData = new FormData()
        formData.append("username", userName)
        if (profilePic) {
            formData.append("profile_image", profilePic)
        }

        axios.put(`${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/update-admin-profile/`, formData, 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
            
        )
            .then((res) => {
                console.log("profile data update", res.data)
                if (res) {
                    getProfileDetail()
                    setTimeout(()=>{
                        setLoader(false)
                    },500)
                    toast.success('Profile Updated Successfully', {
                        position: "top-center",
                        autoClose: 2000,
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
                console.log("profile data update err", err)
                setLoader(false)
            })
        }

    }
    //==================update profile data end====================

    const gridStyles = {
        padding: 3,
    };



    return (
        <>
        {loader ? <div className="loader_wrap"><div className="loader"></div></div> : <div></div>}
            <Grid container spacing={2} sx={gridStyles}>
                <Grid item lg={12}>
                    <Toolbar />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h4" gutterBottom>Profile</Typography>
                        <Button variant="contained" onClick={() => navigate(-1)}><ArrowBackIcon />Back</Button>
                    </Box>

                </Grid>
                <Grid item lg={3} md={3}>
                    <Paper elevation={2} sx={{
                        padding: '2em 1em',
                        borderTop: "3px solid #1f76ce",
                    }}>
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                            <div className='Profile_image'>
                                {
                                    imgPreview ? <Image src={imgPreview} alt="icon" width="100" height="100" borderradius="100" style={{ borderRadius: "100%", border: "2px solid lightgrey" }} />
                                        :
                                        profileData && profileData.profile !== null ?
                                            <Image src={profileData.profile} alt="icon" width="100" height="100" borderradius="100" style={{ borderRadius: "100%", border: "2px solid lightgrey" }} />
                                            :
                                            <Image src={defaultUserIcon} alt="icon" width="100" height="100" borderradius="100" style={{ borderRadius: "100%", border: "2px solid lightgrey" }} />
                                }

                                <label htmlFor="file-upload" className="custom-file-upload">
                                    <CameraAltIcon />
                                </label>
                                <input id="file-upload" type="file" onChange={handlePicChange} />
                            </div>

                            <h3 style={{ marginTop: "11px", color: "#424242" }}>{profileData && profileData.username}</h3>
                            <Typography variant="subtitle1" sx={{ color: "#6d6d6d" }} gutterBottom>
                                {profileData && profileData.email}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item lg={9} md={9}>
                    <Paper elevation={2} sx={{
                        padding: '1em 0em',
                    }}>
                        <Box>
                            <Typography variant="subtitle1" gutterBottom sx={{ pl: 2, pb: 1, borderBottom: "1px solid #8080804a" }}>
                                Admin Profile Update
                            </Typography>
                            <form>

                                <Box sx={{
                                    '& .MuiTextField-root': { m: 1, width: '66ch' },
                                }}
                                    style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}
                                    noValidate
                                    autoComplete="off">
                                    <Box style={{ marginTop: "15px" }}>
                                        <h4 style={{ fontWeight: "500", paddingLeft: "15px" }}>Name</h4>
                                        {/* <TextField id="outlined-basic" variant="outlined" lable="Name" value={profileData && profileData.username}
                                            {...register("name", { required: "Required field" })}
                                            error={!!errors?.name}
                                            helperText={errors?.name ? errors.name.message : null}
                                        /> */}
                                        <input type="text"  onChange={handleUserName}
                                            value={userName}
                                            className="profile_input_field"
                                        /><br></br>
                                        {usernameErr ? <p style={{ color: "red", paddingLeft: "15px" }}>Name is Required</p> : " "}
                                    </Box>


                                    <Box style={{ marginTop: "15px" }}>
                                        <h4 style={{ fontWeight: "500", paddingLeft: "10px" }}>Email Id</h4>
                                        <TextField
                                            id="filled-read-only-input"
                                            value={profileData && profileData.email}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                            sx={{ background: "#e9ecef" }}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "15px", marginRight: "24px" }}>
                                    <Button variant="contained" onClick={handleSave} sx={{ minWidth: "100px", fontSize: "1rem" }}>Update</Button>
                                </Box>

                            </form>
                        </Box>
                    </Paper>
                </Grid>

            </Grid>

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
    )
}









