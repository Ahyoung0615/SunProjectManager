import React, { useEffect, useState } from "react";
import VehicleRentFormComponent from "../vehicle/VehicleRentFormComponent";
import { Link, useNavigate } from "react-router-dom";
import ModalComponent from './../commodule/ModalComponent';
import CoWorkComponent from './../cowork/CoWorkComponent';
import BTripAddressComponent from "./BTripAddressComponent";
import axios from 'axios';

const BTripFormComponent = () => {
  const nanigator = useNavigate();
  const [info, setInfo] = useState({
    rentStartDate: "",
    rentEndDate: "",
    vehicleCode: 0,
    vrsvDetail: ""
  });
  
  const [btripInfo, setBtripInfo] = useState({
    empCode: "",
    startDate: "",
    endDate: "",
    reason: "",
    departureAddress: { areaAddress: '', townAddress: '' },
    destinationAddress: { areaAddress: '', townAddress: '' }
  });
  
  const [isVehicleRequest, setIsVehicleRequest] = useState(false);
  const [options, setOptions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState("");
  const [selectedCoWorkAddress, setSelectedCoWorkAddress] = useState("");
  const [showAddressInput, setShowAddressInput] = useState({ departure: false, destination: false });
  const [userName, setUserName] = useState("");
  const [userDept, setUserDept] = useState("");
  const [userJob, setUserJob] = useState("");
  const [sessionEmp, setSessionEmp] = useState(null);
  const [jobCode, setJobCode] = useState(null);
  const [deptCode, setDeptCode] = useState(null);
  const [isVehicleSubmitted, setIsVehicleSubmitted] = useState(false);

  // 세션에서 사용자 정보 가져오기
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      const parsedUser = JSON.parse(sessionUser);
      setSessionEmp(parsedUser.empcode);
    }
  }, []);

  // sessionEmp 값이 설정된 후 사용자 정보 가져오기
  useEffect(() => {
    if (sessionEmp) {
      const getUserInfo = async () => {
        try {
          const response = await axios.get(`http://localhost:8787/memberDetail/${sessionEmp}`);
          const data = response.data;
          setUserName(data.empName);
          setJobCode(data.jobCode);
          setDeptCode(data.deptCode);
          setBtripInfo(prevState => ({ ...prevState, empCode: data.empCode }));
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
        }
      };
      getUserInfo();
    }
  }, [sessionEmp]);

  // 직급과 부서 설정
  useEffect(() => {
    if (jobCode !== null) {
      setUserJob(getJobTitle(jobCode));
    }
    if (deptCode !== null) {
      setUserDept(getDeptTitle(deptCode));
    }
  }, [jobCode, deptCode]);

  const getJobTitle = (jobCode) => {
    switch (jobCode) {
      case 1:
        return '대표';
      case 11:
        return '이사';
      case 21:
        return '부장';
      case 31:
        return '차장';
      case 41:
        return '과장';
      case 51:
        return '대리';
      case 61:
        return '주임';
      case 71:
        return '사원';
      default:
        return '직급 미정';
    }
  };

  const getDeptTitle = (deptCode) => {
    switch (deptCode) {
      case 1:
        return '경영총괄';
      case 11:
        return '경영지원';
      case 21:
        return '연구개발';
      case 31:
        return '고객지원';
      case 41:
        return '운송관리';
      case 51:
        return '품질관리';
      case 61:
        return '자재관리';
      case 71:
        return '생산제조';
      default:
        return '부서 미정';
    }
  };

  const handleVehicleRequestToggle = () => {
    setIsVehicleRequest(!isVehicleRequest);
  };

  const handleOptionChange = (event) => {
    const { name, value } = event.target;
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));

    if (name === 'group1' && value === 'option1') {
      const newAddress = { areaAddress: '서울시', townAddress: '구로구 가산동' };
      setBtripInfo(prevState => ({
        ...prevState,
        departureAddress: newAddress
      }));
    }

    if (name === 'group2' && value === 'option1' && selectedCoWorkAddress) {
      const newAddress = { areaAddress: '', townAddress: selectedCoWorkAddress };
      setBtripInfo(prevState => ({
        ...prevState,
        destinationAddress: newAddress
      }));
    }
  };

  const handleStartDateChange = (event) => {
    const newStartDate = event.target.value;
    setBtripInfo(prevState => ({
      ...prevState,
      startDate: newStartDate
    }));
  };

  const handleEndDateChange = (event) => {
    const newEndDate = event.target.value;
    if (newEndDate < btripInfo.startDate) {
      alert("종료일자는 시작일자보다 이전일 수 없습니다.");
      return;
    }
    setBtripInfo(prevState => ({
      ...prevState,
      endDate: newEndDate
    }));
  };

  const openModal = (target) => {
    setModalTarget(target);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddressSelect = (address, target) => {
    if (target === 'departure') {
      setBtripInfo(prevState => ({
        ...prevState,
        departureAddress: address
      }));
    } else if (target === 'destination') {
      setBtripInfo(prevState => ({
        ...prevState,
        destinationAddress: address
      }));
    }
    setShowAddressInput(prev => ({ ...prev, [target]: false }));
  };

  const handleCoWorkSelect = (address) => {
    setSelectedCoWorkAddress(address);
    setBtripInfo(prevState => ({
      ...prevState,
      destinationAddress: { areaAddress: '', townAddress: address }
    }));
    closeModal();
  };

  const handleVehicleSubmit = (name, value) => {
    setInfo({
      ...info,
      [name]: value
    });
    setIsVehicleSubmitted(true);
  };

  const handleReasonChange = (event) => {
    const { value } = event.target;
    setBtripInfo(prevState => ({
      ...prevState,
      reason: value
    }));
  };

  const handleSubmit = async () => {
    if (!btripInfo.startDate || !btripInfo.endDate || btripInfo.reason.trim() === "" || (!btripInfo.departureAddress.townAddress && options.group1 === "option2") || (!btripInfo.destinationAddress.townAddress && options.group2 === "option2")) {
      alert("모든 필드를 올바르게 입력해주세요.");
      return;
    }

    if (isVehicleRequest && !isVehicleSubmitted) {
      alert("배차 신청서를 작성해주세요.");
      return;
    }

    const constAllData = {
      empCode: sessionEmp,
      brstartdate: btripInfo.startDate,
      brenddate: btripInfo.endDate,
      brdetail: btripInfo.reason,
      brdepart: btripInfo.departureAddress.townAddress,
      brarrival: btripInfo.destinationAddress.townAddress,
      rentStartDate: info.rentStartDate,
      rentEndDate: info.rentEndDate,
      vehicleCode: info.vehicleCode,
      vrsvDetail: info.vrsvDetail
    };
    console.log("최종 전송 데이터:", JSON.stringify(constAllData));

    console.log('constAllData:', constAllData);

    try {
      const response = await axios.post("http://localhost:8787/api/insertBTrip", constAllData);
      console.log('Response:', response.data);
      if(response.data>1000){
        alert('신청서 등록 완료');
        nanigator('/btripList');
      }
    } catch (error) {
      console.error('전송 실패:', error);
    }
  };

  const modalBody = modalTarget === 'destination' ? (
    <CoWorkComponent onSelect={handleCoWorkSelect} />
  ) : (
    <BTripAddressComponent
      setAddressObj={(address) => handleAddressSelect(address, modalTarget)}
    />
  );

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <br />
      <h4>출장 신청서 작성</h4>
      <div style={{ marginTop: 30, marginLeft: 20, marginRight: 20 }}>
        <h5>출장자 정보</h5>
        <table className="table table-bordered" style={{ lineHeight: '2.5' }}>
          <tbody>
            <tr>
              <th>이름*</th>
              <td>{userName}</td>
            </tr>
            <tr>
              <th>직급*</th>
              <td>{userJob}</td>
            </tr>
            <tr>
              <th>부서*</th>
              <td>{userDept}</td>
            </tr>
            <tr>
              <th>시작일자</th>
              <td>
                <input
                  type="date"
                  value={btripInfo.startDate}
                  onChange={handleStartDateChange}
                  style={{ height: 30 }}
                />
              </td>
            </tr>
            <tr>
              <th>종료일자</th>
              <td>
                <input
                  type="date"
                  value={btripInfo.endDate}
                  onChange={handleEndDateChange}
                  style={{ height: 30 }}
                />
              </td>
            </tr>
            <tr>
              <th>출발지</th>
              <td>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="group1"
                      value="option1"
                      checked={options.group1 === "option1"}
                      onChange={handleOptionChange}
                      style={{ marginLeft: 10 }}
                    />
                    SUN 본사 위치(서울시 구로구 가산동)
                  </label>

                  <div style={{ marginTop: 10 }}>
                    <label>
                      <input
                        type="radio"
                        name="group1"
                        value="option2"
                        checked={options.group1 === "option2"}
                        onChange={handleOptionChange}
                        style={{ marginLeft: 10 }}
                      />
                      직접 입력
                    </label>
                    <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                      <div style={{ visibility: options.group1 === "option2" ? 'visible' : 'hidden', display: 'flex', alignItems: 'center', width: '100%' }}>
                        <input
                          type="text"
                          readOnly
                          value={btripInfo.departureAddress.townAddress}
                          className="form-control"
                          style={{ marginTop: -20, marginLeft: 20, marginRight: 10, width: 500 }}
                        />
                        {!showAddressInput.departure && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowAddressInput(prev => ({ ...prev, departure: true }))}
                            style={{ marginTop: -20 }}
                          >
                            주소 입력
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {showAddressInput.departure && (
                    <BTripAddressComponent
                      setAddressObj={(address) => handleAddressSelect(address, 'departure')}
                      key="departure"
                    />
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <th>도착지</th>
              <td>
                <div>
                  <label>
                    <input type="radio" name="group2" value="option1" checked={options.group2 === "option1"}
                      onChange={handleOptionChange}
                      style={{ marginLeft: 10 }}
                      onClick={() => openModal('destination')}
                    />
                    협력사 선택
                  </label>
                  {options.group2 === "option1" && (
                    <input
                      type="text"
                      value={btripInfo.destinationAddress.townAddress}
                      readOnly
                      className="form-control mt-2"
                      style={{ marginTop: -20, marginLeft: 20, marginRight: 10, width: 500 }}
                    />
                  )}
                  <div style={{ marginTop: 10 }}>
                    <label>
                      <input type="radio" name="group2" value="option2" checked={options.group2 === "option2"}
                        onChange={handleOptionChange} style={{ marginLeft: 10 }}
                      />
                      직접 입력
                    </label>
                    <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                      <div style={{ visibility: options.group2 === "option2" ? 'visible' : 'hidden', display: 'flex', alignItems: 'center', width: '100%' }}>
                        <input
                          type="text"
                          readOnly
                          value={btripInfo.destinationAddress.townAddress}
                          className="form-control"
                          style={{ marginTop: -20, marginLeft: 20, marginRight: 10, width: 500 }}
                        />
                        {!showAddressInput.destination && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowAddressInput(prev => ({ ...prev, destination: true }))}
                            style={{ marginTop: -20 }}
                          >
                            주소 입력
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {showAddressInput.destination && (
                    <BTripAddressComponent
                      setAddressObj={(address) => handleAddressSelect(address, 'destination')}
                      key="destination"
                    />
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <th>사유</th>
              <td>
                <textarea
                  className="form-control"
                  placeholder="500자 이내로 내용을 입력해주세요"
                  value={btripInfo.reason}
                  onChange={handleReasonChange}
                  maxLength="500"
                  rows="6"
                  style={{ height: 'auto' }}
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h5 style={{ marginLeft: 530, marginTop: 30 }}>차량 배차 신청 여부</h5>
        <label style={{
          position: "relative",
          display: "inline-block",
          width: "34px",
          height: "20px",
          marginLeft: 600,
          marginTop: 10
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

      {isVehicleRequest && (
        <VehicleRentFormComponent onInfoChange={handleVehicleSubmit} info={info} />
      )}

      <div style={{ marginTop: 50, marginBottom: 70 }}>
        <Link to='/btripList'><button style={{ marginLeft: 500 }} className="btn btn-danger">취소</button></Link>
        <button style={{ marginLeft: 150 }} className="btn btn-primary" onClick={handleSubmit}>제출</button>
      </div>

      <ModalComponent
        open={isModalOpen}
        close={closeModal}
        title={modalTarget === 'destination' ? "협력사 선택" : "주소 선택"}
        body={modalBody}
        size="xl"
      />
    </div>
  );
};

export default BTripFormComponent;
