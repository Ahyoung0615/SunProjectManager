import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import carImg from "../img/image07.png";
import Swal from "sweetalert2";
import VehicleRepairFormComponent from "./VehicleRepairFormComponent";
import RepairListComponent from "./RepairListComponent";

const VehicleDetailComponent = () => {
  const navigate = useNavigate();
  const { vehicleCode } = useParams();
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [repairDetail, setRepairDetail] = useState([]);
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(null);

  const getVehicleDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8787/api/vehicle/${vehicleCode}`);
      setVehicleDetail(response.data);
    } catch (error) {
      console.error("차량 상세 출력 불가", error);
    }
  };

  const getRepairDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8787/api/repair/${vehicleCode}`);
      setRepairDetail(response.data);
    } catch (error) {
      console.error("수리 상세 출력 불가", error);
    }
  };

  useEffect(() => {
    getVehicleDetail();
    getRepairDetail();
  }, [vehicleCode]);

  const handleSaveClick = async () => {
    const repairsToSave = repairDetail
      .filter((repair) => repair.repairStatus === "OS")
      .map((repair) => repair.repairCode);
  
    if (image !== null) {
      const formImgData = new FormData();
      formImgData.append("vehicleCode", vehicleCode);
      formImgData.append("file", image);  // `image`에 실제 파일 객체를 추가해야 합니다.
      console.log("vehicleCode",vehicleCode);
      console.log("file",image);
      try {
        const response = await axios.post("http://localhost:8787/api/vehicleImg", formImgData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 200) {
          alert("변경 저장 완료");
          await getVehicleDetail();
          await getRepairDetail();
        }
      } catch (error) {
        console.error('이미지 변경 실패', error);
      }
    }
  
    if (repairsToSave.length > 0) {
      try {
        for (const repairCode of repairsToSave) {
          await axios.post(`http://localhost:8787/api/updateRepair/${repairCode}`);
        }
        alert("변경 저장 완료");
  
        await getVehicleDetail();
        await getRepairDetail();
      } catch (error) {
        console.error("저장 실패", error);
      }
    }
  };
  

  const deleteVehicle = async () => {
    try {
      await axios.post(`http://localhost:8787/api/vehicleDel/${vehicleCode}`);
      Swal.fire({
        title: "삭제 완료",
        text: "차량이 삭제되었습니다",
        icon: "success"
      });
      navigate("/vehicleList");
    } catch (error) {
      console.error("차량 삭제 불가", error);
    }
  };

  const handleDeleteClick = () => {
    Swal.fire({
      title: "삭제 요청",
      text: "정말 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteVehicle();
      }
    });
  };

  const handleRegisterComplete = async () => {
    await getRepairDetail();
    await getVehicleDetail();
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedRepairDetail = repairDetail.map((repair, i) =>
      i === index ? { ...repair, repairStatus: newStatus } : repair
    );
    setRepairDetail(updatedRepairDetail);
  };

  if (!vehicleDetail) {
    return <div>Loading...</div>;
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShowImage(URL.createObjectURL(file));
      setImage(file);
    }
  }

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <h1>차량 상세</h1>

      <div style={{ display: "flex", marginBottom: 20 }}>
        {vehicleDetail.vehicleStatus === 'R' && <span className="badge badge-danger">수리</span>}
        {vehicleDetail.vehicleStatus === 'I' && <span className="badge badge-primary">보관</span>}
        {vehicleDetail.vehicleStatus === 'O' && <span className="badge badge-success">출차</span>}
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ width: "450px", height: "320px", backgroundColor: "#ccc", marginRight: 50, marginLeft:50 }}>

          {showImage ? (
            <img src={showImage} alt="차량 이미지" style={{ width: "100%", height: "100%" }} />
          ) : (
            <img src={`http://localhost:8787/vehicleImage/${vehicleDetail.vehicleImg}`} alt="차량 이미지" style={{ width: "100%", height: "100%" }} />
          )}

          <input type="file" onChange={handleImageUpload} style={{ marginTop: 10 }} />

        </div>

        <div style={{ flex: 1, marginTop: 45, marginRight: 50 }}>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>차량등록번호</th>
                <td>{vehicleDetail.vehicleCode}</td>
              </tr>
              <tr>
                <th>차량번호</th>
                <td>{vehicleDetail.vehicleNo}</td>
              </tr>
              <tr>
                <th>차종</th>
                <td>{vehicleDetail.vehicleModel}</td>
              </tr>
              <tr>
                <th>등록일</th>
                <td>{new Date(vehicleDetail.vehicleRegdate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>구분</th>
                <td>{vehicleDetail.vehicleType === "C" ? "영업" : "화물"}</td>
              </tr>
              <tr>
                <th>{vehicleDetail.vehicleType === "C" ? "인승" : "용량(t)"}</th>
                <td>{vehicleDetail.vehicleSize}</td>
              </tr>
              <tr>
                <th>현황</th>
                <td>{vehicleDetail.vehicleStatus === "R" ? "수리" : (vehicleDetail.vehicleStatus === "I" ? "보관" : "출차")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <RepairListComponent
        repairDetail={repairDetail}
        handleStatusChange={handleStatusChange}

      />

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
      <Link to={'/vehicleList'}> <button className="btn btn-info" style={{ marginLeft: 150 }}>전체 목록</button></Link>
        <button className="btn btn-danger" style={{ marginLeft: 40 }} onClick={handleDeleteClick}>차량 삭제</button>
        <VehicleRepairFormComponent onRegisterComplete={handleRegisterComplete} />
        <button className="btn btn-success" style={{ marginRight: 300 }} onClick={handleSaveClick}>변경 저장</button>
      </div>
      <br /><br /><br />
    </div>
  );
};

export default VehicleDetailComponent;
