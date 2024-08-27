import React, { useState } from "react";
import DateTimeComponent from "../commodule/DateTimeComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VehicleFormComponent = () => {
    const [image, setImage] = useState(null);
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [vehicleSize, setVehicleSize] = useState("");
    const [vfile, setVfile] = useState(null);
    const [vehicleRegDate, setVehicleRegDate] = useState(new Date());  // 등록일자 상태 추가
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setVfile(file);
        }
    };

    const validateForm = () => {
        if (!vehicleNumber || !vehicleModel || !vehicleType || !vehicleSize || !vfile || !vehicleRegDate) {
            alert("모든 필드를 입력해주세요.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
    
        const vehicleData = {
            vehicleNo: vehicleNumber,
            vehicleModel: vehicleModel,
            vehicleRegdate: vehicleRegDate.toISOString().split('T')[0],  // 날짜만 추출
            vehicleType: vehicleType,
            vehicleSize: vehicleSize
        };
    
        formData.append("vehicle", new Blob([JSON.stringify(vehicleData)], { type: "application/json" }));
        formData.append("file", vfile);
    
        try {
            const response = await axios.post('http://localhost:8787/api/insertVehicle', formData);
            if (response.status === 200) {
                alert("차량 등록 완료");
                navigate("/vehicleList");
            }
        } catch (error) {
            console.error('등록실패:', error);
        }
    };

    const handleCancel = () => {
        alert("등록이 취소되었습니다.");
        navigate("/vehicleList");
    };

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <br></br>
            <h4>차량 신규 등록</h4>
            <br></br>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, gap: "20px" }}>
                {/* 차량 이미지 섹션 */}
                <div style={{ width: "480px", height: "320px", backgroundColor: "#ccc", marginLeft: 50 }}>
                    {image ? (
                        <img src={image} alt="차량 이미지" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <div style={{ textAlign: "center", lineHeight: "320px", color: "#777" }}>이미지 선택</div>
                    )}
                    <input type="file" onChange={handleImageUpload} style={{ marginTop: 10 }} />
                </div>

                {/* 차량 정보 입력 테이블 */}
                <table className="table table-bordered" style={{ width: "60%", marginRight: 50, marginTop: 20 }}>
                    <thead style={{ backgroundColor: '#f2f2f2', textAlign: 'center' }}>
                        <tr>
                            <th style={{ width: '30%', textAlign: 'center' }}>항목</th>
                            <th style={{ width: '70%' }}>내용</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th style={{ textAlign: 'center' }}>차량번호</th>
                            <td>
                                <input
                                    type="text"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value)}
                                    style={{ width: "100%" }}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{ textAlign: 'center' }}>차종</th>
                            <td>
                                <input
                                    type="text"
                                    value={vehicleModel}
                                    onChange={(e) => setVehicleModel(e.target.value)}
                                    style={{ width: "100%" }}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{ textAlign: 'center' }}>구분</th>
                            <td>
                                <select
                                    value={vehicleType}
                                    style={{ width: "100%" }}
                                    onChange={(e) => setVehicleType(e.target.value)}
                                    required
                                >
                                    <option value="">선택</option>
                                    <option value="C">영업</option>
                                    <option value="F">화물</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th style={{ textAlign: 'center' }}>인승/용량(t)</th>
                            <td>
                                <input
                                    type="number"
                                    value={vehicleSize}
                                    onChange={(e) => setVehicleSize(e.target.value)}
                                    style={{ width: "100%" }}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{ textAlign: 'center' }}>등록일자</th>
                            <td>
                                <DateTimeComponent
                                    selectedDate={vehicleRegDate}
                                    setSelectedDate={setVehicleRegDate}
                                    style={{ width: "100%" }}
                                /> 
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 취소 및 등록 버튼 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                <button className="btn btn-secondary" onClick={handleCancel}>
                    취소
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                    등록
                </button>
            </div>
        </div>
    );
};

export default VehicleFormComponent;
