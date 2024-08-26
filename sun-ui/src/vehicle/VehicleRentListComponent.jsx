import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import VehicleRentDetailComponent from './VehicleRentDetailComponent';
import axios from 'axios';

const VehicleRentListComponent = () => {
    const [isvrscvCodedetailopen, setIsvrscvCodedetailopen] = useState(false);
    const [selectedvrscvCode, setSelectedvrscvCode] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [vrentlist, setVrentlist] = useState([{
        vrsvCode: '',
        empName: '',
        jobName: '',
        deptName: '',
        startDate: '',
        endDate: '',
        vrsvStatus: ''
    }]);

    const handleSelect = (eventKey) => {
        console.log("선택된 배차 현황:", eventKey);
        setStatusFilter(eventKey);
        getVehicleRentList(currentPage, startDate, endDate, eventKey);
    };

    const getVehicleRentList = async (page = 0, startDate, endDate, statusFilter) => {
        console.log("getVehicleRentList 호출됨", { page, startDate, endDate, statusFilter });

        if (page < 0) {
            console.error("Page index must not be less than zero");
            page = 0;
        }

        try {
            const response = await axios.get("http://localhost:8787/api/getAllVehicleRsv", {
                params: {
                    page: page + 1,
                    size: 10,
                    startDate: startDate || '2024-08-13',
                    endDate: endDate || '2024-08-13',
                    status: statusFilter
                },
            });

            const data = response.data;
            console.log("응답 데이터:", data);
            setVrentlist(data.content);  // setVehiclelist를 setVrentlist로 수정
            setTotalPages(data.totalPage || 1);
            setCurrentPage(page);

        } catch (error) {
            console.error("배차신청서 목록 조회 실패 : ", error);
        }
    };

    useEffect(() => {
        console.log("useEffect 실행됨", { startDate, endDate });
        getVehicleRentList(0, startDate, endDate);
    }, [startDate, endDate]);


    const handleDetailToggle = (vrscvCode) => {
        console.log("상세보기 토글", { vrscvCode });
        setSelectedvrscvCode(vrscvCode);
        setIsvrscvCodedetailopen(!isvrscvCodedetailopen);
    };

    const handlePageChange = (page) => {
        console.log("페이지 변경", { page });
        if (page >= 0 && page < totalPages) {
            getVehicleRentList(page, startDate, endDate, statusFilter);
        }
    };

    const isEmpty = vrentlist.length === 0;
    const displayTotalPages = totalPages > 0 ? totalPages : 1;

    return (
        <div className='container' style={{ marginTop: 30 }}>
            <br></br>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h4 style={{ marginBottom: 0 }}>배차 관리</h4>
                <DropdownButton
                    id="dropdown-basic-button"
                    title="전체보기"
                    onSelect={handleSelect}
                >
                    <Dropdown.Item eventKey="W">승인대기중</Dropdown.Item>
                    <Dropdown.Item eventKey="N">반려</Dropdown.Item>
                    <Dropdown.Item eventKey="Y">승인완료</Dropdown.Item>
                </DropdownButton>
            </div>
            <div style={{ marginTop: -40, marginLeft: 130 }}>
                <span>신청 번호를 누르면 상세보기</span>
            </div>
            {/* 배차 관리 테이블 */}
            <table className="table table-bordered" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>배차코드</th>
                        <th>신청자</th>
                        <th>직급</th>
                        <th>부서</th>
                        <th>기간</th>
                        <th>배차 현황</th>
                    </tr>
                </thead>
                <tbody>
                    {vrentlist.map((item, index) => (
                        <tr key={index}>
                            <td style={{ color: 'blue' }} onClick={() => handleDetailToggle(item.vrsvCode)}><b>{item.vrsvCode}</b></td>
                            <td>{item.empName}</td>
                            <td>{item.jobName}</td>
                            <td>{item.deptName}</td>
                            <td>{item.startDate} - {item.endDate}</td>
                            <td>
                                {item.vrsvStatus === 'N' ? (
                                    <span className="badge badge-danger">반려</span>
                                ) : item.vrsvStatus === 'W' ? (
                                    <span className="badge badge-primary">대기</span>
                                ) : (
                                    <span className="badge badge-success">승인</span>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 페이지네이션 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <button
                    onClick={() => handlePageChange(0)}
                    disabled={currentPage === 0 || isEmpty}
                    style={{
                        margin: '0 5px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        border: '1px solid #ddd',
                        backgroundColor: currentPage === 0 ? '#f2f2f2' : '#007bff',
                        color: currentPage === 0 ? '#000' : '#fff'
                    }}
                >
                    처음
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0 || isEmpty}
                    style={{
                        margin: '0 5px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        border: '1px solid #ddd',
                        backgroundColor: currentPage === 0 ? '#f2f2f2' : '#007bff',
                        color: currentPage === 0 ? '#000' : '#fff'
                    }}
                >
                    이전
                </button>
                <span>페이지 {currentPage + 1} / {displayTotalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage + 1 >= totalPages || isEmpty}
                    style={{
                        margin: '0 5px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        border: '1px solid #ddd',
                        backgroundColor: currentPage + 1 >= totalPages ? '#f2f2f2' : '#007bff',
                        color: currentPage + 1 >= totalPages ? '#000' : '#fff'
                    }}
                >
                    다음
                </button>
                <button
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={currentPage + 1 >= totalPages || isEmpty}
                    style={{
                        margin: '0 5px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        border: '1px solid #ddd',
                        backgroundColor: currentPage + 1 >= totalPages ? '#f2f2f2' : '#007bff',
                        color: currentPage + 1 >= totalPages ? '#000' : '#fff'
                    }}
                >
                    마지막
                </button>
            </div>

            {isvrscvCodedetailopen && selectedvrscvCode && (
                <div>
                    <VehicleRentDetailComponent vrentlist={vrentlist.find(item => item.vrentcode === selectedvrscvCode)} />
                </div>
            )}
        </div>
    );
};

export default VehicleRentListComponent;
