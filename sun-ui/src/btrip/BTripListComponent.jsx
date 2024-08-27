import React, { useEffect, useState } from 'react';
import CoWorkComponent from '../cowork/CoWorkComponent';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BTripCalComponent from './BTripCalComponent';

const BTripListComponent = () => {
    const [bTripList, setBTripList] = useState([]);
    const [sessionEmp, setSessionEmp] = useState(null);
    const [clickedButton, setClickedButton] = useState('list'); 
    const [showlist, setShowlist] = useState(true);

    useEffect(() => {
        const sessionUser = sessionStorage.getItem("user");
        if (sessionUser) {
            const parsedUser = JSON.parse(sessionUser);
            console.log("접속자 사번 : ", parsedUser.empcode);
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

    const handleButtonClick = (buttonType) => {
        setClickedButton(buttonType);
        setShowlist(buttonType === 'list');
    };

    return (
        <div className="container" style={{ marginTop: 30, maxWidth: '80%' }}>
            <br></br>
            <h4>출장목록조회</h4>
            <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                <button 
                    className={`btn ${clickedButton === 'list' ? 'btn-primary' : 'btn-secondary'}`} 
                    style={{ borderRadius: '2px' }} 
                    onClick={() => handleButtonClick('list')}
                >
                    목록
                </button>
                <button 
                    className={`btn ${clickedButton === 'calendar' ? 'btn-primary' : 'btn-secondary'}`} 
                    style={{ borderRadius: '2px' }} 
                    onClick={() => handleButtonClick('calendar')}
                >
                    캘린더
                </button>
            </div>
            {showlist ? (
                <div style={{ overflowX: 'auto' }}>
                    <table className="table table-bordered" style={{ minWidth: '100%', textAlign: 'center' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ width: '10%' }}>출장코드</th>
                                <th style={{ width: '30%' }}>출장지</th>
                                <th style={{ width: '28%' }}>출장목적</th>
                                <th style={{ width: '13%' }}>출장시작일</th>
                                <th style={{ width: '13%' }}>출장종료일</th>
                                <th style={{ width: '6%' }}>차량</th>
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
                                    <td>{item.vehicleCode === null ? "미사용" : item.vehicleCode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <BTripCalComponent bTripList={bTripList} />
            )}
            <div style={{ marginTop: '50px', marginBottom: '80px' }}>
                <CoWorkComponent />
            </div>
        </div>
    );
};

export default BTripListComponent;
