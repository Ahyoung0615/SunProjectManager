import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MemberUpdateModal from './MemberUpdateComponent';

const MemberDetailComponent = () => {
    const { empCode } = useParams();
    const [employee, setEmployee] = useState({});
    const [file, setFile] = useState(null);
    const [empImg, setEmpImg] = useState(null); // 초기값을 null로 설정
    const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지 상태
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = async () => {
        setShowModal(false);
        await fetchEmployeeData(); // 비동기 데이터 새로고침
    };

    // 사원 정보를 가져오는 useEffect
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await fetch(`http://localhost:8787/memberDetail/${empCode}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEmployee(data);
                setEmpImg(data.empImg ? `http://localhost:8787/memberImage/${data.empImg}` : '/img/noimages.png'); // 이미지 URL 업데이트
            } catch (error) {
                console.error('Error fetching employee data:', error);
                setEmpImg('/img/noimages.png'); // 에러 발생 시 기본 이미지
            }
        };

        fetchEmployeeData();
    }, [empCode]); // empCode가 변경될 때만 실행

    // 파일 업로드 핸들러
    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("empCode", empCode);

        try {
            const response = await fetch('http://localhost:8787/uploadImage', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Network response was not ok: ${text}`);
            }

            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            console.log(data);
            alert(data.message || '파일 업로드 성공');

            // 파일 업로드 후 사원 정보를 새로 고침
            await fetchEmployeeData();
        } catch (error) {
            console.error('Error:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        }
    };

    const fetchEmployeeData = async () => {
        try {
            const response = await fetch(`http://localhost:8787/memberDetail/${empCode}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEmployee(data);
            setEmpImg(data.empImg ? `http://localhost:8787/memberImage/${data.empImg}` : '/img/noimages.png'); // 이미지 URL 업데이트
        } catch (error) {
            console.error('Error fetching employee data:', error);
            setEmpImg('/img/noimages.png'); // 에러 발생 시 기본 이미지
        }
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
                return '정보 없음';
        }
    };

    const getStatus = (empStatus) => {
        switch (empStatus) {
            case 'Y':
                return '재직';
            case 'N':
                return '퇴사';
            case 'V':
                return '휴가';
            default:
                return '정보 없음';
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
                return '정보 없음';
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            // 기존의 객체 URL을 해제하여 메모리 누수 방지
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }

            const objectURL = URL.createObjectURL(selectedFile);
            setPreviewImage(objectURL);
        }
    };

    const handlePasswordReset = async () => {
        try {
            const response = await fetch(`http://localhost:8787/resetPassword/${empCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const message = await response.text();
            alert(message);
        } catch (error) {
            alert('비밀번호 초기화 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <h1>사원 상세</h1>
            <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ marginRight: 20, textAlign: "center" }}>
                    <div style={{ width: "300px", height: "300px", backgroundColor: "#ccc", marginBottom: 10 }}>
                        <img
                            src={previewImage || empImg || '/img/noimages.png'}
                            alt="사원 이미지"
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                    <label>파일 업로드:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <br />
                    <button className="btn btn-primary" onClick={handleUpload}>업로드</button>
                </div>
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
            <button className="btn btn-primary" onClick={handleShow} style={{ position: 'absolute', right: '350px' }}>
                사원 정보 수정
            </button>
            <MemberUpdateModal show={showModal} handleClose={handleClose} />

            <button className="btn btn-primary" onClick={handlePasswordReset} style={{ position: 'absolute', right: '190px' }}>
                비밀번호 초기화
            </button>
        </div>
    );
};

export default MemberDetailComponent;
