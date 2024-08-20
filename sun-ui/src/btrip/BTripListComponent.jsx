import React, { useEffect, useState } from 'react';
import CoWorkComponent from '../cowork/CoWorkComponent';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const BTripListComponent = () => {
    const [bTripList, setBTripList] = useState([]);
    const [sessionEmp, setSessionEmp] = useState(null);


    useEffect(() => {
        const sessionUser = sessionStorage.getItem("user");
        if (sessionUser) {
            const parsedUser = JSON.parse(sessionUser);
            console.log("접속자 사번 : ", parsedUser.empcode)
            setSessionEmp(parsedUser.empcode);
        }
    }, []);

    useEffect(() => {

        if (!sessionEmp) {
            console.log("세션없음");
            return;
        }
        console.log("세션있음");
        const getBTrip = async (sessionEmp) => {
            try {
                const response = await axios.get(`http://localhost:8787/api/btrip/${sessionEmp}`);

                setBTripList(response.data);
            } catch (error) {
                alert("출장조회불가", error);
            }
        };
        getBTrip(sessionEmp);
        
    }, [sessionEmp]);

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <br></br>
            <h4>출장목록조회</h4>
            <table className="table table-bordered">
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>출장코드</th>
                        <th>출장지</th>
                        <th>출장목적</th>
                        <th>출장시작일</th>
                        <th>출장종료일</th>
                        <th>차량</th>
                    </tr>
                </thead>
                <tbody>
                    {bTripList.map((item, index) => (
                        <tr key={index}>
                            <td><Link to={`/btripDetail/${item.btripCode}`}>{item.btripCode}</Link></td>
                            <td>{item.btripArrival}</td>
                            <td>{item.btripDetail}</td>
                            <td>{new Date(item.btripStartDate).toLocaleDateString()}</td>
                            <td>{new Date(item.btripEndDate).toLocaleDateString()}</td>
                            <td>{item.vehicleCode}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: 50 , marginBottom:80}}>
                <CoWorkComponent />
            </div>

        </div>
    );
};

export default BTripListComponent;
