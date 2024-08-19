import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MemberDetailComponent = () => {
    const { empCode } = useParams();
    const [employee, setEmployee] = useState([]);
    const [file, setFile] = useState(null);
    const [empImg, setEmpImg] = useState(`http://localhost:8787/memberImage/${employee.empImg}`);

    useEffect(() => {
      // API 호출
      fetch(`http://localhost:8787/memberDetail/${empCode}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              setEmployee(data);
          })
          .catch(error => {
          });
  }, [empCode]);
  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("empCode", empCode);

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
            setEmpImg(`http://localhost:8787/memberImage/${employee.empImg}`);
        } catch (error) {
            throw new Error('Invalid JSON format');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('파일 업로드 중 오류가 발생했습니다.');
    });
};
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
    const handleUpdate = () => {
      window.open(
        `/memberUpdate/${empCode}`,
        '사원정보수정',
        'width=500,height=600'
      )
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
    const handlePasswordReset = () => {
      fetch(`http://localhost:8787/resetPassword/${empCode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();  // 비밀번호 초기화 API는 응답으로 텍스트를 보낼 것으로 예상됩니다.
    })
    .then(message => {
        alert(message);  // 성공 메시지 표시
    })
    .catch(error => {
        alert('비밀번호 초기화 중 오류가 발생했습니다.');
    });
  };
  
    return (
      <div className="container" style={{ marginTop: 30 }}>
      <h1>사원 상세</h1>
      {/* 이미지와 사원 정보 테이블을 가로로 배치 */}
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
          {/* 사원 이미지 및 파일 업로드 */}
          <div style={{ marginRight: 20, textAlign: "center" }}>
              <div style={{ width: "300px", height: "300px", backgroundColor: "#ccc", marginBottom: 10 }}>
                        {employee.empImg ? (
                                      <img src={`http://localhost:8787/memberImage/${employee.empImg}`} alt="사원 이미지" style={{ width: "100%", height: "100%" }} />
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
                <td>{employee.empCode}</td>
              </tr>
              <tr>
                <td>이름</td>
                <td>{employee.empName}</td>
              </tr>
              <tr>
                <td>직급</td>
                <td>{getJobTitle(employee.jobCode)}</td>
              </tr>
              <tr>
                <td>부서</td>
                <td>{getDeptTitle(employee.deptCode)}</td>
              </tr>
              <tr>
                <td>성별</td>
                <td>{getGender(employee.gender)}</td>
              </tr>
              <tr>
                <td>전화번호</td>
                <td>{employee.empTel}</td>
              </tr>
              <tr>
                <td>이메일</td>
                <td>{employee.empEmail}</td>
              </tr>
              <tr>
                <td>주소</td>
                <td>{employee.empAddress}</td>
              </tr>
              <tr>
                <td>입사일</td>
                <td>{employee.joindate}</td>
              </tr>
              <tr>
                <td>근무현황</td>
                <td>{getStatus(employee.empStatus)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleUpdate} style={{position: 'absolute', right: '350px'}}>
            수정
      </button>
      <button className="btn btn-primary" onClick={handlePasswordReset} style={{position: 'absolute', right: '190px'}}>
            비밀번호 초기화
      </button>
      
    </div>
    );
};

export default MemberDetailComponent;