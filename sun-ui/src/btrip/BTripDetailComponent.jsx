import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CoWorkMapComponent from "../cowork/CoWorkMapComponent";

const BTripDetailComponent = () => {
  const { btripCode } = useParams();
  const [btripDetail, setBTripDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionEmp, setSessionEmp] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  

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

    const getBtripDetail = async () => {
      try {
        console.log("세션있음");
        const response = await axios.get(`http://localhost:8787/api/btripDetail/${btripCode}`, {
          params: { empCode: sessionEmp }
        });
        setBTripDetail(response.data);
      } catch (error) {
        alert("출장상세조회불가", error);
      }
    };

    getBtripDetail();
  }, [sessionEmp, btripCode]);

  if (!btripDetail) {
    return <div>Loading...</div>; // 데이터가 로드되기 전까지 로딩 상태를 표시합니다.
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRouteClick = () => {
    setShowRoute(true); // 버튼 클릭 시 경로보기 활성화
  };

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <h4>출장 상세</h4>

      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, marginRight: 20, marginTop: 20 }}>
          <div>
            <CoWorkMapComponent
              btripDepartAdd={btripDetail.btripDepart}
              btripArrivalAdd={btripDetail.btripArrival}
              showRoute={showRoute}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 30, marginTop: 5}}>
            <p style={{ margin: 0 }}>
              <i className="bi bi-arrow-up-square-fill"></i> {btripDetail.btripArrival}
            </p>
            <button
              type="button"
              className="btn btn-warning"
              style={{
                marginLeft: 10, // 주소와 버튼 간의 간격
                padding: '5px 10px', // 버튼 내부 패딩을 줄여 크기 조정
                fontSize: '0.9rem', // 글꼴 크기를 줄여 버튼 크기 축소
                lineHeight: 1, // 버튼 내 텍스트의 줄 간격을 줄임
              }}
              onClick={handleRouteClick}
            >
              <b>경로보기</b>
            </button>
          </div>
        </div>


        <div style={{ flex: 2, marginRight: 20 }}>
          <h4>출장 세부 현황</h4>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>출장번호</th>
                <td>{btripDetail.btripCode}</td>
                <th>출장목적</th>
                <td>{btripDetail.btripDetail}</td>
              </tr>
              <tr>
                <th>출발지</th>
                <td>{btripDetail.btripDepart}</td>
                <th>출장지</th>
                <td>{btripDetail.btripArrival}</td>
              </tr>
              <tr>
                <th>시작일자</th>
                <td>{new Date(btripDetail.btripStartDate).toLocaleDateString()}</td>
                <th>종료일자</th>
                <td>{new Date(btripDetail.btripEndDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>차량여부</th>
                <td>{btripDetail.vehicleCode == null ? "미사용" : "사용"}</td>
                <th>차량코드</th>
                <td>{btripDetail.vehicleCode}</td>
              </tr>
            </tbody>
          </table>

          <h4>여비 상세 구분</h4><p style={{marginLeft: 360, fontSize:13, marginTop:-30}}>여비 신청은 지출결의서를 통해 청구할 수 있습니다</p>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>교통비</th>
                <td>-</td>
                <th>유류비</th>
                <td>52,000</td>
              </tr>
              <tr>
                <th>식비</th>
                <td>12,000</td>
                <th>숙박비</th>
                <td>-</td>
              </tr>
              <tr>
                <th>영업비</th>
                <td>-</td>
                <th>기타 경비</th>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>상세 업무 내역</h4>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>담당자</th>
              <td>{sessionEmp}</td>
              <th>대상업체</th>
              <td>임강철 소장</td>
            </tr>
            <tr>
              <th>출장 사유</th>
              <td>{btripDetail.btripDetail}</td>
              <th>업체 연락처</th>
              <td>024556897</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 20, marginLeft: 500, marginBottom: 50 }}>
        <Link to="/bTripList"><button className="btn btn-primary">목록</button></Link>
      </div>

      
    </div>
  );
};

export default BTripDetailComponent;
