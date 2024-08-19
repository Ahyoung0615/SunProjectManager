import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminComponent from './AdminComponent';

const AdminLayout = () => {
    return (
        <AdminComponent>
            <Outlet />
        </AdminComponent>
    );
};

export default AdminLayout;
