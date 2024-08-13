import React, { useState } from "react";
import VehicleRentFormComponent from "../vehicle/VehicleRentFormComponent";

const BTripFormComponent = () => {
  const [isVehicleRequest, setIsVehicleRequest] = useState(false);

  const handleVehicleRequestToggle = () => {
    setIsVehicleRequest(!isVehicleRequest);
  };

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <h1>출장 신청서 작성</h1>
      
      {/* 지도 및 검색 입력 */}
      <div>
        <h4>출장지 위치</h4>
        <div style={{ width: "300px", height: "200px", backgroundColor: "#ccc" }}>
          {/* 여기에 지도 컴포넌트를 넣으세요 */}
        </div>
        <input type="text" placeholder="울산" />
      </div>

      {/* 출장자 정보 */}
      <div>
        <h4>출장자 정보</h4>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>이름*</th>
              <td>박개발</td>
            </tr>
            <tr>
              <th>직급*</th>
              <td>대리</td>
            </tr>
            <tr>
              <th>부서*</th>
              <td>개발연구부서</td>
            </tr>
            <tr>
              <th>시작일자</th>
              <td>2024-08-09</td>
            </tr>
            <tr>
              <th>종료일자</th>
              <td>2024-08-09</td>
            </tr>
            <tr>
              <th>출장지*</th>
              <td>기타 출장지 / 직접 입력</td>
            </tr>
            <tr>
              <th>거리*</th>
              <td>34km</td>
            </tr>
            <tr>
              <th>사유</th>
              <td>업체 방문하여 개발 샘플 확인</td>
            </tr>
          </tbody>
        </table>
      </div>

            {/* 차량 배차 신청 여부 */}
        <div>
        <h4>차량 배차 신청 여부</h4>
        <label style={{
          position: "relative",
          display: "inline-block",
          width: "34px",
          height: "20px"
        }}>
          <input 
            type="checkbox" 
            checked={isVehicleRequest} 
            onChange={handleVehicleRequestToggle} 
            style={{
              opacity: 0,
              width: 0,
              height: 0
            }}
          />
          <span style={{
            position: "absolute",
            cursor: "pointer",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isVehicleRequest ? "#4CAF50" : "#ccc",
            transition: "0.4s",
            borderRadius: "34px"
          }}>
            <span style={{
              position: "absolute",
              content: '""',
              height: "12px",
              width: "12px",
              left: "4px",
              bottom: "4px",
              backgroundColor: "white",
              transition: "0.4s",
              borderRadius: "50%",
              transform: isVehicleRequest ? "translateX(14px)" : "none"
            }}></span>
          </span>
        </label>
      </div>

      {/* 차량 배차 관련 추가 컴포넌트 */}
      {isVehicleRequest && (
        <div>
            <VehicleRentFormComponent/>
        </div>
      )}
    </div>
  );
};

export default BTripFormComponent;
