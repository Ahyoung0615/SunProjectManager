import React, { useEffect, useState } from 'react';
import MyPageUpdateModal from './MyPageUpdateModal';

const MyPageComponent = () => {
    const [employee , setEmployee] = useState(null); // 현재 로그인 사용자 정보
    const [emp , setEmp] = useState({});
    const [file, setFile] = useState(null);
    const [empImg, setEmpImg] = useState(`http://localhost:8787/memberImage/${emp.empImg}`);
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        if (value) {
            console.log('Session Storage Value:', value);
            setEmployee(JSON.parse(value));

        } else {
            console.log('Session Storage is empty or key does not exist.');
        }
    }, []);
    useEffect(() =>{
        if(employee && employee.empcode){
        fetch(`http://localhost:8787/memberDetail/${employee.empcode}`)
            .then(response => {
                if(!response.ok){
                    throw new Error('사원정보못받아옴');
                }
                return response.json();
            })
            .then(data =>{
                setEmp(data);
            })
            .catch(error => {
            });
        }
    }, [employee]);
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

    const getGender = (gender) =>{
      switch(gender){
        case 'F': 
            return '여성';
        case 'M': 
            return '남성';
      }
    }

    const getStatus = (empStatus) =>{
      switch(empStatus){
        case 'Y':
          return '재직';
        case 'N':
          return '퇴사';
        case 'V':
          return '휴가';
      }
    }
    const getDeptTitle = (deptCode) => {
        switch (deptCode){
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
        }
    };
    const handleUpload = () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("empCode", emp.empCode);
    
        fetch('http://localhost:8787/uploadImage', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Network response was not ok: ${text}`);
                });
            }
            return response.text();  // 응답을 텍스트로 받아옵니다.
        })
        .then(text => {
            try {
                // 응답이 비어있을 수도 있으므로, JSON으로 파싱을 시도합니다.
                const data = text ? JSON.parse(text) : {};
                console.log(data);
                alert(data.message || '파일 업로드 성공');
                setEmpImg(`http://localhost:8787/memberImage/${emp.empImg}`);
            } catch (error) {
                throw new Error('Invalid JSON format');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        });
    };
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      };
    return (
        <div className="container" style={{ marginTop: 30 }}>
      <h1>마이페이지</h1>
      {/* 이미지와 사원 정보 테이블을 가로로 배치 */}
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
          {/* 사원 이미지 및 파일 업로드 */}
          <div style={{ marginRight: 20, textAlign: "center" }}>
              <div style={{ width: "300px", height: "300px", backgroundColor: "#ccc", marginBottom: 10 }}>
                        {emp.empImg ? (
                                      <img src={`http://localhost:8787/memberImage/${emp.empImg}`} alt="사원 이미지" style={{ width: "100%", height: "100%" }} />
                        ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                                이미지 없음
                            </div>
                        )}
              </div>
              <label>파일 업로드:</label>
              <input type="file" onChange={handleFileChange}/>
              <br></br>
              <button className="btn btn-primary" onClick={handleUpload}>업로드</button>
          </div>
        {/*  세부 정보 테이블 */}
        <div style={{ flex: 2 }}>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>사번</td>
                <td>{emp.empCode}</td>
              </tr>
              <tr>
                <td>이름</td>
                <td>{emp.empName}</td>
              </tr>
              <tr>
                <td>직급</td>
                <td>{getJobTitle(emp.jobCode)}</td>
              </tr>
              <tr>
                <td>부서</td>
                <td>{getDeptTitle(emp.deptCode)}</td>
              </tr>
              <tr>
                <td>성별</td>
                <td>{getGender(emp.gender)}</td>
              </tr>
              <tr>
                <td>전화번호</td>
                <td>
                {emp.empTel}
                </td>
              </tr>
              <tr>
                <td>이메일</td>
                <td>
                {emp.empEmail}
                </td>
              </tr>
              <tr>
                <td>주소</td>
                <td>{emp.empAddress}</td>
              </tr>
              <tr>
                <td>입사일</td>
                <td>{emp.joindate}</td>
              </tr>
              <tr>
                <td>근무현황</td>
                <td>{getStatus(emp.empStatus)}</td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={handleShow} style={{position: 'absolute', right: '350px'}}>
                사원 정보 수정
            </button>
            <MyPageUpdateModal show={showModal} handleClose={handleClose} empCode={employee ? employee.empcode : null} />
        </div>
      </div>

      
      
    </div>
    );
};

export default MyPageComponent;