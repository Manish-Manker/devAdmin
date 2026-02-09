import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {
    const token = localStorage.getItem('token')
    if (token) {
        return <Navigate to="/admin" />
    }
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default AuthLayout