import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
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
    const [vrentlist, setVrentlist] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const getVehicleRentList = async () => {
        try {
            const response = await axios.get("http://localhost:8787/api/getAllVehicleRsv", {
                params: {
                    startDate: startDate || '2020-08-13',
                    endDate: endDate || '2025-08-13',
                },
            });

            const data = response.data;
            setVrentlist(data.content);
            setFilteredList(data.content); // 초기에는 전체 데이터를 필터된 리스트로 설정
            setTotalPages(Math.ceil(data.content.length / 10));
            setCurrentPage(0);  // 페이지를 처음으로 초기화
        } catch (error) {
            console.error("배차신청서 목록 조회 실패 : ", error);
        }
    };

    const handleSelect = (eventKey) => {
        setStatusFilter(eventKey);
        if (eventKey === '') {
            setFilteredList(vrentlist); // "전체보기" 선택 시 전체 목록을 다시 설정
        } else {
            const filtered = vrentlist.filter(item => item.vrsvStatus === eventKey);
            setFilteredList(filtered);
            setTotalPages(Math.ceil(filtered.length / 10));
            setCurrentPage(0);  // 페이지를 처음으로 초기화
        }
    };

    const handleDetailToggle = (vrsvCode) => {
        setSelectedvrscvCode(vrsvCode);
        setIsvrscvCodedetailopen(!isvrscvCodedetailopen);
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    const handleSearch = () => {
        if (new Date(startDate) > new Date(endDate)) {
            setErrorMessage('시작일자가 종료일자보다 늦을 수 없습니다.');
            return;
        }
        setErrorMessage(''); // 에러 메시지 초기화
        getVehicleRentList();
    };

    const isEmpty = filteredList.length === 0;
    const displayTotalPages = totalPages > 0 ? totalPages : 1;

    useEffect(() => {
        getVehicleRentList(); // 초기 화면에 전체 목록을 표시
    }, [refresh]);

    return (
        <div className='container' style={{ marginTop: 30 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h4 style={{ marginBottom: 0 }}>배차 관리</h4>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-control"
                        style={{ marginRight: 10 }}
                    /> <b> ~ </b>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-control"
                        style={{ marginLeft:10, marginRight: 2 }}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleSearch}
                        style={{ marginRight: 30 }}
                    >
                        <i className="fas fa-search"></i>
                    </button>
                    <DropdownButton
                        id="dropdown-basic-button"
                        title="전체보기"
                        onSelect={handleSelect}
                    >
                        <Dropdown.Item eventKey="">전체보기</Dropdown.Item>
                        <Dropdown.Item eventKey="W">승인대기중</Dropdown.Item>
                        <Dropdown.Item eventKey="N">반려</Dropdown.Item>
                        <Dropdown.Item eventKey="Y">승인완료</Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>
            {errorMessage && <div style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMessage}</div>}
            <div style={{ marginTop: -30}}>
                <span>신청 번호를 누르면 상세보기</span>
            </div>
            {/* 배차 관리 테이블 */}
            <table className="table table-bordered" style={{ marginTop: 20, textAlign: "center" }}>
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                        <th style={{ width: "15%" }}>배차코드</th>
                        <th style={{ width: "20%" }}>신청자</th>
                        <th style={{ width: "15%" }}>직급</th>
                        <th style={{ width: "20%" }}>부서</th>
                        <th style={{ width: "20%" }}>기간</th>
                        <th style={{ width: "10%" }}>배차 현황</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredList.slice(currentPage * 10, (currentPage + 1) * 10).map((item, index) => (
                        <tr key={index} style={{ cursor: "pointer" }}>
                            <td style={{ color: 'blue', fontWeight: 'bold' }} onClick={() => handleDetailToggle(item.vrsvCode)}>{item.vrsvCode}</td>
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <button
                    onClick={() => handlePageChange(0)}
                    disabled={currentPage === 0 || isEmpty}
                    style={{
                        marginRight: 5,
                        padding: "5px 10px",
                        backgroundColor: currentPage === 0 || isEmpty ? "#e9ecef" : "#007bff",
                        color: currentPage === 0 || isEmpty ? "#6c757d" : "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: currentPage === 0 || isEmpty ? "not-allowed" : "pointer"
                    }}
                >
                    처음
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0 || isEmpty}
                    style={{
                        marginRight: 5,
                        padding: "5px 10px",
                        backgroundColor: currentPage === 0 || isEmpty ? "#e9ecef" : "#007bff",
                        color: currentPage === 0 || isEmpty ? "#6c757d" : "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: currentPage === 0 || isEmpty ? "not-allowed" : "pointer"
                    }}
                >
                    이전
                </button>
                <span style={{ marginRight: 5 }}>페이지 {currentPage + 1} / {displayTotalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage + 1 >= totalPages || isEmpty}
                    style={{
                        marginRight: 5,
                        padding: "5px 10px",
                        backgroundColor: currentPage + 1 >= totalPages || isEmpty ? "#e9ecef" : "#007bff",
                        color: currentPage + 1 >= totalPages || isEmpty ? "#6c757d" : "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: currentPage + 1 >= totalPages || isEmpty ? "not-allowed" : "pointer"
                    }}
                >
                    다음
                </button>
                <button
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={currentPage + 1 >= totalPages || isEmpty}
                    style={{
                        padding: "5px 10px",
                        backgroundColor: currentPage + 1 >= totalPages || isEmpty ? "#e9ecef" : "#007bff",
                        color: currentPage + 1 >= totalPages || isEmpty ? "#6c757d" : "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: currentPage + 1 >= totalPages || isEmpty ? "not-allowed" : "pointer"
                    }}
                >
                    마지막
                </button>
            </div>

            {isvrscvCodedetailopen && selectedvrscvCode && (
                <VehicleRentDetailComponent vrsvCode={selectedvrscvCode} onApproval={handleRefresh} />
            )}
        </div>
    );
};

export default VehicleRentListComponent;
