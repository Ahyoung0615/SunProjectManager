import axios from 'axios';
import React, { useState, useEffect } from 'react';

const VehicleRentFormComponent = ({ onInfoChange, info }) => {
  const [reason, setReason] = useState(info.vrsvDetail || ""); 
  const [vehicleRentList, setVehicleRentList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(info.vehicleCode || ""); 
  const [errorMessage, setErrorMessage] = useState("");
  const [formValid, setFormValid] = useState(true); // 유효성 검사 상태 추가

  useEffect(() => {
    if (info.rentStartDate && info.rentEndDate && selectedVehicle && reason.trim() !== "") {
      const vehicleData = {
        vrsvDate: { start: info.rentStartDate, end: info.rentEndDate },
        vehicleCode: selectedVehicle,
        vrsvDetail: reason,
      };

      onInfoChange(vehicleData);
    }
  }, [info.rentStartDate, info.rentEndDate, selectedVehicle, reason]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    onInfoChange(name, value);
  };

  const handleCheckAvailability = async () => {
    if (!info.rentStartDate || !info.rentEndDate) {
      alert("날짜를 먼저 입력해주세요.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8787/api/availableVehicle", {
        params: { startDate: info.rentStartDate, endDate: info.rentEndDate },
      });

      const data = response.data;
      setVehicleRentList(data);
      setSelectedVehicle("");
    } catch (error) {
      console.error('차량 조회 실패', error);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    onInfoChange("rentStartDate", newStartDate);

    // 유효성 검사 - 종료일자가 시작일자보다 이전인지 확인
    if (info.rentEndDate && newStartDate > info.rentEndDate) {
      setErrorMessage("종료일은 시작일보다 빠른 날짜일 수 없습니다.");
      setFormValid(false);
    } else {
      setErrorMessage("");
      setFormValid(true);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (newEndDate < info.rentStartDate) {
      setErrorMessage("종료일은 시작일보다 빠른 날짜일 수 없습니다.");
      setFormValid(false);
      onInfoChange("rentEndDate", ""); // 유효하지 않은 경우 종료일을 초기화
    } else {
      onInfoChange("rentEndDate", newEndDate);
      setErrorMessage("");
      setFormValid(true);
    }
  };

  const handleVehicleSelect = (e) => {
    const selectedVehicleCode = e.target.value;
    setSelectedVehicle(selectedVehicleCode);
    onInfoChange("vehicleCode", selectedVehicleCode);
  };

  const isCheckAvailableButtonDisabled = !info.rentStartDate || !info.rentEndDate || !formValid;

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
                    value={info.rentStartDate || ""}
                    onChange={handleStartDateChange}
                    className="form-control"
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="date"
                    name="rentEndDate"
                    value={info.rentEndDate || ""}
                    onChange={handleEndDateChange}
                    className="form-control"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
          <button
            style={{
              display: 'block',
              margin: '20px auto',
              backgroundColor: isCheckAvailableButtonDisabled ? '#d3e0ea' : '#007bff', // 연한 하늘색으로 변경
              color: isCheckAvailableButtonDisabled ? '#6c757d' : '#fff', // 비활성화 시 회색 글자
              cursor: isCheckAvailableButtonDisabled ? 'not-allowed' : 'pointer',border: 'none',borderRadius: '4px',
            }}
            className="btn btn-primary"
            onClick={handleCheckAvailability}
            disabled={isCheckAvailableButtonDisabled} // 버튼 비활성화 상태 설정
          >
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
          onChange={(e) => {
            setReason(e.target.value);
            onInfoChange("vrsvDetail", e.target.value);
          }}
          maxLength="500"
          rows="4"
        ></textarea>
      </div>
    </div>
  );
};

export default VehicleRentFormComponent;
