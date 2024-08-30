import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames';
import styles from '../css/DocumentListComponent.module.css';
import DocumentListPaginationComponent from '../commodule/DocumentListPaginationComponent';

const DocumentAppComponent = () => {
    const [docList, setDocList] = useState([]);
    const [filteredDocList, setFilteredDocList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [sessionEmpCode, setSessionEmpCode] = useState(null);
    const [clickedButton, setClickedButton] = useState('A');
    const [status, setStatus] = useState("A");

    useEffect(() => {
        const sessionStorageInfo = window.sessionStorage.getItem("user");
        if (sessionStorageInfo) {
            try {
                const user = JSON.parse(sessionStorageInfo);
                setSessionEmpCode(user.empcode);
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
            const response = await axios.get("http://localhost:8787/api/jpa/edoc/appDocList", {
                params: {
                    eDocStatus: status,
                    empCode: sessionEmpCode,
                    page: page,
                    size: 10,
                },
            });
            setDocList(response.data.content);
            setFilteredDocList(response.data.content);
            setTotalPages(response.data.totalPages);
            console.log("server Data: ", response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStatusChange = (statusValue) => {
        console.log(statusValue.target.value);
        setStatus(statusValue.target.value);
        setClickedButton(statusValue.target.value);
    };

    const isEmpty = docList.length === 0;

    return (
        <div className="container">
            <div className={styles.ListContainer}>
                <div className={styles['table-container']}>
                    <br />
                    <h4>수신함</h4>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {/* 검색어 입력 필드 */}
                            <input
                                type="text"
                                placeholder="제목 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles['search-input']}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className={classNames('btn', { 'btn-primary': clickedButton === 'A', 'btn-secondary': clickedButton !== 'A' })}
                                style={{ borderRadius: '2px' }}
                                value="A"
                                onClick={handleStatusChange}>
                                미승인
                            </button>
                            <button
                                className={classNames('btn', { 'btn-primary': clickedButton === 'S', 'btn-secondary': clickedButton !== 'S' })}
                                style={{ borderRadius: '2px' }}
                                value="S"
                                onClick={handleStatusChange}>
                                승인
                            </button>
                            <button
                                className={classNames('btn', { 'btn-primary': clickedButton === 'R', 'btn-secondary': clickedButton !== 'R' })}
                                style={{ borderRadius: '2px' }}
                                value="R"
                                onClick={handleStatusChange}>
                                반려
                            </button>
                        </div>
                    </div>
                    <table className={classNames("table", "table-bordered", styles['doc-table'])}>
                        <thead>
                            <tr>
                                <th className={styles['th-id']}>번호</th>
                                <th>제목</th>
                                <th>작성일</th>
                                <th>작성자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredDocList.map((doc, index) =>
                                    <tr key={index}>
                                        <td><Link to={`/documentAppDetail/${doc.edocCode}/${status}`}>{doc.edocCode}</Link></td>
                                        <td>{doc.edocTitle}</td>
                                        <td>{doc.edocDate}</td>
                                        <td>{doc.empName}</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>

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
        </div>
    );
};

export default DocumentAppComponent;
