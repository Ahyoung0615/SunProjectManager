import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BoardListComponent = () => {
    const [notices, setNotices] = useState([]);
    const [employeeNames, setEmployeeNames] = useState({});
    const [selectedStatus, setSelectedStatus] = useState('1');
    const [currentPage, setCurrentPage] = useState(1);
    const [boardPerPage] = useState(15); 
    const [pageGroupSize] = useState(5); 
    const navigate = useNavigate();
    const [emp, setEmp] = useState([]);

    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            setEmp(JSON.parse(value));
        }
    }, []); 
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                // 게시글 목록 가져오기
                const response = await fetch('http://localhost:8787/boardList');
                const data = await response.json();

                // 전체 데이터에서 state가 'I'인 것들을 먼저 정렬sortedData
                const sortedData = [
                    ...data.filter(notice => notice.notiStatus === 'I' && notice.notiDelflag === 'N'),
                    ...data.filter(notice => notice.notiStatus !== 'I' && notice.notiDelflag === 'N')
                ];

                setNotices(sortedData);

                // 사원번호 추출 후 사원이름 가져오기
                const employeeCodes = sortedData.map(notice => notice.empCode);
                const fetchEmployeeNames = async () => {
                    const data = {};
                    for (const code of employeeCodes) {
                        const empResponse = await fetch(`http://localhost:8787/api/employee/${code}`);
                        if (empResponse.ok) {
                            const empdata = await empResponse.json();
                            data[code] = {
                                empName: empdata.empName,
                                empDept: empdata.deptCode,
                            };
                        }
                    }
                    setEmployeeNames(data);
                };
                fetchEmployeeNames();
            } catch (error) {
                console.error("게시글 불러오기 오류", error);
            }
        };

        fetchBoardData();
    }, [selectedStatus]);

    const handleSelect = (eventKey) => {
        setSelectedStatus(eventKey);
        setCurrentPage(1); // 상태가 변경될 때 첫 페이지로 이동
    };

    const handleNewBoard = () => {
        // 사용자 권한을 확인하는 로직
        if (emp.authorities === "[ROLE_A]") {
            // 권한이 있는 경우
            navigate("/boardInsert");
        } else {
            // 권한이 없는 경우
            alert("관리자만 사용 가능합니다.");
        }
    };
    
    // 날짜 포맷 변경 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = String(date.getFullYear()).slice(2); // 년도 마지막 두 자리
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (2자리)
        const day = String(date.getDate()).padStart(2, '0'); // 일 (2자리)
        return `${year}.${month}.${day}`;
    };

    // 페이지네이션 로직
    const indexOfLastBoard = currentPage * boardPerPage;
    const indexOfFirstBoard = indexOfLastBoard - boardPerPage;
    const currentBoards = notices.slice(indexOfFirstBoard, indexOfLastBoard);

    // 페이지 그룹 로직
    const totalPages = Math.ceil(notices.length / boardPerPage);
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

    const getDeptTitle = (empDept) => {
        switch (empDept) {
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

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <h2>게시판 목록</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {currentBoards.map((notice, index) => (
                        <tr key={index}>
                            <td style={{ width: '60%'}}>
                                {notice.notiStatus === 'I' && <span className="badge badge-danger">중요</span>}
                                <Link to={`/boardDetail/${notice.notiCode}`}>{notice.notiTitle}</Link>
                            </td>
                            <td style={{ width: '20%'}}>{' [' + getDeptTitle(employeeNames[notice.empCode]?.empDept) + ']'}{employeeNames[notice.empCode]?.empName || notice.empCode}</td>
                            <td style={{ width: '20%'}}>{formatDate(notice.notiDate)}</td>
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
            <button className="btn btn-primary" onClick={handleNewBoard} style={{ position: 'absolute', right: '190px' }}>
                게시글 쓰기
            </button>
            
        </div>
    );
};

export default BoardListComponent;
