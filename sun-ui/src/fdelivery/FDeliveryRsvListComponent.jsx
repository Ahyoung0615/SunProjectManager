import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FDeliveryCalRsvListComponent from './FDeliveryCalRsvListComponent';

const FDeliveryRsvListComponent = () => {

    const [showlist, setShowlist] = useState(true);
    const [clickedButton, setClickedButton] = useState('list'); 
    const [fdeliverylist, setFdeliverylist] = useState([
        {
            fedlcode: '1234',
            freight: '구리코일',
            fweight: '1',
            fdepart: '부산 북구',
            farrive: '서울 구로구',
            frsvdate: '2024.09.04',
            fvehiclecode: '1가1234'
        }
    ]);


    /*useEffect(() => {
        // 데이터를 가져오는 비동기 함수 정의
        const fetchData = async () => {
            try {
                const response = await fetch('https://example.com/api/fdeliverylist'); // 실제 API 엔드포인트로 변경하세요.
                const data = await response.json(); // JSON 데이터를 파싱합니다.
                setFdeliverylist(data); // 데이터를 상태로 설정
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // 데이터 가져오기 함수 호출
        fetchData();
    }, []); // 빈 배열은 이 useEffect가 컴포넌트가 처음 렌더링될 때 한 번만 실행되도록 합니다.
        
    useEffect(() => {
        // 데이터를 가져오는 비동기 함수 정의
        const fetchData = async () => {
            try {
                const response = await axios.get('https://example.com/api/fdeliverylist'); // 실제 API 엔드포인트로 변경하세요.
                setFdeliverylist(response.data); // 데이터를 상태로 설정
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // 데이터 가져오기 함수 호출
        fetchData();
    }, []); // 빈 배열은 이 useEffect가 컴포넌트가 처음 렌더링될 때 한 번만 실행되도록 합니다.
    
    */

    const handleButtonClick = (buttonType) => {
        setClickedButton(buttonType);
        setShowlist(buttonType === 'list');
    };

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <br></br>
            <h4>운송 예약 목록 조회</h4>
            <p></p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                    className={`btn ${clickedButton === 'list' ? 'btn-primary' : 'btn-secondary'}`} 
                    style={{ borderRadius: 2 }} 
                    onClick={() => handleButtonClick('list')}
                >
                    목록
                </button>
                <button 
                    className={`btn ${clickedButton === 'calendar' ? 'btn-primary' : 'btn-secondary'}`} 
                    style={{ borderRadius: 2 }} 
                    onClick={() => handleButtonClick('calendar')}
                >
                    캘린더
                </button>
            </div>
            {showlist?(
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>운송코드</th>
                        <th>화물</th>
                        <th>용량(t)</th>
                        <th>출발지</th>
                        <th>도착지</th>
                        <th>운송예약일자</th>
                        <th>화물차량배차</th>
                    </tr>
                </thead>
                <tbody>
                    {fdeliverylist.map((item, index) => (
                        <tr key={index}>
                            <td>{item.fedlcode}</td>
                            <td>{item.freight}</td>
                            <td>{item.fweight}</td>
                            <td>{item.fdepart}</td>
                            <td>{item.farrive}</td>
                            <td>{item.frsvdate}</td>
                            <td>{item.fvehiclecode}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            ) : (
                <FDeliveryCalRsvListComponent/>
            )}
        </div>
    );
};

export default FDeliveryRsvListComponent;