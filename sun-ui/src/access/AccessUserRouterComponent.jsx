import React from 'react';
import { Outlet } from 'react-router-dom';
import AccessUserComponent from './AccessUserComponent';

const AccessUserRouterComponent = () => {
    return (
        <div>
            <AccessUserComponent>
            <Outlet />
            </AccessUserComponent>
        </div>
    );
};

export default AccessUserRouterComponent;