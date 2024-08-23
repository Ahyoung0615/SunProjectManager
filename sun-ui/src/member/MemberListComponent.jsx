import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const MemberListComponent = () => {
    const [emp, setEmployee] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('1');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(10); // 페이지 당 사원 수
    const [pageGroupSize] = useState(5); // 페이지 그룹 크기
    const navigate = useNavigate();

    useEffect(() => {
        // 선택된 상태에 따라 API 호출
        const fetchData = async () => {
            let url = 'http://localhost:8787/memberDetail'; // 기본 URL
            if (selectedStatus === '2') {
                url = 'http://localhost:8787/memberDetail1'; // 퇴사
            } else if (selectedStatus === '3') {
                url = 'http://localhost:8787/memberDetail2'; // 휴가
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEmployee(data);
            } catch (error) {
                console.error('Error fetching employee list:', error);
            }
        };

        fetchData();
    }, [selectedStatus]);

    const handleSelect = (eventKey) => {
        setSelectedStatus(eventKey);
        setCurrentPage(1); // 상태가 변경될 때 첫 페이지로 이동
    };

    const handleNewEmp = () => {
        window.open(
            '/memberAdd',
            '신규사원등록',
            'width=500,height=600'
        );
    };

    useEffect(() => {
        const storedUserData = window.sessionStorage.getItem("user");
        if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            setUserData(parsedData);

            if (parsedData.authorities !== '[ROLE_A]') {
                setTimeout(() => {
                    console.log("권한이없습니다");
                    console.log(parsedData.authorities);
                    setLoading(false);
                    navigate('/home');
                }, 1700);
            } else {
                console.log("권한이있습니다");
                setLoading(true);
            }
        } else {
            setTimeout(() => {
                navigate('/');
            }, 1700);
        }
    }, [navigate]);

    if (!userData || userData.authorities !== '[ROLE_A]') {
        return (
            <div style={{ marginLeft: 700, marginTop: 100 }}>
                <br />
                <div style={{ fontSize: 30, marginTop: 30 }}>
                    <b>관리자 권한이 필요합니다<br />2초 후 메인 페이지로 이동합니다</b>
                </div>
            </div>
        );
    }

    const getJobTitle = (jobCode) => {
        switch (jobCode) {
            case 1:
                return '대표';
            case 11:
                return '이사';
            case 21:
                return '부장';
            case 31:
                return '차장';
            case 41:
                return '과장';
            case 51:
                return '대리';
            case 61:
                return '주임';
            case 71:
                return '사원';
            default:
                return '직급 미정';
        }
    };

    const getDeptTitle = (deptCode) => {
        switch (deptCode) {
            case 1:
                return '경영총괄';
            case 11:
                return '경영지원';
            case 21:
                return '연구개발';
            case 31:
                return '고객지원';
            case 41:
                return '운송관리';
            case 51:
                return '품질관리';
            case 61:
                return '자재관리';
            case 71:
                return '생산제조';
            default:
                return '부서명 없음';
        }
    };

    const getStatus = (empStatus) => {
        switch (empStatus) {
            case 'Y':
                return '재직';
            case 'N':
                return '퇴사';
            case 'V':
                return '휴가';
            default:
                return '상태 미정';
        }
    };

    // 페이지네이션 로직
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = emp.slice(indexOfFirstEmployee, indexOfLastEmployee);

    // 페이지 그룹 로직
    const totalPages = Math.ceil(emp.length / employeesPerPage);
    const currentGroupStart = Math.floor((currentPage - 1) / pageGroupSize) * pageGroupSize + 1;
    const currentGroupEnd = Math.min(currentGroupStart + pageGroupSize - 1, totalPages);

    // 페이지 그룹 버튼 클릭 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 페이지 그룹 버튼 생성
    const pageButtons = [];
    for (let page = currentGroupStart; page <= currentGroupEnd; page++) {
        pageButtons.push(
            <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                    margin: '0 5px',
                    padding: '5px 10px',
                    backgroundColor: currentPage === page ? '#007bff' : '#fff',
                    color: currentPage === page ? '#fff' : '#000',
                    border: '1px solid #007bff',
                    borderRadius: '5px',
                }}
            >
                {page}
            </button>
        );
    }

    // 이전/다음 페이지 그룹 버튼
    const showPrevGroup = currentGroupStart > 1;
    const showNextGroup = currentGroupEnd < totalPages;

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <br />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h4 style={{ marginBottom: 0 }}>사원 목록 조회</h4>
                <DropdownButton
                    id="dropdown-basic-button"
                    title="재직상태"
                    onSelect={handleSelect}
                >
                    <Dropdown.Item eventKey="1">재직</Dropdown.Item>
                    <Dropdown.Item eventKey="2">퇴사</Dropdown.Item>
                    <Dropdown.Item eventKey="3">휴가</Dropdown.Item>
                </DropdownButton>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>사번</th>
                        <th>이름</th>
                        <th>부서</th>
                        <th>직급</th>
                        <th>이메일</th>
                        <th>근무내역</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map((item, index) => (
                        <tr key={index}>
                            <td><Link to={`/memberDetail/${item.empCode}`}>{item.empCode}</Link></td>
                            <td>{item.empName}</td>
                            <td>{getDeptTitle(item.deptCode)}</td>
                            <td>{getJobTitle(item.jobCode)}</td>
                            <td>{item.empEmail}</td>
                            <td>{getStatus(item.empStatus)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                {/* 이전 페이지 그룹 버튼 */}
                {showPrevGroup && (
                    <button
                        onClick={() => handlePageChange(currentGroupStart - pageGroupSize)}
                        style={{
                            margin: '0 5px',
                            padding: '5px 10px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: '1px solid #007bff',
                            borderRadius: '5px',
                        }}
                    >
                        &laquo; 이전
                    </button>
                )}
                {/* 페이지 버튼 */}
                {pageButtons}
                {/* 다음 페이지 그룹 버튼 */}
                {showNextGroup && (
                    <button
                        onClick={() => handlePageChange(currentGroupEnd + 1)}
                        style={{
                            margin: '0 5px',
                            padding: '5px 10px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: '1px solid #007bff',
                            borderRadius: '5px',
                        }}
                    >
                        다음 &raquo;
                    </button>
                )}
            </div>
            <button className="btn btn-primary" onClick={handleNewEmp} style={{ position: 'absolute', right: '190px' }}>
                신규사원 등록
            </button>
        </div>
    );
};

export default MemberListComponent;
