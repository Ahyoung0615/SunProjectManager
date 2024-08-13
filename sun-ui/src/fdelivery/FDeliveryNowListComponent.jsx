import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FDeliveryNowListComponent = () => {

    const navigate = useNavigate(); 

    const [fdelnowlist, setFdelnowlist] = useState([{
        fdelcode:'1234',
        freight: '아세테이트',
        fweight: '1',
        fdepart: '인천 서구',
        farrive: '울산 남구',
        frsvdate: '2024.08.04',
        fdeparttime: '12:30',
        farrivetime: '20:15',
        fstate:'운송완료'
    }]);

    const showDetail = (fdelcode) => {
        navigate(`/fDeliveryNowDetail/${fdelcode}`); 
    };

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <br></br>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>현재운송현황조회</h4>
                <button type="button" className="btn btn-primary" style={{ fontSize: 14, marginRight:10 }} onClick={() => showDetail(fdelnowlist[0].fdelcode)}>
                    상세보기
                </button>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>운송코드</th>
                        <th>화물</th>
                        <th>용량(t)</th>
                        <th>출발지</th>
                        <th>도착지</th>
                        <th>운송일자</th>
                        <th>출발시각</th>
                        <th>도착시각</th>
                        <th>현황</th>
                    </tr>
                </thead>
                <tbody>
                    {fdelnowlist.map((item, index) => (
                    <tr key={index}>
                        <td>{item.fdelcode}</td>
                        <td>{item.freight}</td>
                        <td>{item.fweight}</td>
                        <td>{item.fdepart}</td>
                        <td>{item.farrive}</td>
                        <td>{item.frsvdate}</td>
                        <td>{item.fdeparttime}</td>
                        <td>{item.farrivetime}</td>
                        <td>{item.fstate}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FDeliveryNowListComponent;
