import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeaderSideComponent = () => {

    useEffect(() => {
        // Bootstrap Collapse 초기화
        const collapseElementList = [].slice.call(document.querySelectorAll('.collapse'));
        collapseElementList.map((collapseEl) => {
            return new window.bootstrap.Collapse(collapseEl, {
                toggle: false
            });
        });
    }, []);

    return (
        <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
                <div className="nav">
                    <div className="sb-sidenav-menu-heading" style={{ fontSize: 15, marginLeft: 10, color: 'white' }}>근태관리</div>
                    <Link className='nav-link' to='/attendence'>
                        <div className="sb-nav-link-icon"><i style={{ color: 'gray' }} className="bi bi-buildings-fill"></i></div>
                        출퇴근관리
                    </Link>
                    <Link className='nav-link' to='/vacationList'>
                        <div className="sb-nav-link-icon"><i style={{ color: 'gray' }} className="bi bi-calendar2-check"></i></div>
                        연가관리
                    </Link>
                    <div className="sb-sidenav-menu-heading" style={{ fontSize: 15, marginLeft: 10, color: 'white' }}>근무관리</div>
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseDutyManagement1" aria-expanded="false" aria-controls="collapseDutyManagement1">
                        <div className="sb-nav-link-icon" style={{ color: 'gray' }}><i className="bi bi-calendar2-week-fill"></i></div>
                        일정관리
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </a>
                    <div className="collapse" id="collapseDutyManagement1" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className='nav-link' to='/timeTableList'>개인일정관리</Link>
                            <Link className='nav-link' to='/reservationForm'>일정예약</Link>
                        </nav>
                    </div>
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseDutyManagement2" aria-expanded="false" aria-controls="collapseDutyManagement2">
                        <div className="sb-nav-link-icon" style={{ color: 'gray' }}><i className="bi bi-car-front-fill"></i></div>
                        출장관리
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </a>
                    <div className="collapse" id="collapseDutyManagement2" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className='nav-link' to='/bTripList'>출장목록</Link>
                            <Link className='nav-link' to='/bTripForm'>출장신청</Link>
                        </nav>
                    </div>
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseDutyManagement3" aria-expanded="false" aria-controls="collapseDutyManagement3">
                        <div className="sb-nav-link-icon" style={{ color: 'gray' }}><i className="bi bi-bus-front-fill"></i></div>
                        운송관리
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </a>
                    <div className="collapse" id="collapseDutyManagement3" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className='nav-link' to='/fDeliveryList'>운송목록</Link>
                            <Link className='nav-link' to='/fDeliveryRsvList'>운송예약목록</Link>
                        </nav>
                    </div>
                    <div className="sb-sidenav-menu-heading" style={{ fontSize: 15, marginLeft: 10, color: 'white' }}>전자결재</div>
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseDutyManagement4" aria-expanded="false" aria-controls="collapseDutyManagement4">
                        <div className="sb-nav-link-icon" style={{ color: 'gray' }}><i className="bi bi-briefcase-fill"></i>
                        </div>
                        결재문서함
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </a>
                    <div className="collapse" id="collapseDutyManagement4" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className='nav-link' to='/documentList'>발신함</Link>
                            <Link className='nav-link' to='/documentAppList'>수신함</Link>
                            <Link className='nav-link' to='/documentTempList'>임시저장</Link>
                        </nav>
                    </div>
                    <Link className='nav-link' to='/documentInsertForm'>
                        <div className="sb-nav-link-icon"><i style={{ color: 'gray' }} className="bi bi-pencil-square"></i></div>
                        결재문서작성
                    </Link>
                    <div className="sb-sidenav-menu-heading" style={{ fontSize: 15, marginLeft: 10, color: 'white' }}>관리시스템</div>
                    <Link className='nav-link' to='/memberList'>
                        <div className="sb-nav-link-icon"><i style={{ color: 'gray' }} className="bi bi-person-fill-gear"></i></div>
                        인사관리
                    </Link>
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseDutyManagement5" aria-expanded="false" aria-controls="collapseDutyManagement5">
                        <div className="sb-nav-link-icon" style={{ color: 'gray' }}><i className="bi bi-ev-front-fill"></i></div>
                        차량관리
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </a>
                    <div className="collapse" id="collapseDutyManagement5" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className='nav-link' to='/vehicleList'>차량관리</Link>
                            <Link className='nav-link' to='/vehicleRentList'>배차관리</Link>
                        </nav>
                    </div>
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseDutyManagement6" aria-expanded="false" aria-controls="collapseDutyManagement6">
                        <div className="sb-nav-link-icon" style={{ color: 'gray' }}><i className="bi bi-box-seam-fill"></i></div>
                        화물관리
                        <div className="sb-sidenav-collapse-arrow" style={{ color: 'gray' }} ><i className="fas fa-angle-down"></i></div>
                    </a>
                    <div className="collapse" id="collapseDutyManagement6" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                        <Link className='nav-link' to='/fVehicleList'>화물현황조회</Link>
                        <Link className='nav-link' to='/fVehicleForm'>화물운송신청서</Link>
                        </nav>
                    </div>
                    <div className="sb-sidenav-menu-heading" style={{ fontSize: 15, marginLeft: 10, color: 'white' }}>SUN</div>
                    <Link className='nav-link' to='/boardList'>
                        <div className="sb-nav-link-icon"><i style={{ color: 'gray' }} className="bi bi-exclamation-diamond-fill"></i></div>
                        공지사항
                    </Link>
                    <Link className='nav-link' to='/chatSun'>
                        <div className="sb-nav-link-icon"><i style={{ color: 'gray' }} className="bi bi-chat-dots-fill"></i></div>
                        사내채팅
                    </Link>
                    <Link className='nav-link' to='/memberTree'>
                        <div className="sb-nav-link-icon"><i style={{ color: 'gray' }} className="bi bi-people-fill"></i></div>
                        조직도
                    </Link>
                </div>
            </div>
            <div className="sb-sidenav-footer">
                <div className="small">SUN</div>
            </div>
        </nav>
    );
};

export default HeaderSideComponent;
