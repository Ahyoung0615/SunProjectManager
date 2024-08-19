import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CoWorkMapComponent from './CoWorkMapComponent';

const CoWorkComponent = () => {
    const [coworkList, setCoworkList] = useState([]);
    const [searchType, setSearchType] = useState("cowName");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");

    const searchCoWork = async () => {
        console.log("Search function called");
        console.log("searchKeyword", searchKeyword);
        console.log("searchType", searchType);
        try {
            const response = await axios.get("http://localhost:8787/api/cowork", {
                params: {
                    first: 1,
                    last: 5,
                    [searchType]: searchKeyword
                }
            });
            setCoworkList(response.data);
        } catch (error) {
            console.error("검색 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        searchCoWork();
    }, []);


    const getcowOneAddress = (cowAddress) => {
        console.log("Selected Address:", cowAddress); // 주소가 제대로 전달되는지 확인
        setSelectedAddress(cowAddress);
    };

    useEffect(() => {
        console.log("선택주소:", selectedAddress);
    }, [selectedAddress]);


    return (
        <div>
            <h4>협력사 정보</h4>
            <div style={{ display: 'flex', marginTop: '20px' }}>

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
                            onClick={() => {
                                console.log("Button clicked");
                                searchCoWork();
                            }}
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
                            {coworkList.length === 0 ? (
                                <tr>
                                    <td colSpan="4">검색 결과가 없습니다</td>
                                </tr>
                            ) : (
                                coworkList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.cowCode}</td>
                                        <td>{item.cowName}</td>
                                        <td>
                                            <button type="button" className="btn btn-link" style={{margin:-7}} onClick={() => getcowOneAddress(item.cowAddress)}>
                                                {item.cowAddress}
                                            </button>
                                        </td>
                                        <td>{item.cowTel}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default CoWorkComponent;
