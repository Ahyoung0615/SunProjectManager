import React, { useState } from 'react';
import App from '../App';
import FDeliveryNowListComponent from './FDeliveryNowListComponent';
import PaginationComponent from '../commodule/PaginationComponent';
import { Link } from 'react-router-dom';

const FDeliveryListComponent = () => {

    const [fdellist, setFdellist] = useState([{
        fdelcode:'1234',
        freight: '아세테이트',
        fweight: '1',
        fdepart: '인천 서구',
        farrive: '울산 남구',
        frsvdate: '2024.08.04',
        fdeparttime: '12:30',
        farrivetime: '20:15',
        fstate:'운송완료'
    }, {fdelcode:'1233',
        freight: '구리코일',
        fweight: '1',
        fdepart: '인천 서구',
        farrive: '울산 남구',
        frsvdate: '2024.08.04',
        fdeparttime: '12:30',
        farrivetime: '20:15',
        fstate:'운송완료'}]);



    return (
        <>
        <div className="container" style={{ marginTop: 30 }}>
            <br></br>
            <h4>운송현황조회</h4>
            <p>운송내역을 출력합니다</p>
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
                    {fdellist.map((item, index) => (
                    <tr key={index}>
                        <td><Link to={`/fDeliveryDetail/${item.fdelcode}`} >{item.fdelcode}</Link></td>
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
        <div>
            <PaginationComponent/>
        </div>
        <div >
            <FDeliveryNowListComponent/>
        </div>
        
        </>
    );
};

export default FDeliveryListComponent;