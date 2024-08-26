import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from '../css/DocumentListComponent.module.css';

const DocumentTempListComponent = () => {
    const [docTempList, setDocTempList] = useState([]);
    const [filteredDocList, setFilteredDocList] = useState([]);
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
            selectDocList(currentPage);
        }
    }, [currentPage, sessionEmpCode]);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocList(docTempList);
        } else {
            const filtered = docTempList.filter(doc => doc.edtempTitle.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredDocList(filtered);
        }
    }, [searchTerm, docTempList]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const selectDocList = async (page) => {
        try {
            const response = await axios.get("http://localhost:8787/api/jpa/edoc/eDocTempList", {
                params: {
                    empCode: sessionEmpCode,
                    page: page,
                    size: 10,
                },
            });
            setDocTempList(response.data.content);
            setFilteredDocList(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching document list:", error);
        }
    };

    const isEmpty = docTempList.length === 0;
    const displayTotalPages = totalPages > 0 ? totalPages : 1;

    return (
        <div>
            <div className="container" style={{ marginTop: 30 }}>
                <br></br>
                <h4>임시저장</h4>

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
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredDocList.map((doc, index) =>
                                <tr key={index}>
                                    <td><Link to={`/documentTempDetail/${doc.edocCode}`} >{doc.edocCode}</Link></td>
                                    <td>{doc.edocTitle}</td>
                                    <td>{doc.edocDate}</td>
                                </tr>
                            )}
                    </tbody>
                </table>
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

export default DocumentTempListComponent;
