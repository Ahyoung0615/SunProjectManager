import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import VehicleRentMapComponent from "./VehicleRentMapComponent";

const VehicleRentDetailComponent = ({ vrsvCode, onApproval }) => {
  const [vehicleRentDetail, setVehicleRentDetail] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("success");
  const [vrsvReply, setVrsvReply] = useState('');
  const [arrivalAddress, setArrivalAddress] = useState('');

  const getVehicleRentDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8787/api/vrentDetail/${vrsvCode}`);
      console.log("Vehicle Rent Detail:", response.data);
      setVehicleRentDetail(response.data);
      if (response.data.btripArrival) {
        getArrivalAddress(response.data.btripArrival);
      }
    } catch (error) {
      console.error("Failed to load vehicle rent details:", error);
    }
  };

  useEffect(() => {
    getVehicleRentDetail();
  }, [vrsvCode]);

  const getArrivalAddress = (address) => {
    setArrivalAddress(address);
  };

  const handleApproval = async () => {
    try {
      await axios.post("http://localhost:8787/api/approveVRent", null, {
        params: { vrsvCode }
      });
      setAlertVariant("success");
      setShowAlert(true);
      setShowApprovalModal(false);
      getVehicleRentDetail();
      onApproval();
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleRejection = async () => {
    try {
      await axios.post("http://localhost:8787/api/rejectVRent", null, {
        params: { vrsvCode, vrsvReply }
      });
      setAlertVariant("danger");
      setShowAlert(true);
      setShowRejectionModal(false);
      getVehicleRentDetail();
      onApproval();
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h4 style={{ marginTop: 30, display: "inline-flex", alignItems: "center" }}>
          배차 관리 상세 현황
          {vehicleRentDetail.vrsvStatus === 'N' ? (
            <span className="badge badge-danger" style={{ marginLeft: 10, transform: "scale(0.7)" }}>반려</span>
          ) : vehicleRentDetail.vrsvStatus === 'W' ? (
            <span className="badge badge-primary" style={{ marginLeft: 10, transform: "scale(0.7)" }}>대기</span>
          ) : (
            <span className="badge badge-success" style={{ marginLeft: 10, transform: "scale(0.7)" }}>승인</span>
          )}
        </h4>
      </div>
      <Alert show={showAlert} variant={alertVariant} dismissible onClose={handleAlertClose}>
        {alertVariant === "success" ? "승인되었습니다!" : "반려되었습니다!"}
      </Alert>

      {/* 신청자 정보 테이블 */}
      <table className="table table-bordered" style={{ marginBottom: 20, textAlign: "center" }}>
        <thead style={{ backgroundColor: "#f8f9fa" }}>
          <tr>
            <th style={{ width: "20%" }}>신청코드</th>
            <th style={{ width: "20%" }}>신청자</th>
            <th style={{ width: "20%" }}>직급</th>
            <th style={{ width: "20%" }}>부서</th>
            <th style={{ width: "20%" }}>기간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{vehicleRentDetail.vrsvCode}</td>
            <td>{vehicleRentDetail.empName}</td>
            <td>{vehicleRentDetail.jobName}</td>
            <td>{vehicleRentDetail.deptName}</td>
            <td>{vehicleRentDetail.startDate} ~ {vehicleRentDetail.endDate}</td>
          </tr>
        </tbody>
      </table>

      {/* 차량 정보 테이블 */}
      <table className="table table-bordered" style={{ marginBottom: 20, textAlign: "center" }}>
        <thead style={{ backgroundColor: "#f8f9fa" }}>
          <tr>
            <th style={{ width: "25%" }}>차량코드</th>
            <th style={{ width: "25%" }}>차량번호</th>
            <th style={{ width: "25%" }}>차종</th>
            <th style={{ width: "25%" }}>인승</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{vehicleRentDetail.vehicleCode}</td>
            <td>{vehicleRentDetail.vehicleNo}</td>
            <td>{vehicleRentDetail.vehicleModel}</td>
            <td>{vehicleRentDetail.vehicleSize} 인승</td>
          </tr>
        </tbody>
      </table>

      {/* 지도 및 정보 */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ width: "48%", height: "330px", backgroundColor: "#e9ecef", marginRight: "4%" }}>
          <VehicleRentMapComponent arrivalAddress={arrivalAddress} />
        </div>

        <div style={{ width: "48%" }}>
          <div style={{ marginBottom: 20 }}>
            <h6>출발지 / 목적지</h6>
            <table className="table table-bordered" style={{ textAlign: "center" }}>
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th style={{ width: "50%" }}>출발지</th>
                  <th style={{ width: "50%" }}>도착지</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{vehicleRentDetail.btripDepart}</td>
                  <td>{vehicleRentDetail.btripArrival}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h6>배차 요청 사유</h6>
            <textarea
              className="form-control"
              rows="1"
              defaultValue={vehicleRentDetail.vrsvDetail}
              readOnly
              style={{ textAlign: "center", resize: "none" }}
            />
          </div>
          <br />
          {vehicleRentDetail.vrsvStatus === 'N' && (
            <div>
              <h6>반려 사유</h6>
              <textarea
                className="form-control"
                rows="1"
                defaultValue={vehicleRentDetail.vrsvReply}
                readOnly
                style={{ textAlign: "center", resize: "none" }}
              />
            </div>
          )}
        </div>
      </div>
      <br />

      {vehicleRentDetail.vrsvStatus === 'W' && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <Button variant="primary" onClick={() => setShowApprovalModal(true)} style={{ marginRight: 100 }}>승인</Button>
          <Button variant="danger" onClick={() => setShowRejectionModal(true)} style={{ marginRight: 100 }}>반려</Button>
        </div>
      )}

      <Modal show={showApprovalModal} onHide={() => setShowApprovalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말 승인하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApprovalModal(false)}>취소</Button>
          <Button variant="primary" onClick={handleApproval}>승인</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRejectionModal} onHide={() => setShowRejectionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>반려 사유 입력</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows="3"
            placeholder="반려 사유를 입력하세요"
            onChange={(e) => setVrsvReply(e.target.value)}
            style={{ textAlign: "center" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectionModal(false)}>취소</Button>
          <Button variant="primary" onClick={handleRejection}>반려</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VehicleRentDetailComponent;
