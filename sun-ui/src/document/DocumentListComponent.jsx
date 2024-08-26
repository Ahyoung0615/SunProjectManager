import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames';
import styles from '../css/DocumentListComponent.module.css';

const DocumentListComponent = () => {

    const [docList, setDocList] = useState([]);
    const [filteredDocList, setFilteredDocList] = useState([]);
    const [status, setStatus] = useState("A");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [sessionEmpCode, setSessionEmpCode] = useState(null);

    useEffect(() => {
        const sessionStorageInfo = window.sessionStorage.getItem("user");
        if (sessionStorageInfo) {
            try {
                const user = JSON.parse(sessionStorageInfo);
                setSessionEmpCode(user.empcode);
                console.log(user.empcode);
            } catch (error) {
                console.error("Failed to parse session storage item 'user':", error);
            }
        } else {
            console.error("No 'user' item found in session storage");
        }
    }, []);

    useEffect(() => {
        if (sessionEmpCode !== null) {
            selectDocList(currentPage, status);
        }
    }, [currentPage, status, sessionEmpCode]);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocList(docList);
        } else {
            const filtered = docList.filter(doc => doc.edocTitle.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredDocList(filtered);
        }
    }, [searchTerm, docList]);

    const selectDocList = async (page) => {
        if (page < 0) {
            console.error("Page index must not be less than zero");
            page = 0;
        }

        try {
            const response = await axios.get("http://localhost:8787/api/jpa/edoc/eDocList", {
                params: {
                    status: status,
                    empCode: sessionEmpCode,
                    page: page,
                    size: 10,
                },
            });
            setDocList(response.data.content);
            setFilteredDocList(response.data.content);
            setTotalPages(response.data.totalPages);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStatusChange = (statusValue) => {
        setStatus(statusValue.target.value);
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'A': return '결재중';
            case 'S': return '결재 완료';
            case 'R': return '반려';
            case 'C': return '회수';
            default: return '';
        }
    };

    const isEmpty = docList.length === 0;
    const displayTotalPages = totalPages > 0 ? totalPages : 1;

    return (
        <div>
            <div className="container" style={{ marginTop: 30 }}>
                <br></br>
                <h4>발신함</h4>

                <div>
                    <select value={status} onChange={handleStatusChange}>
                        <option value="A">결재중</option>
                        <option value="S">결재 완료</option>
                        <option value="R">반려</option>
                        <option value="C">회수</option>
                    </select>
                </div>

                {/* 검색어 입력 필드 */}
                <input
                    type="text" placeholder="제목 검색" value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles['search-input']} style={{ marginLeft: '0'}}/>

                <table className={classNames("table", "table-bordered", styles['doc-table'])}>
                    <thead>
                        <tr>
                            <th className={styles['th-id']}>번호</th>
                            <th>제목</th>
                            <th>작성일</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredDocList.map((doc, index) =>
                                <tr key={index}>
                                    <td><Link to={`/documentDetail/${doc.edocCode}`} >{doc.edocCode}</Link></td>
                                    <td>{doc.edocTitle}</td>
                                    <td>{doc.edocDate}</td>
                                    <td>{getStatusText(doc.edocStatus)}</td>
                                </tr>
                            )}
                    </tbody>
                </table>

                {/* 페이지 네이션 버튼 */}
                <div className={styles['pagination-container']}>
                    <button
                        className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage === 0 || isEmpty })}
                        onClick={() => handlePageChange(0)}
                        disabled={currentPage === 0 || isEmpty}>
                        처음
                    </button>
                    <button
                        className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage === 0 || isEmpty })}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0 || isEmpty}>
                        이전
                    </button>
                    <span>페이지 {currentPage + 1} / {displayTotalPages}</span>
                    <button
                        className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage + 1 === totalPages || isEmpty })}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage + 1 === totalPages || isEmpty}>
                        다음
                    </button>
                    <button
                        className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage + 1 === totalPages || isEmpty })}
                        onClick={() => handlePageChange(totalPages - 1)}
                        disabled={currentPage + 1 === totalPages || isEmpty}>
                        마지막
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentListComponent;
