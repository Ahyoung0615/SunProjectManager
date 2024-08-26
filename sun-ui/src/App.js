import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login/LoginComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import HeaderTopComponent from './layout/HeaderTopComponent';
import HeaderSideComponent from './layout/HeaderSideComponent';
import FooterComponent from './layout/FooterComponent';
import RenderingScrollTopComponent from './commodule/RenderingScrollTopComponent';
import Error404Component from './error/Error404Component';

// Admin Protected Components
import {
    AdMemberDetail,
    AdMemberList,
    AdRepairList,
    AdVehicleDetail,
    AdVehicleForm,
    AdVehicleList,
    AdVehicleRentDetail,
    AdVehicleRentForm,
    AdVehicleRentList,
    AdVehicleRepairForm
} from './access/AdminProtectedComponent';

// User Protected Components
import {
    AUAttendence,
    AUBoardList,
    AUBTripDetail,
    AUBTripForm,
    AUBTripList,
    AUChatSun,
    AUChatRoom,
    AUCalendar,
    AUDateTime,
    AUNowTime,
    AUModal,
    AUOrgChart,
    AUPagination,
    AUCoWork,
    AUCoWorkMap,
    AUDocumentApp,
    AUDocumentDetail,
    AUDocumentAppDetail,
    AUDocumentInsert,
    AUDocumentList,
    AUDocumentTempDetail,
    AUDocumentTempList,
    AUExpenseApproval,
    AUVacationDoc,
    AUFDeliveryCalRsvList,
    AUFDeliveryDetail,
    AUFDeliveryList,
    AUFDeliveryNowDetail,
    AUFDeliveryNowList,
    AUFDeliveryRsvForm,
    AUFDeliveryRsvList,
    AUFVehicleDetail,
    AUFVehicleForm,
    AUFVehicleList,
    AUMainContent,
    AUMyPage,
    AUTimeTableList,
    AUVacationList,
    AUBoardDetail,
    AUBoardInsert,
    AUBoardUpdate
} from './access/AccessUserProtectedComponent';

function App() {

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
                                {/* Public Routes */}
                                <Route path="/" element={<Login/>} />

                                {/* User Protected Routes */}
                                <Route path="/home" element={<AUMainContent />} />
                                <Route path="/myPage" element={<AUMyPage />} />
                                <Route path="/attendence" element={<AUAttendence />} />
                                <Route path="/vacationList" element={<AUVacationList />} />
                                <Route path="/timeTableList" element={<AUTimeTableList />} />

                                {/* Admin Protected Routes */}
                                <Route path="/memberList" element={<AdMemberList />} />
                                <Route path="/memberDetail/:empCode" element={<AdMemberDetail />} />
                                <Route path="/vehicleList" element={<AdVehicleList />} />
                                <Route path="/vehicleDetail/:vehicleCode" element={<AdVehicleDetail />} />
                                <Route path="/vehicleRentList" element={<AdVehicleRentList />} />
                                <Route path="/vehicleRentDetail/:vrentCode" element={<AdVehicleRentDetail />} />
                                <Route path="/vehicleForm" element={<AdVehicleForm />} />
                                <Route path="/vehicleRepairForm" element={<AdVehicleRepairForm />} />
                                <Route path="/repairList" element={<AdRepairList />} />

                                {/* User Protected Routes Continued */}
                                <Route path="/boardList" element={<AUBoardList />} />
                                <Route path="/boardInsert" element={<AUBoardInsert />} />
                                <Route path="/boardDetail/:notiCode" element={<AUBoardDetail />} />
                                <Route path="/boardUpdate/:notiCode" element={<AUBoardUpdate />} />
                                <Route path="/chatSun" element={<AUChatSun />} />
                                <Route path="/chatRoom/:chatroomCode" element={<AUChatRoom/>} />
                                <Route path="/bTripList" element={<AUBTripList />} />
                                <Route path="/bTripForm" element={<AUBTripForm />} />
                                <Route path="/bTripDetail/:btripCode" element={<AUBTripDetail />} />
                                <Route path="/calendar" element={<AUCalendar />} />
                                <Route path="/dateTime" element={<AUDateTime />} />
                                <Route path="/nowTime" element={<AUNowTime />} />
                                <Route path="/modal" element={<AUModal />} />
                                <Route path="/orgChart" element={<AUOrgChart />} />
                                <Route path="/pagination" element={<AUPagination />} />
                                <Route path="/coWork" element={<AUCoWork />} />
                                <Route path="/coWorkMap" element={<AUCoWorkMap />} />
                                <Route path="/documentAppList" element={<AUDocumentApp />} />
                                <Route path="/documentDetail/:edocCode" element={<AUDocumentDetail />} />
                                <Route path="/documentAppDetail/:edocCode" element={<AUDocumentAppDetail />} />
                                <Route path="/documentInsert" element={<AUDocumentInsert />} />
                                <Route path="/documentList" element={<AUDocumentList />} />
                                <Route path="/documentTempDetail/:edtempCode" element={<AUDocumentTempDetail />} />
                                <Route path="/documentTempList" element={<AUDocumentTempList />} />
                                <Route path="/expenseApproval" element={<AUExpenseApproval />} />
                                <Route path="/vacationDoc" element={<AUVacationDoc />} />
                                <Route path="/fDeliveryCalRsvList" element={<AUFDeliveryCalRsvList />} />
                                <Route path="/fDeliveryDetail/:fdelcode" element={<AUFDeliveryDetail />} />
                                <Route path="/fDeliveryList" element={<AUFDeliveryList />} />
                                <Route path="/fDeliveryNowDetail/:fdelcode" element={<AUFDeliveryNowDetail />} />
                                <Route path="/fDeliveryNowList" element={<AUFDeliveryNowList />} />
                                <Route path="/fDeliveryRsvForm" element={<AUFDeliveryRsvForm />} />
                                <Route path="/fDeliveryRsvList" element={<AUFDeliveryRsvList />} />
                                <Route path="/fVehicleDetail/:fvehiclecode" element={<AUFVehicleDetail />} />
                                <Route path="/fVehicleForm" element={<AUFVehicleForm />} />
                                <Route path="/fVehicleList" element={<AUFVehicleList />} />

                                {/* Fallback Route */}
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
