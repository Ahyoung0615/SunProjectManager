import React from 'react';
import { useState } from 'react';
import DateTimeComponent from './../commodule/DateTimeComponent';

const VehicleRentFormComponent = () => {
    const [startDate, setStartDate] = useState("2024/08/09");
  const [endDate, setEndDate] = useState("2024/08/09");
  const [reservationAvailable, setReservationAvailable] = useState(false);
  const [reason, setReason] = useState("");

  const handleCheckAvailability = () => {
    // 여기에 예약 가능 여부를 확인하는 로직을 추가하세요.
    setReservationAvailable(true);
  };

  const handleSubmit = () => {
    // 여기에 제출 로직을 추가하세요.
    alert("제출되었습니다.");
  };

  const handleCancel = () => {
    // 여기에 취소 로직을 추가하세요.
    alert("취소되었습니다.");
  };

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <h1>배차 신청서 작성</h1>
      
      {/* 차량 예약 확인 */}
      <div>
        <h4>차량 예약 확인</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>출발일자</th>
              <th>도착일자</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <DateTimeComponent/>
              </td>
              <td>
              <DateTimeComponent/>
              </td>
            </tr>
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={handleCheckAvailability}>
          차량 조회
        </button>
      </div>

      {/* 차량 예약 가능 여부 */}
      {reservationAvailable && (
        <div className="alert alert-info" style={{ marginTop: 20 }}>
          차량 예약 가능 여부: 해당 일자에 예약 가능한 차량이 존재합니다.
          <div style={{ marginTop: 10 }}>
            <button className="btn btn-secondary" onClick={handleCancel}>취소</button>
            <button className="btn btn-primary" style={{ marginLeft: 10 }}>저장</button>
          </div>
        </div>
      )}

      {/* 배차 사유 입력 */}
      <div style={{ marginTop: 20 }}>
        <h4>배차 사유 입력</h4>
        <textarea 
          className="form-control" 
          placeholder="500자 이내로 내용을 입력해주세요" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
          maxLength="500"
          rows="4"
        ></textarea>
      </div>

      {/* 취소 및 제출 버튼 */}
      <div style={{ marginTop: 20 }}>
        <button className="btn btn-danger" onClick={handleCancel}>취소</button>
        <button className="btn btn-success" onClick={handleSubmit} style={{ marginLeft: 10 }}>제출</button>
      </div>
    </div>
  );
};

export default VehicleRentFormComponent;