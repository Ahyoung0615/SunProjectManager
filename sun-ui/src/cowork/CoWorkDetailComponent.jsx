import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CoWorkDetailComponent = ({ cowCode }) => {
    const [coworkDetail, setCoworkDetail] = useState(null);

    useEffect(() => {
        const fetchCoworkDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8787/api/coWorkDetail/${cowCode}`);
                setCoworkDetail(response.data);
            } catch (error) {
                console.error("Error fetching cowork detail:", error);
            }
        };

        if (cowCode) {
            fetchCoworkDetail();
        }
    }, [cowCode]);

    if (!coworkDetail) {
        return <div>로딩 중...</div>;
    }

    return (
        <div >
            <h4>협력사 상세 정보</h4>
            <br></br>
            <table className="table table-bordered" style={{ textAlign: 'center', width: '80%', margin: '0 auto' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ width: '10%' }}>협력업체코드</th>
                        <th style={{ width: '10%' }}>업체명</th>
                        <th style={{ width: '30%' }}>주소</th>
                        <th style={{ width: '10%' }}>전화번호</th>
                        <th style={{ width: '10%' }}>협력담당자</th>
                        <th style={{ width: '10%' }}>직급</th>
                        <th style={{ width: '10%' }}>등록일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{coworkDetail.cowCode}</td>
                        <td>{coworkDetail.cowName}</td>
                        <td>{coworkDetail.cowAddress}</td>
                        <td>{coworkDetail.cowTel}</td>
                        <td>{coworkDetail.cowManager}</td>
                        <td>{coworkDetail.cowMgrjob}</td>
                        <td>{coworkDetail.cowRegdate}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CoWorkDetailComponent;
