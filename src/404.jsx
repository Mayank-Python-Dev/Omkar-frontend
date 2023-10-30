import React from 'react'
// import Link from 'next/link';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
export default function NotFound() {
    return (
        <>
            <div className='error_page_section'>
                <div className='content'>
                    <h1>404</h1>
                    <h4>Look like you're lost</h4>
                    <p>the page you are looking for not avaible!</p>
                    <Link to="/"><Button variant="contained" sx={{ mt: 3 }}>Go to Home</Button></Link>
                </div>
            </div>
        </>
    )

}


