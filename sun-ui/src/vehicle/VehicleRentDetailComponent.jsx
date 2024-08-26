import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";

const VehicleRentDetailComponent = () => {
  const {vrsvCode} = useParams();
  const [vehicleRentDetail, setVehicleRentDetail] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const getVehicleRentDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8787/api/vrentDetail/${vrsvCode}`);
      setVehicleRentDetail(response.data);
    } catch (error) {
      console.error("배차 신청서 상세 출력 불가", error);
    }
  };

  useEffect(() => {
    getVehicleRentDetail();
  }, [vrsvCode]);

  const handleApproval = () => {
    setShowAlert(true);
    setShowApprovalModal(false);
  };

  const handleRejection = () => {
    setShowRejectionModal(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };



  return (
    <div className="container" style={{ marginTop: 30 }}>
      {/* 제목과 버튼들 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <br></br>
        <h4 style={{ marginTop: 30}}>배차 관리 상세 현황</h4>
        <div style={{ display: "flex", marginBottom: 20 }}>
          {/* 
        {vehicleDetail.vehicleStatus === 'N' && <span className="badge badge-danger">반려</span>}
        {vehicleDetail.vehicleStatus === 'W' && <span className="badge badge-primary">승인대기중</span>}
        {vehicleDetail.vehicleStatus === 'Y' && <span className="badge badge-success">승인</span>}*/}
      </div>
    </div>
      {/* 신청자 정보 테이블 */}
      <table className="table table-bordered" style={{ marginBottom: 20 }}>
        <thead>
          <tr>
            <th>신청번호</th>
            <th>구분</th>
            <th>신청자</th>
            <th>직급</th>
            <th>부서</th>
            <th>기간</th>
            <th>거리</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>영업</td>
            <td>김경영</td>
            <td>과장</td>
            <td>경영지원부</td>
            <td>2024.07.18 ~ 2024.07.18</td>
            <td>15km</td>
          </tr>
        </tbody>
      </table>

      {/* 지도 및 정보 */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        {/* 예상 경로 이미지 */}
        <div style={{ width: "50%", height: "300px", backgroundColor: "#ccc", marginRight: "20px" }}>
          {/* 여기에 예상 경로 지도 이미지가 들어갈 수 있습니다 */}
        </div>

        <div style={{ width: "50%" }}>
          {/* 출발지 / 목적지 테이블 */}
          <div style={{ marginBottom: 20 }}>
            <h5>출발지 / 목적지</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>출발지</th>
                  <th>도착지</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>서울시 금천구 가산동</td>
                  <td>서울시 강남구</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 배차 요청 사유 */}
          <div>
            <h5>배차 요청 사유</h5>
            <textarea
              className="form-control"
              rows="3"
              defaultValue="모든 샘플을 지참하여 이동하는 관계로 차량 배차를 요청드립니다."
              readOnly
            />
          </div>
        </div>
      </div>

      {/* 승인 및 반려 버튼 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Button variant="primary" onClick={() => setShowApprovalModal(true)} style={{ marginRight: 10 }}>승인</Button>
        <Button variant="warning" onClick={handleRejection} style={{ marginRight: 10 }}>반려</Button>
        <Button variant="secondary">보류</Button>
      </div>

      {/* 승인 확인 모달 */}
      <Modal show={showApprovalModal} onHide={() => setShowApprovalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말 승인하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApprovalModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleApproval}>OK</Button>
        </Modal.Footer>
      </Modal>

      {/* 반려 사유 입력 모달 */}
      <Modal show={showRejectionModal} onHide={() => setShowRejectionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>반려 사유 입력</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea className="form-control" rows="3" placeholder="반려 사유를 입력하세요" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectionModal(false)}>취소</Button>
          <Button variant="primary">저장</Button>
        </Modal.Footer>
      </Modal>

      {/* 승인 후 알림 창 */}
      <Alert show={showAlert} variant="success" dismissible onClose={handleAlertClose}>
        승인되었습니다!
      </Alert>
    </div>
  );
};

export default VehicleRentDetailComponent;
