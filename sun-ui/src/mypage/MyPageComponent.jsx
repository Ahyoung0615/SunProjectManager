import React, { useEffect, useState } from 'react';
import MyPageUpdateModal from './MyPageUpdateModal';
import ChangePasswordModal from './ChangePasswordModal';
import axios from 'axios';

const MyPageComponent = () => {
    const [employee, setEmployee] = useState(null);
    const [emp, setEmp] = useState({});
    const [file, setFile] = useState(null);
    const [empImg, setEmpImg] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    //연차관리
    const [sessionEmp, setSessionEmp] = useState(null);
    const [dayOff, setDayOff] = useState(null);

    // 사인 등록
    const [sigFile, setSigFile] = useState();
    const [sigErrorMessage, setSigErrorMessage] = useState();
    const [sigPreview, setSigPreview] = useState();
    const [sigImg, setSigImg] = useState();
    const [isEditingSig, setIsEditingSig] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleShow1 = () => setShowModal1(true);
    const handleClose1 = () => setShowModal1(false);

    useEffect(() => {
        const value = window.sessionStorage.getItem('user');
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
            const parsedUser = JSON.parse(sessionUser);
            setSessionEmp(parsedUser.empcode);
        }
        if (value) {
            setEmployee(JSON.parse(value));
        }
    }, []);
    

    useEffect(() => {
        if (employee && employee.empcode) {
            fetch(`http://localhost:8787/memberDetail/${employee.empcode}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('사원정보못받아옴');
                    }
                    return response.json();
                })
                .then(data => {
                    axios.get(`http://localhost:8787/getMemberImage?empCode=${employee.empcode}`)
                    .then((res) => setEmpImg(res.data))
                    setEmp(data);
                    setPreviewImage(null); // 기존 이미지 로드 후 미리보기 초기화
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, [employee]);

    useEffect(() => {
        if (employee && employee.empcode) {
            console.log('사원 코드:', employee.empcode); // 디버깅을 위한 로그
            axios.get(`http://localhost:8787/api/edoc/getEmpSignatures?empCodes=${employee.empcode}`)
                .then((res) => {
                    console.log(res.data);
                    setSigImg(Object.values(res.data)[0]);
                })
                .catch((error) => {
                    console.error('사인 정보 조회 중 오류:', error);
                });
        }
    }, [employee]);

    const handleUpdateSuccess = () => {
        fetch(`http://localhost:8787/memberDetail/${employee.empcode}`)
            .then(response => {
                console.log(response.data)
                if (!response.ok) {
                    throw new Error('사원정보못받아옴');
                }
                return response.json();
            })
            .then(data => {
                setEmp(data);
            })
            .catch(error => {
                console.error('Error:', error);
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

    const getGender = (gender) => {
        switch (gender) {
            case 'F':
                return '여성';
            case 'M':
                return '남성';
            default:
                return '성별 미정';
        }
    }

    const getStatus = (empStatus) => {
        switch (empStatus) {
            case 'Y':
                return '재직';
            case 'N':
                return '퇴사';
            case 'V':
                return '휴가';
            default:
                return '상태 미정';
        }
    }

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
                return response.text();
            })
            .then(text => {
                try {
                    const data = text ? JSON.parse(text) : {};
                    console.log(data);
                    alert(data.message || '파일 업로드 성공');
                    setEmpImg(data);
                    handleUpdateSuccess();
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
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
            const objectURL = URL.createObjectURL(selectedFile);
            setPreviewImage(objectURL);
        }
    };

    const handleEmpSigFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setSigFile(selectedFile);
            setSigErrorMessage('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setSigPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setSigFile(null);
            setSigPreview('');
            setSigErrorMessage('이미지 파일만 업로드 해주세요 (jpg, png, etc.)');
        }
    };

    const handleEmpSigUpload = async () => {
        if (!sigFile) {
            alert('파일이 없습니다');
            return;
        }
        const formData = new FormData();
        formData.append('empSig', sigFile);
        formData.append('empCode', employee.empcode);
        try {
            await axios.post('http://localhost:8787/api/edoc/empSigUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                console.log(res.data);
                setSigImg(res.data);
                setSigErrorMessage('');
                setIsEditingSig(false); // 업로드 후 isEditingSig 상태 초기화
                setSigPreview('');
                handleUpdateSuccess(); // 업로드 후 정보 업데이트
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            setSigErrorMessage('등록에 실패하였습니다');
        }
    };

    //연차관리
    useEffect(() => {
        if (!sessionEmp) return;

        const getDayOff = async (empCode) => {
            try {
                const response = await axios.get(`http://localhost:8787/api/dayOff/${empCode}`);
                setDayOff(response.data);
            } catch (error) {
                alert("연차 조회 실패", error);
            }
        };

        getDayOff(sessionEmp);
    }, [sessionEmp]);

    // sessionEmp와 dayOff가 모두 준비될 때만 렌더링
    if (!sessionEmp || !dayOff) {
        return null; // 로딩 중이거나 데이터가 없을 때는 아무것도 렌더링하지 않음
    }

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <h1>마이페이지</h1>
            <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ marginRight: 20, textAlign: "center" }}>
                    <div style={{ width: "300px", height: "300px", backgroundColor: "#fff", marginBottom: 10 }}>
                        {previewImage ? (
                            <img src={previewImage} alt="미리보기 이미지" style={{ width: "100%", height: "100%" }} />
                        ) : emp.empImg ? (
                            <img src={empImg} alt="사원 이미지" style={{ width: "100%", height: "100%" }} />
                        ) : (
                            <img src="/img/noimages.png" alt="기본 이미지" style={{ width: "100%", height: "100%" }} />
                        )}
                    </div>
                    <label>파일 업로드:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <br />
                    <button className="btn btn-primary" onClick={handleUpload} style={{ alignItems: "center" }}>업로드</button>
                    {/* 연차관리 */}
                    <div style={{ marginTop: 0 }}>
                        <br />
                        <h4>나의 연차 관리</h4>
                        <table className="table table-bordered" style={{ maxWidth: 600 }}>
                            <thead>
                                <tr>
                                    <th>총 연차 개수</th>
                                    <th>사용 가능 연차</th>
                                    <th>사용한 연차</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{dayOff.dayOffLeft} 일</td>
                                    <td>{dayOff.dayOffLeft - dayOff.dayOffUsed} 일</td>
                                    <td>{dayOff.dayOffUsed} 일</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{ flex: 2 }}>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th>사번</th>
                                <td>{emp.empCode}</td>
                            </tr>
                            <tr>
                                <th>이름</th>
                                <td>{emp.empName}</td>
                            </tr>
                            <tr>
                                <th>직급</th>
                                <td>{getJobTitle(emp.jobCode)}</td>
                            </tr>
                            <tr>
                                <th>부서</th>
                                <td>{getDeptTitle(emp.deptCode)}</td>
                            </tr>
                            <tr>
                                <th>성별</th>
                                <td>{getGender(emp.gender)}</td>
                            </tr>
                            <tr>
                                <th>전화번호</th>
                                <td>{emp.empTel}</td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td>{emp.empEmail}</td>
                            </tr>
                            <tr>
                                <th>주소</th>
                                <td>{emp.empAddress}</td>
                            </tr>
                            <tr>
                                <th>입사일</th>
                                <td>{emp.joindate}</td>
                            </tr>
                            <tr>
                                <th>근무현황</th>
                                <td>{getStatus(emp.empStatus)}</td>
                            </tr>
                            <tr>
                                <th>사인</th>
                                <td>
                                    {isEditingSig ? (
                                        <div>
                                            <input type="file" accept="image/*" onChange={handleEmpSigFileChange} />
                                            <button className="btn btn-primary" onClick={handleEmpSigUpload}>등록</button>
                                            {sigErrorMessage && <p style={{ color: 'red' }}>{sigErrorMessage}</p>}
                                        </div>
                                    ) : emp.empSig ? (
                                        <div>
                                            <img
                                                src={sigImg}
                                                alt="사인"
                                                style={{ maxWidth: '100px', maxHeight: '50px', marginRight: '15px' }}
                                            />
                                            <button className="btn btn-secondary" onClick={() => setIsEditingSig(true)}>수정</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <input type="file" accept="image/jpg, image/png" onChange={handleEmpSigFileChange} />
                                            <button className="btn btn-primary" onClick={handleEmpSigUpload}>등록</button>
                                            {sigErrorMessage && <p style={{ color: 'red' }}>{sigErrorMessage}</p>}
                                        </div>
                                    )}
                                </td>
                            </tr>
                            {sigPreview && (
                                <tr>
                                    <td colSpan="2">

                                        <div>
                                            <h3>미리보기:</h3>
                                            <img
                                                src={sigPreview}
                                                alt="File Preview"
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <button className="btn btn-primary" onClick={handleShow} style={{ position: 'absolute', right: '350px' }}>사원 정보 수정</button>
                    <MyPageUpdateModal show={showModal} handleClose={handleClose} empCode={employee ? employee.empcode : null} onUpdateSuccess={handleUpdateSuccess} />

                    <button className="btn btn-primary" onClick={handleShow1} style={{ position: 'absolute', right: '200px' }}>비밀번호 변경</button>
                    <ChangePasswordModal show={showModal1} handleClose={handleClose1} empCode={employee ? employee.empcode : null} />
                </div>
            </div>
        </div>
    );
};

export default MyPageComponent;