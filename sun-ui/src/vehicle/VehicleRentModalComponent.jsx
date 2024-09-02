import axios from 'axios';
import React, { useState } from 'react';

const VehicleRentModalComponent = ({ btripCode, closeModal }) => {
  const [rentStartDate, setRentStartDate] = useState("");
  const [rentEndDate, setRentEndDate] = useState("");
  const [reason, setReason] = useState(""); 
  const [vehicleRentList, setVehicleRentList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const [formValid, setFormValid] = useState(true); 

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setRentStartDate(newStartDate);

    // 유효성 검사 - 종료일자가 시작일자보다 이전인지 확인
    if (rentEndDate && newStartDate > rentEndDate) {
      setErrorMessage("종료일은 시작일보다 빠른 날짜일 수 없습니다.");
      setFormValid(false);
    } else {
      setErrorMessage("");
      setFormValid(true);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (newEndDate < rentStartDate) {
      setErrorMessage("종료일은 시작일보다 빠른 날짜일 수 없습니다.");
      setFormValid(false);
      setRentEndDate(""); // 유효하지 않은 경우 종료일을 초기화
    } else {
      setRentEndDate(newEndDate);
      setErrorMessage("");
      setFormValid(true);
    }
  };

  const handleVehicleSelect = (e) => {
    const selectedVehicleCode = e.target.value;
    setSelectedVehicle(selectedVehicleCode);
  };

  const handleCheckAvailability = async () => {
    if (!rentStartDate || !rentEndDate) {
      alert("날짜를 먼저 입력해주세요.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8787/api/availableVehicle", {
        params: { startDate: rentStartDate, endDate: rentEndDate },
      });

      const data = response.data;
      setVehicleRentList(data);
      setSelectedVehicle("");
    } catch (error) {
      console.error('차량 조회 실패', error);
    }
  };

  const handleSubmit = async () => {
    if (!rentStartDate || !rentEndDate || !selectedVehicle || reason.trim() === "") {
      alert("모든 필드를 올바르게 입력해주세요.");
      return;
    }

    // 확인창에서 확인을 누르면 제출 진행
    if (window.confirm("배차 신청을 제출하시겠습니까?")) {
      // 시작일과 종료일을 변수에 저장
      const startDate = rentStartDate;
      const endDate = rentEndDate;

      // JSON 형식으로 vrsvDate 생성
      const vrsvDate = JSON.stringify({ start: startDate, end: endDate });

      // vehicleData 객체 생성
      const vehicleData = {
        vrsvDate: vrsvDate,
        vehicleCode: selectedVehicle,
        vrsvDetail: reason,
        btripCode: btripCode,
      };

      try {
        const response = await axios.post("http://localhost:8787/api/reVehicleRsv", vehicleData);
        if (response.status === 200) {
          alert("배차 신청이 완료되었습니다.");
          closeModal(); // 모달 닫기
        }
      } catch (error) {
        console.error('배차 신청 실패', error);
      }
    }
  };

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <h4>배차 신청서 작성</h4>
      <br />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h5>예약 가능 차량 확인</h5>
          <table className="table table-bordered">
            <thead style={{ backgroundColor: '#f2f2f2' }}>
              <tr>
                <th style={{ textAlign: 'center' }}>출발일자</th>
                <th style={{ textAlign: 'center' }}>도착일자</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="date"
                    name="rentStartDate"
                    value={rentStartDate || ""}
                    onChange={handleStartDateChange}
                    className="form-control"
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="date"
                    name="rentEndDate"
                    value={rentEndDate || ""}
                    onChange={handleEndDateChange}
                    className="form-control"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
          <button style={{ display: 'block', margin: '20px auto' }} className="btn btn-primary" onClick={handleCheckAvailability} disabled={!formValid}>
            차량 조회
          </button>
        </div>

        <div style={{ flex: 1 }}>
          <h5>예약 가능 차량 리스트</h5>
          <div className="alert alert-info">
            <div style={{ marginTop: 15, marginBottom: 15 }}>
              {vehicleRentList.length > 0 ? "해당 일자에 예약 가능한 차량이 존재합니다." : "차량 조회 기간을 먼저 선택해주세요"}
            </div>
            <div style={{ backgroundColor: 'white', marginTop: 15 }}>
              <select
                className="form-control"
                name="vehicleCode"
                value={selectedVehicle}
                onChange={handleVehicleSelect}
              >
                <option value="">차량을 선택하세요 ▼</option>
                {vehicleRentList.map((vi, index) => (
                  <option key={index} value={vi.VEHICLE_CODE}>
                    {index + 1}. 차량번호: {vi.VEHICLE_NO} / {vi.VEHICLE_MODEL} / ({vi.VEHICLE_SIZE}인승)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <h5>배차 사유 입력</h5>
        <textarea
          className="form-control"
          placeholder="500자 이내로 내용을 입력해주세요"
          name="vrsvDetail"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength="500"
          rows="4"
        ></textarea>
      </div>

      <div style={{ marginTop: 30, textAlign: "center" }}>
        <button className="btn btn-success" onClick={handleSubmit}>신청 제출</button>
      </div>
    </div>
  );
};

export default VehicleRentModalComponent;
