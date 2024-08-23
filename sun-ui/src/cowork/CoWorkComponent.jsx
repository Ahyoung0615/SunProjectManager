import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CoWorkMapComponent from './CoWorkMapComponent';

const CoWorkComponent = ({onSelect}) => {
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
                    page: page + 1,  // 페이지는 1부터 시작하므로 +1
                    size: 5,        // 페이지당 10개의 항목
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
        setCurrentPage(0);  // 검색 시 첫 페이지로 이동
        fetchCoWorkList(0); // 검색 버튼 클릭 시 조회
    };

    const getcowOneAddress = (cowAddress) => {
        console.log("Selected Address:", cowAddress);
        setSelectedAddress(cowAddress);
        if (onSelect) {
            onSelect(cowAddress);  // 상위 컴포넌트에 선택된 주소를 전달
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
        <div>
            <h4 style={{marginTop:30}}>협력사 정보</h4>
            <div style={{ display: 'flex', marginTop: 50 }}>

                <CoWorkMapComponent selectedAddress={selectedAddress} />

                <div style={{ marginLeft: '20px', width: '50%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: 70 }}>
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            style={{ height: 40, width: 80 }}
                        >
                            <option value="cowName">이름</option>
                            <option value="cowAddress">주소</option>
                        </select>
                        <input
                            type="text"
                            placeholder="검색어를 입력해주세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{ height: 40, width: '60%', padding: '10px', border: '1px solid #ddd' }}
                        />
                        <button
                            onClick={handleSearch}  // 검색 버튼 클릭 시 조회
                            style={{
                                height: 40,
                                padding: 10,
                                cursor: 'pointer',
                                border: '1px solid #ddd',
                                backgroundColor: '#f2f2f2'
                            }}
                        >
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th>협력사번</th>
                                <th>사명</th>
                                <th>주소</th>
                                <th>번호</th>
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
                                            <button type="button" className="btn btn-link" style={{ margin: -7 }} onClick={() => getcowOneAddress(item.cowAddress)}>
                                                {item.cowAddress}
                                            </button>
                                        </td>
                                        <td>{item.cowTel}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* 페이지네이션 버튼 */}
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
                                color: currentPage === 0 ? '#000' : '#fff'
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
                                color: currentPage === 0 ? '#000' : '#fff'
                            }}
                        >
                            이전
                        </button>
                        <span>페이지 {currentPage + 1} / {displayTotalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage + 1 >= totalPages || isEmpty}
                            style={{
                                margin: '0 5px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                border: '1px solid #ddd',
                                backgroundColor: currentPage + 1 >= totalPages ? '#f2f2f2' : '#007bff',
                                color: currentPage + 1 >= totalPages ? '#000' : '#fff'
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
                                color: currentPage + 1 >= totalPages ? '#000' : '#fff'
                            }}
                        >
                            마지막
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoWorkComponent;
