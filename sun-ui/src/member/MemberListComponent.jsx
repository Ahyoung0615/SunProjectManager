// MemberListComponent.js
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MemberAddModal from './MemberAddModal';
import MemberList from './MemberList';
import Pagination from './Pagination';

const MemberListComponent = () => {
    const [emp, setEmployee] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('1');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(10); // 페이지 당 사원 수
    const [pageGroupSize] = useState(5); // 페이지 그룹 크기
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
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
        setShowModal(true); // 모달 열기
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

    // 페이지 그룹 버튼 클릭 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleAddSuccess = () => {
        // 사원 추가 성공 후 리스트 새로고침
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
    };

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
            <MemberList
                employees={currentEmployees}
                getDeptTitle={getDeptTitle}
                getJobTitle={getJobTitle}
                getStatus={getStatus}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageGroupSize={pageGroupSize}
                onPageChange={handlePageChange}
            />
            <button className="btn btn-primary" onClick={handleShow} style={{ position: 'absolute', right: '190px' }}>
                사원 등록
            </button>
            <MemberAddModal show={showModal} handleClose={handleClose} onSuccess={handleAddSuccess} />
        </div>
    );
};

export default MemberListComponent;
