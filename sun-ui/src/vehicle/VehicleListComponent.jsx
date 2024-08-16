import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";

const VehicleListComponent = () => {
  const [vehiclelist, setVehiclelist] = useState([]);
  const [vehicleType, setVehicleType] = useState("");

  const getVehicleList = async (vehicleType) => {
    try {
      const response = await axios.get("http://localhost:8787/api/vehicle", {
        params: { vehicleType: vehicleType },
      });
      setVehiclelist(response.data);
    } catch (error) {
      console.error("차량 조회 실패 : ", error);
    }
  };

  useEffect(() => {
    getVehicleList(vehicleType);
    console.log(vehiclelist);
    console.log("재랜더링됨");
  }, [vehicleType]);

  const handleVehicleTypeChange = (eventKey) => {
    console.log("선택된 키:", eventKey);
    setVehicleType(eventKey);
  };

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <br></br>
      <h4>차량 관리 현황</h4>

      {/* 차량 타입 설정 드랍다운 */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <DropdownButton
          id="vTypeDropdown"
          title={vehicleType ? (vehicleType === "C" ? "영업차량" : "화물차량") : "전체차량"}
          onSelect={handleVehicleTypeChange}
        >
          <Dropdown.Item eventKey="">전체</Dropdown.Item>
          <Dropdown.Item eventKey="C">영업 차량</Dropdown.Item>
          <Dropdown.Item eventKey="F">화물 차량</Dropdown.Item>
        </DropdownButton>
      </div>

      {/* 차량 관리 테이블 */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>차량등록번호</th>
            <th>차량번호</th>
            <th>차종</th>
            <th>등록일</th>
            <th>용량(인승/t)</th>
            <th>구분</th>
          </tr>
        </thead>
        <tbody>
          {vehiclelist.map((item, index) => (
            <tr key={index}>
              <td>
                <Link to={`/vehicleDetail/${item.vehicleCode}`} style={{ textDecoration: "none"}}> 
                <div >
                {item.vehicleStatus=='R'?<span className="badge badge-danger" >수리</span>:
                (item.vehicleStatus=='I'?<span  className="badge badge-primary"> 보관</span>:
                  <span className="badge badge-success"> 출차</span>)}{'\u00A0'}{'\u00A0'}
                  {item.vehicleCode}
                  </div>
                  </Link>
              </td>
              <td>{item.vehicleNo}</td>
              <td>{item.vehicleModel}</td>
              <td>{item.vehicleRegdate}</td>
              <td>{item.vehicleSize}</td>
              <td>{item.vehicleType=='C'?"영업":"화물"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 차량 등록 버튼 */}
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom:20 }}
      >
        <Link to='/vehicleForm'><button className="btn btn-secondary">차량 등록</button></Link>
      </div>
    </div>
  );
};

export default VehicleListComponent;
