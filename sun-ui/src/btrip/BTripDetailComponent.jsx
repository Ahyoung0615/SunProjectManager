import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CoWorkMapComponent from "../cowork/CoWorkMapComponent";
import ModalComponent from "../commodule/ModalComponent";
import VehicleRentModalComponent from "../vehicle/VehicleRentModalComponent";

const BTripDetailComponent = () => {
  const { btripCode } = useParams();
  const [btripDetail, setBTripDetail] = useState(null);
  const [vrsvDetail, setVrsvDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionEmp, setSessionEmp] = useState(null);
  const [showRoute, setShowRoute] = useState(false);

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
      return;
    }

    const getBtripDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8787/api/btripDetail/${btripCode}`, {
          params: { empCode: sessionEmp }
        });
        setBTripDetail(response.data);
      } catch (error) {
        alert("출장상세조회불가", error);
      }
    };

    const getVrsvDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8787/api/vrsvDetail/${btripCode}`, {
          params: { empCode: sessionEmp }
        });
        setVrsvDetail(response.data);
      } catch (error) {
        alert("출장상세조회불가", error);
      }
    };

    getBtripDetail();
    getVrsvDetail();
  }, [sessionEmp, btripCode, isModalOpen]);

  const hasApprovedStatus = vrsvDetail && vrsvDetail.some(item => item.vrsvStatus === 'Y' || item.vrsvStatus === 'W');

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
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 30, marginTop: 5 }}>
            <p style={{ margin: 0 }}>
              <i className="bi bi-arrow-up-square-fill"></i> {btripDetail.btripArrival}
            </p>
            <button
              type="button"
              className="btn btn-warning"
              style={{
                marginLeft: 10,
                padding: '5px 10px',
                fontSize: '0.9rem',
                lineHeight: 1,
              }}
              onClick={handleRouteClick}
            >
              <b>경로보기</b>
            </button>
          </div>
        </div>

        <div style={{ flex: 2, marginRight: 20 }}>
          <h5>출장 세부 현황</h5>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>출장번호</th>
                <td style={{ textAlign: "center" }}>{btripDetail.btripCode}</td>
                <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>출장목적</th>
                <td style={{ textAlign: "center" }}>{btripDetail.btripDetail}</td>
              </tr>
              <tr>
                <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>출발지</th>
                <td style={{ textAlign: "center" }}>{btripDetail.btripDepart}</td>
                <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>출장지</th>
                <td style={{ textAlign: "center" }}>{btripDetail.btripArrival}</td>
              </tr>
              <tr>
                <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>시작일자</th>
                <td style={{ textAlign: "center" }}>{new Date(btripDetail.btripStartDate).toLocaleDateString()}</td>
                <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>종료일자</th>
                <td style={{ textAlign: "center" }}>{new Date(btripDetail.btripEndDate).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: 50 }}>
            <h5>여비 상세 구분</h5>
            <p style={{ textAlign: "right", fontSize: 13, marginTop: -30 }}>여비 신청은 지출결의서를 통해 청구할 수 있습니다</p>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>교통비</th>
                  <td style={{ textAlign: "center" }}>-</td>
                  <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>유류비</th>
                  <td style={{ textAlign: "center" }}>52,000</td>
                </tr>
                <tr>
                  <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>식비</th>
                  <td style={{ textAlign: "center" }}>12,000</td>
                  <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>숙박비</th>
                  <td style={{ textAlign: "center" }}>-</td>
                </tr>
                <tr>
                  <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>영업비</th>
                  <td style={{ textAlign: "center" }}>-</td>
                  <th style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>기타 경비</th>
                  <td style={{ textAlign: "center" }}>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 50 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h4>차량 배차 신청 내역</h4>
          {!hasApprovedStatus && (
            <button
              type="button"
              className="btn btn-dark"
              onClick={openModal}
              style={{marginRight:970, marginBottom:20, marginTop:17,
                padding: '5px 10px',   // 버튼 안쪽 여백 줄이기
                fontSize: '0.8rem',    // 글자 크기 줄이기
                lineHeight: 1,         // 줄 높이 조절
                minWidth: '80px',      // 최소 너비 설정 (선택 사항)
                minHeight: '30px'      // 최소 높이 설정 (선택 사항)
              }}
            >
              <b>재신청</b>
            </button>
          )}
        </div>
        <table className="table table-bordered">
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ textAlign: "center" }}>배차신청코드</th>
              <th style={{ textAlign: "center" }}>차량코드</th>
              <th style={{ textAlign: "center" }}>배차사유</th>
              <th style={{ textAlign: "center" }}>배차승인여부</th>
              <th style={{ textAlign: "center" }}>반려사유</th>
            </tr>
          </thead>
          <tbody>
            {vrsvDetail && vrsvDetail.length > 0 ? (
              vrsvDetail.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>{item.vrsvCode}</td>
                  <td style={{ textAlign: "center" }}>{item.vehicleCode}</td>
                  <td style={{ textAlign: "center" }}>{item.vrsvDetail}</td>
                  <td style={{ textAlign: "center" }}>
                    {item.vrsvStatus === 'W' ? "승인대기중" :
                      item.vrsvStatus === 'Y' ? "승인" :
                        <>
                          반려
                        </>
                    }
                  </td>
                  <td style={{ textAlign: "center" }}>{item.vrsvReply === null ? "-" : item.vrsvReply}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>신청한 차량이 없습니다</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalComponent
        open={isModalOpen}
        close={closeModal}
        title="배차 신청서 작성"
        body={<VehicleRentModalComponent btripCode={btripCode} closeModal={closeModal}/>}
        size="lg"
      />

      <div style={{ marginTop: 20, textAlign: "center", marginBottom: 50 }}>
        <Link to="/bTripList">
          <button className="btn btn-primary">목록</button>
        </Link>
      </div>
    </div>
  );
};

export default BTripDetailComponent;
