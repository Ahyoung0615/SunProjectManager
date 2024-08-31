import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CoWorkMapComponent from './CoWorkMapComponent';
import DocumentListPaginationComponent from '../commodule/DocumentListPaginationComponent';
import styles from '../css/DocumentListComponent.module.css';

const CoWorkSelectComponent = ({ onAddressSelect }) => {
    const [coworkList, setCoworkList] = useState([]);
    const [searchType, setSearchType] = useState("cowName");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCoWorkList = async (page = 0) => {
        if (page < 0) {
            console.error("Page index must not be less than zero");
            page = 0;
        }

        try {
            const response = await axios.get("http://localhost:8787/api/cowork", {
                params: {
                    page: page + 1,
                    size: 5,
                    [searchType]: searchKeyword
                }
            });

            const data = response.data;
            setCoworkList(data.content || []);
            setTotalPages(data.totalPage || 1);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching cowork list:", error);
            setCoworkList([]);
        }
    };

    const handleSearch = () => {
        setCurrentPage(0);
        fetchCoWorkList(0);
    };

    const handleAddressClick = (address) => {
        if (onAddressSelect) {
            onAddressSelect(address); // 주소를 부모 컴포넌트로 전달
        }
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            fetchCoWorkList(page);
        }
    };

    useEffect(() => {
        fetchCoWorkList(0, true);
    }, []);

    const isEmpty = coworkList.length === 0;
    const displayTotalPages = totalPages > 0 ? totalPages : 1;

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <h4 style={{ marginBottom: '20px', textAlign: 'center' }}>협력사 정보</h4>
            <br />
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, marginRight: '20px' }}>
                    <CoWorkMapComponent selectedAddress={selectedAddress} />
                </div>

                <div style={{ flex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'center' }}>
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            style={{
                                height: '40px',
                                width: '100px',
                                borderRadius: '5px',
                                border: '1px solid #ccc'
                            }}
                        >
                            <option value="cowName">이름</option>
                            <option value="cowAddress">주소</option>
                        </select>
                        <input
                            type="text"
                            placeholder="검색어를 입력해주세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{
                                height: '40px',
                                width: '40%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc'
                            }}
                        />
                        <button
                            onClick={handleSearch}
                            style={{
                                height: '40px',
                                padding: '0 20px',
                                cursor: 'pointer',
                                borderRadius: '5px',
                                marginRight: '2px',
                                border: '1px solid #007bff',
                                backgroundColor: '#007bff',
                                color: '#fff'
                            }}
                        >
                            검색
                        </button>
                    </div>
                    <table className="table table-bordered" style={{ textAlign: 'center', width: '100%' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ width: '14%' }}>코드</th>
                                <th style={{ width: '16%' }}>사명</th>
                                <th style={{ width: '54%' }}>주소</th>
                                <th style={{ width: '16%' }}>번호</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isEmpty ? (
                                <tr>
                                    <td colSpan="4">검색 결과가 없습니다</td>
                                </tr>
                            ) : (
                                coworkList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.cowCode}</td>
                                        <td>{item.cowName}</td>
                                        <td>
                                            <button type="button" className="btn btn-link" style={{ padding: 0 }} onClick={() => handleAddressClick(item.cowAddress)}>
                                                {item.cowAddress}
                                            </button>
                                        </td>
                                        <td>{item.cowTel}</td>
                                    </tr>
                                ))
                            )}
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
            </div>
        </div>
    );
};

export default CoWorkSelectComponent;
