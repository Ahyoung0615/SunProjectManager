import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import DocumentListPaginationComponent from "../commodule/DocumentListPaginationComponent";
import styles from '../css/DocumentListComponent.module.css';
const VehicleListComponent = () => {
  const [vehiclelist, setVehiclelist] = useState([]);
  const [vehicleType, setVehicleType] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getVehicleList = async (page = 0, vehicleType) => {
    if (page < 0) {
      console.error("Page index must not be less than zero");
      page = 0;
    }

    try {
      const response = await axios.get("http://localhost:8787/api/vehicle", {
        params: { 
          page: page + 1,  // 페이지는 1부터 시작하므로 +1
          size: 10,
          vehicleType: vehicleType 
        },
      });

      const data = response.data;
      console.log("응답 데이터:", data);
      setVehiclelist(data.content); // 서버에서 반환되는 데이터 구조에 맞게 수정
      setTotalPages(data.totalPage || 1);
      setCurrentPage(page);

    } catch (error) {
      console.error("차량 조회 실패 : ", error);
    }
  };

  useEffect(() => {
    getVehicleList(0, vehicleType); // vehicleType 변경 시 첫 페이지부터 다시 로드
  }, [vehicleType]);

  const handleVehicleTypeChange = (eventKey) => {
    console.log("선택된 키:", eventKey);
    setVehicleType(eventKey);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      getVehicleList(page, vehicleType);
    }
  };

  const isEmpty = vehiclelist.length === 0;
  const displayTotalPages = totalPages > 0 ? totalPages : 1;

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <br></br>
      <h4 style={{ marginBottom: "30px" }}>차량 관리 현황</h4>

      {/* 차량 타입 설정 드랍다운 */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginRight:6}}>
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
      <div style={{minHeight:500}}>
      <table className="table table-bordered table-hover" style={{ textAlign: "center" }}>
        <thead style={{ backgroundColor: "#f2f2f2" }}>
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
                <Link to={`/vehicleDetail/${item.vehicleCode}`} style={{ textDecoration: "none", color: "#007bff" }}>
                  <div>
                    {item.vehicleStatus === 'R' ? (
                      <span className="badge badge-danger">수리</span>
                    ) : item.vehicleStatus === 'I' ? (
                      <span className="badge badge-primary">보관</span>
                    ) : (
                      <span className="badge badge-success">출차</span>
                    )}
                    {'\u00A0'}{'\u00A0'}
                    {item.vehicleCode}
                  </div>
                </Link>
              </td>
              <td>{item.vehicleNo}</td>
              <td>{item.vehicleModel}</td>
              <td>{new Date(item.vehicleRegdate).toLocaleDateString()}</td>
              <td>{item.vehicleSize}</td>
              <td>{item.vehicleType === 'C' ? "영업" : "화물"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className={styles['pagination-wrapper']}>
                    <DocumentListPaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        isEmpty={isEmpty}
                    />
                </div>

      {/* 차량 등록 버튼 */}
      <div style={{ display: "flex", marginTop: 50, justifyContent: "center", marginBottom: 20 }}>
        <Link to='/vehicleForm'>
          <button className="btn btn-secondary">
            차량 등록
          </button>
        </Link>
      </div>
    </div>
  );
};

export default VehicleListComponent;
