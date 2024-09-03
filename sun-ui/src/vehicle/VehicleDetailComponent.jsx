import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import VehicleRepairFormComponent from "./VehicleRepairFormComponent";
import RepairListComponent from "./RepairListComponent";

const VehicleDetailComponent = () => {
  const navigate = useNavigate();
  const { vehicleCode } = useParams();
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [repairDetail, setRepairDetail] = useState([]);
  const [image, setImage] = useState(null); // 파일을 저장
  const [showImage, setShowImage] = useState(null); // 미리보기 또는 서버에서 가져온 이미지

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

  const getVehicleImages = async () => {
    try {
      const response = await axios.get(`http://localhost:8787/api/vehicleImages/${vehicleCode}`);
      setShowImage(response.data); // 서버에서 가져온 Base64 이미지 데이터를 설정
    } catch (error) {
      console.error("이미지 출력 불가", error);
    }
  };

  useEffect(() => {
    getVehicleDetail();
    getRepairDetail();
    getVehicleImages(); // 차량 이미지 데이터를 서버에서 가져옴
  }, [vehicleCode]);

  const handleSaveClick = async () => {
    const repairsToSave = repairDetail
      .filter((repair) => repair.repairStatus === "OS")
      .map((repair) => repair.repairCode);

    if (image !== null) {
      const formImgData = new FormData();
      formImgData.append("vehicleCode", vehicleCode);
      formImgData.append("file", image);
      try {
        const response = await axios.post("http://localhost:8787/api/vehicleImg", formImgData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 200) {
          Swal.fire({
            title: "성공!",
            text: "변경이 저장되었습니다.",
            icon: "success",
            confirmButtonText: "확인"
          });
          await getVehicleDetail();
          await getRepairDetail();
          await getVehicleImages();
        }
      } catch (error) {
        console.error('이미지 변경 실패', error);
        Swal.fire({
          title: "오류!",
          text: "이미지 변경에 실패했습니다.",
          icon: "error",
          confirmButtonText: "확인"
        });
      }
    }

    if (repairsToSave.length > 0) {
      try {
        for (const repairCode of repairsToSave) {
          await axios.post(`http://localhost:8787/api/updateRepair/${repairCode}`);
        }
        Swal.fire({
          title: "성공!",
          text: "변경이 저장되었습니다.",
          icon: "success",
          confirmButtonText: "확인"
        });

        await getVehicleDetail();
        await getRepairDetail();
        await getVehicleImages();
      } catch (error) {
        console.error("저장 실패", error);
        Swal.fire({
          title: "오류!",
          text: "변경을 저장하는 데 실패했습니다.",
          icon: "error",
          confirmButtonText: "확인"
        });
      }
    }
  };

  const deleteVehicle = async () => {
    try {
      await axios.post(`http://localhost:8787/api/vehicleDel/${vehicleCode}`);
      Swal.fire({
        title: "삭제 완료",
        text: "차량이 삭제되었습니다",
        icon: "success",
        confirmButtonText: "확인"
      });
      navigate("/vehicleList");
    } catch (error) {
      console.error("차량 삭제 불가", error);
      Swal.fire({
        title: "오류!",
        text: "차량 삭제에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인"
      });
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
    await getVehicleImages();
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
      setShowImage(URL.createObjectURL(file)); // 미리보기 이미지 URL 설정
      setImage(file);
    }
  }

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <br></br>
      <h4>차량 상세</h4>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 20, gap: "15px" }}>
        {vehicleDetail.vehicleStatus === 'R' && <span className="badge badge-danger">수리</span>}
        {vehicleDetail.vehicleStatus === 'I' && <span className="badge badge-primary">보관</span>}
        {vehicleDetail.vehicleStatus === 'O' && <span className="badge badge-success">출차</span>}
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ width: "480px", height: "320px", backgroundColor: "#e9ecef", borderRadius: "10px", padding: "10px", marginRight: "50px", marginLeft: "50px" }}>
          {showImage ? (
            <img src={showImage} alt="차량 이미지" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
          ) : (
            <img src={image} alt="차량 이미지" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
          )}
          <input type="file" onChange={handleImageUpload} style={{ marginTop: 10 }} />
        </div>

        <div style={{ flex: 1, marginTop: 10 }}>
          <table className="table table-bordered" style={{ marginBottom: "30px" }}>
            <tbody>
              <tr>
                <th style={{ width: "30%", textAlign: "center", backgroundColor: "#f2f2f2", verticalAlign: "middle" }}>차량등록번호</th>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{vehicleDetail.vehicleCode}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "center", backgroundColor: "#f2f2f2", verticalAlign: "middle" }}>차량번호</th>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{vehicleDetail.vehicleNo}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "center", backgroundColor: "#f2f2f2", verticalAlign: "middle" }}>차종</th>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{vehicleDetail.vehicleModel}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "center", backgroundColor: "#f2f2f2", verticalAlign: "middle" }}>등록일</th>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{new Date(vehicleDetail.vehicleRegdate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "center", backgroundColor: "#f2f2f2", verticalAlign: "middle" }}>구분</th>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{vehicleDetail.vehicleType === "C" ? "영업" : "화물"}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "center", backgroundColor: "#f2f2f2", verticalAlign: "middle" }}>{vehicleDetail.vehicleType === "C" ? "인승" : "용량(t)"}</th>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{vehicleDetail.vehicleSize}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "center", backgroundColor: "#f2f2f2", verticalAlign: "middle" }}>현황</th>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>{vehicleDetail.vehicleStatus === "R" ? "수리" : (vehicleDetail.vehicleStatus === "I" ? "보관" : "출차")}</td>
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
