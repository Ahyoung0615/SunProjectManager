import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DocumentListPaginationComponent from '../commodule/DocumentListPaginationComponent';
import styles from '../css/DocumentListComponent.module.css';

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
            <Link to='/minutesForm'><button className="btn btn-secondary" style={{ marginLeft: 1180, marginTop: -50 }}>신규 작성</button></Link>
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
            <div className={styles['table-container']}>
                <div className={styles['pagination-wrapper']}>
                    <DocumentListPaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        isEmpty={isEmpty}
                    />
                </div>
            </div>


        </div>
    );
};

export default MinutesListComponent;
