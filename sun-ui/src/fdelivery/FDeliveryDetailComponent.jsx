import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FDeliveryDetailComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString(); // 현재 시각을 로컬 시간 형식으로 변환
        setCurrentTime(formattedTime);
    }, []); // 컴포넌트가 마운트될 때 한 번만 실행

    const endDelivery = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const goList = () => {
        navigate('/fDeliveryList');
    }

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <br></br>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>현재 운송 현황 조회</h4>
                <span className="badge badge-success" style={{marginRight: 830}}>운송중</span>
            </div>
            <table className="table table-bordered" style={{ marginTop: 20 }}>
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
                    <tr>
                        <td>1123</td>
                        <td>구리코일</td>
                        <td>1</td>
                        <td>부산 북구</td>
                        <td>서울 구로구</td>
                        <td>2024.08.08</td>
                        <td>12:30</td>
                        <td>-</td>
                        <td>운송중</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                <div style={{ width: '50%' }}>
                    {/* 이 영역에 지도 컴포넌트가 들어갈 수 있습니다 */}
                    <img src="map-placeholder.png" alt="map" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div style={{ width: '45%' }}>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th>협력업체코드</th>
                                <td>1234</td>
                            </tr>
                            <tr>
                                <th>업체명</th>
                                <td>부산구리</td>
                            </tr>
                            <tr>
                                <th>업체번호</th>
                                <td>058-121-2546</td>
                            </tr>
                            <tr>
                                <th>화물수신담당자</th>
                                <td>송매입</td>
                            </tr>
                            <tr>
                                <th>연락처</th>
                                <td>010-1234-1234</td>
                            </tr>
                            <tr>
                                <th>비고</th>
                                <td>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <button type="button" className="btn btn-secondary" onClick={goList} style={{ marginRight: 250 }}>목록</button>
                <button type="button" className="btn btn-primary" onClick={endDelivery} style={{ marginRight: 100 }}>운송 종료</button>
            </div>

            {/* 운송 종료 모달 */}
            {showModal && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">운송 완료</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>현재시각 {currentTime} 운송을 완료하시겠습니까?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal} style={{marginRight: 290}}>창닫기</button>
                                <button type="button" className="btn btn-primary">운송완료</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FDeliveryDetailComponent;
