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
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가

    useEffect(() => {
        // currenPage, status 변경 사항있을 때 실행
        selectDocList(currentPage, status);
    }, [currentPage, status]);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocList(docList);
        } else {
            const filtered = docList.filter(doc => doc.edocTitle.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredDocList(filtered);
        }
    }, [searchTerm, docList]);

    const selectDocList = async (page) => {
        try {
            const response = await axios.get("http://localhost:8787/api/edoc/eDocList", {
                params: {
                    status: status,
                    page: page,
                    size: 10,
                },
            });
            setDocList(response.data.content);
            setFilteredDocList(response.data.content); // 초기에는 전체 문서 리스트로 설정
            setTotalPages(response.data.totalPages);
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
            case 'A': return '결재중'; // 'P' 상태일 때 '결재중'으로 표시
            case 'S': return '결재 완료'; // 'C' 상태일 때 '결재 완료'로 표시
            case 'R': return '반려'; // 'R' 상태일 때 '반려'으로 표시
        }
    };

    return (
        <div>
            <a href='/fileTest'>파일 테스트</a>
            <div className="container" style={{ marginTop: 30 }}>
                <br></br>
                <h4>발신함</h4>

                <div>
                    <select value={status} onChange={handleStatusChange}>
                        <option value="A">결재중</option>
                        <option value="S">결재 완료</option>
                        <option value="R">반려</option>
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
                                    <td>{getStatusText(doc.edocStatus)}</td> {/* 상태에 따라 텍스트 표시 */}
                                </tr>
                            )}
                    </tbody>
                </table>
                <div className={styles['pagination-container']}>
                    <button
                        className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage === 0 })}
                        onClick={() => handlePageChange(0)}
                        disabled={currentPage === 0}>
                        처음
                    </button>
                    <button
                        className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage === 0 })}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}>
                        이전
                    </button>
                    <span>페이지 {currentPage + 1} / {totalPages}</span>
                    <button
                        className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage + 1 === totalPages })}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage + 1 === totalPages}>
                        다음
                    </button>
                    <button
                        className={classNames(styles['pagination-button'], { [styles['disabled']]: currentPage + 1 === totalPages })}
                        onClick={() => handlePageChange(totalPages - 1)}
                        disabled={currentPage + 1 === totalPages}>
                        마지막
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentListComponent;
