import React from 'react';
import AdminComponent from './AdminComponent';
import MemberDetailComponent from '../member/MemberDetailComponent';
import MemberListComponent from '../member/MemberListComponent';


import RepairListComponent from '../vehicle/RepairListComponent';
import VehicleDetailComponent from '../vehicle/VehicleDetailComponent';
import VehicleFormComponent from '../vehicle/VehicleFormComponent';
import VehicleListComponent from '../vehicle/VehicleListComponent';
import VehicleRentDetailComponent from '../vehicle/VehicleRentDetailComponent';
import VehicleRentFormComponent from '../vehicle/VehicleRentFormComponent';
import VehicleRentListComponent from '../vehicle/VehicleRentListComponent';
import VehicleRepairFormComponent from '../vehicle/VehicleRepairFormComponent';

export const AdMemberDetail = () => (
    <AdminComponent>
        <MemberDetailComponent />
    </AdminComponent>
);

export const AdMemberList = () => (
    <AdminComponent>
        <MemberListComponent />
    </AdminComponent>
);



export const AdRepairList = () => (
    <AdminComponent>
        <RepairListComponent />
    </AdminComponent>
);

export const AdVehicleDetail = () => (
    <AdminComponent>
        <VehicleDetailComponent />
    </AdminComponent>
);

export const AdVehicleForm = () => (
    <AdminComponent>
        <VehicleFormComponent />
    </AdminComponent>
);

export const AdVehicleList = () => (
    <AdminComponent>
        <VehicleListComponent />
    </AdminComponent>
);

export const AdVehicleRentDetail = () => (
    <AdminComponent>
        <VehicleRentDetailComponent />
    </AdminComponent>
);

export const AdVehicleRentForm = () => (
    <AdminComponent>
        <VehicleRentFormComponent />
    </AdminComponent>
);

export const AdVehicleRentList = () => (
    <AdminComponent>
        <VehicleRentListComponent />
    </AdminComponent>
);

export const AdVehicleRepairForm = () => (
    <AdminComponent>
        <VehicleRepairFormComponent />
    </AdminComponent>
);