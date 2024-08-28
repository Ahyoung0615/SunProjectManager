import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MinutesListComponent = () => {
    const [employee, setEmployee] = useState(null);
    const [empCode, setEmpCode] = useState(null);
    const [minutesList, setMinutesList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            const parsedEmployee = JSON.parse(value);
            setEmployee(parsedEmployee);
            setEmpCode(parsedEmployee.empcode); // empcode 설정

            // employee 상태가 설정된 후에 getMinutesList 호출
            getMinutesList(0, parsedEmployee.empcode);
        }
    }, []);

    const getMinutesList = async (page, empCode) => {
        if (page < 0) {
            console.error("Page index must not be less than zero");
            page = 0;
        }

        try {
            const response = await axios.get("http://localhost:8787/api/minutesList", {
                params: {
                    empCode: empCode,
                    page: page,
                    size: 10,
                },
            });
            setMinutesList(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page); // currentPage 상태를 업데이트합니다.
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching minutes list:", error);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            getMinutesList(page, empCode); // empCode를 전달합니다.
        }
    };

    const isEmpty = minutesList.length === 0;
    const displayTotalPages = totalPages > 0 ? totalPages : 1;

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <br></br>
            <h4 style={{ marginBottom: "30px" }}>회의록 관리</h4>
            <Link to='/minutesForm'><button className="btn btn-secondary" style={{ marginLeft: 1180, marginTop:-50}}>신규 작성</button></Link>
            <table className="table table-bordered table-hover" style={{ textAlign: "center" }}>
                <thead style={{ backgroundColor: "#f2f2f2" }}>
                    <tr>
                        <th>회의록번호</th>
                        <th>일자</th>
                        <th>장소</th>
                        <th>참여자</th>
                        <th>작성자</th>
                        <th>제목</th>
                    </tr>
                </thead>
                <tbody>
                    {minutesList.map((item, index) => {
                        const attendees = JSON.parse(item.minutesAttendees);
                        const employeeName = attendees[item.empCode];

                        return (
                            <tr key={index}>
                                <td><Link to={`/minutesDetail/${item.minutesCode}`}>{item.minutesCode}</Link></td>
                                <td>{new Date(item.minutesDate).toLocaleDateString()}</td>
                                <td>{item.meetroomCode} 호실</td>
                                <td>
                                    {
                                        Object.entries(attendees)
                                            .map(([key, value]) => `${key} ${value}`)
                                            .join(', ')
                                    }
                                </td>
                                <td>{employeeName}</td> 
                                <td>{item.minutesSubject}</td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>

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
                        color: currentPage === 0 ? '#000' : '#fff',
                        borderRadius: "4px"
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
                        color: currentPage === 0 ? '#000' : '#fff',
                        borderRadius: "4px"
                    }}
                >
                    이전
                </button>
                <span style={{ alignSelf: "center", margin: "0 10px" }}>
                    페이지 {currentPage + 1} / {displayTotalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage + 1 >= totalPages || isEmpty}
                    style={{
                        margin: '0 5px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        border: '1px solid #ddd',
                        backgroundColor: currentPage + 1 >= totalPages ? '#f2f2f2' : '#007bff',
                        color: currentPage + 1 >= totalPages ? '#000' : '#fff',
                        borderRadius: "4px"
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
                        color: currentPage + 1 >= totalPages ? '#000' : '#fff',
                        borderRadius: "4px"
                    }}
                >
                    마지막
                </button>
                
            </div>
            
        </div>
    );
};

export default MinutesListComponent;
