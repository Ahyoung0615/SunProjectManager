import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login/LoginComponent';
import AccessComponent from './login/AccessComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import MainContentComponent from './maincontent/MainContentComponent';
import MyPageComponent from './mypage/MyPageComponent';
import AttendenceComponent from './attendence/AttendenceComponent';
import VacationListComponent from './vacation/VacationListComponent';
import TimeTableListComponent from './timetable/TimeTableListComponent';
import ReservationFormComponent from './reservation/ReservationFormComponent';
import BTripListComponent from './btrip/BTripListComponent';
import BTripFormComponent from './btrip/BTripFormComponent';
import FDeliveryRsvFormComponent from './fdelivery/FDeliveryRsvFormComponent';
import DocumentListComponent from './document/DocumentListComponent';
import DocumentDetailComponent from './document/DocumentDetailComponent';
import DocumentAppComponent from './document/DocumentAppComponent';
import DocumentAppDetailComponent from './document/DocumentAppDetailComponent';
import DocumentInsertComponent from './document/DocumentInsertComponent';
import MemberListComponent from './member/MemberListComponent';
import MemberDetailComponent from './member/MemberDetailComponent';
import MemberAddComponent from './member/MemberAddComponent';
import VehicleListComponent from './vehicle/VehicleListComponent';
import BoardListComponent from './board/BoardListComponent';
import ChatSunComponent from './chat/ChatSunComponent';
import MemberTreeComponent from './member/MemberTreeComponent';
import HeaderTopComponent from './layout/HeaderTopComponent';
import HeaderSideComponent from './layout/HeaderSideComponent';
import FooterComponent from './layout/FooterComponent';
import FDeliveryRsvListComponent from './fdelivery/FDeliveryRsvListComponent';
import FDeliveryListComponent from './fdelivery/FDeliveryListComponent';
import FDeliveryNowDetailComponent from './fdelivery/FDeliveryNowDetailComponent';
import FVehicleListComponent from './fvehicle/FVehicleListComponent';
import FVehicleFormComponent from './fvehicle/FVehicleFormComponent';
import FDeliveryDetailComponent from './fdelivery/FDeliveryDetailComponent';
import RenderingScrollTopComponent from './commodule/RenderingScrollTopComponent';
import VehicleDetailComponent from './vehicle/VehicleDetailComponent';
import BTripDetailComponent from './btrip/BTripDetailComponent';
import VehicleRentDetailComponent from './vehicle/VehicleRentDetailComponent';
import VehicleRentListComponent from './vehicle/VehicleRentListComponent';
import FVehicleDetailComponent from './fvehicle/FVehicleDetailComponent';
import Error404Component from './error/Error404Component';


import FileUploadTest from './document/FileUploadTest';

function App() {
  const [sessionAccess, setSessionAccess] = useState(false);

  useEffect(() => {
    const value = sessionStorage.getItem('user');
    setSessionAccess(value !== null);
  }, []);

  const renderComponent = (Component) => {
    return sessionAccess ? <Component /> : <Error404Component />;
    
  };

  const sessionComponent = (Component) => {
    return sessionAccess ? <Component /> : <Login />;
  }

  return (
    <Router>
      <RenderingScrollTopComponent />
      <div className="sb-nav-fixed">
      <HeaderTopComponent />
        <div id="layoutSidenav">
          <div id="layoutSidenav_nav">
          <HeaderSideComponent />
            
          </div>
          <div id="layoutSidenav_content">
            <main>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/access" element={<AccessComponent />} />
                <Route path="/home" element={sessionComponent(MainContentComponent)}/> 
                <Route path="/myPage" element={renderComponent(MyPageComponent)} />

                <Route path="/attendence" element={renderComponent(AttendenceComponent)} />
                <Route path="/vacationList" element={renderComponent(VacationListComponent)} />
                <Route path="/timeTableList" element={renderComponent(TimeTableListComponent)} />
                <Route path="/reservationForm" element={renderComponent(ReservationFormComponent)} />

                <Route path="/bTripList" element={renderComponent(BTripListComponent)} />
                <Route path="/bTripForm" element={renderComponent(BTripFormComponent)} />
                <Route path="/bTripDetail" element={renderComponent(BTripDetailComponent)} />

                <Route path="/fDeliveryList" element={renderComponent(FDeliveryListComponent)} />
                <Route path="/fDeliveryNowDetail/:fdelcode" element={renderComponent(FDeliveryNowDetailComponent)} />
                <Route path="/fDeliveryDetail/:fdelcode" element={renderComponent(FDeliveryDetailComponent)} />
                <Route path="/fDeliveryRsvList" element={renderComponent(FDeliveryRsvListComponent)} />
                <Route path="/fDeliveryRsvForm" element={renderComponent(FDeliveryRsvFormComponent)} />

                <Route path="/documentList" element={renderComponent(DocumentListComponent)} />
                <Route path="/documentDetail" element={renderComponent(DocumentDetailComponent)} />
                <Route path="/documentAppList" element={renderComponent(DocumentAppComponent)} />
                <Route path="/documentAppDetail" element={renderComponent(DocumentAppDetailComponent)} />
                <Route path="/documentInsertForm" element={renderComponent(DocumentInsertComponent)} />

                <Route path="/memberList" element={renderComponent(MemberListComponent)} />
                <Route path="/memberDetail" element={renderComponent(MemberDetailComponent)} />
                <Route path="/memberAdd" element={renderComponent(MemberAddComponent)} />
                <Route path="/memberTree" element={renderComponent(MemberTreeComponent)} />

                <Route path="/vehicleList" element={renderComponent(VehicleListComponent)} />
                <Route path="/vehicleDetail/:vehiclecode" element={renderComponent(VehicleDetailComponent)} />
                <Route path="/vehicleRentList" element={renderComponent(VehicleRentListComponent)} />
                <Route path="/vehicleRentDetail/:vrentcode" element={renderComponent(VehicleRentDetailComponent)} />

                <Route path="/fVehicleList" element={renderComponent(FVehicleListComponent)} />
                <Route path="/fVehicleForm" element={renderComponent(FVehicleFormComponent)} />
                <Route path="/fVehicleDetail/:fvehiclecode" element={renderComponent(FVehicleDetailComponent)} />

                <Route path="/boardList" element={renderComponent(BoardListComponent)} />
                <Route path="/chatSun" element={renderComponent(ChatSunComponent)} />
                
                {/* fileUpload Test */}
                <Route path='/fileTest' element={FileUploadTest}/>

                <Route path="/*" element={<Error404Component />} />
              </Routes>
            </main>
            <FooterComponent />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
