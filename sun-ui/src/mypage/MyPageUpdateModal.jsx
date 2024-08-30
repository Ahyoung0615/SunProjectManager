import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const MyPageUpdateModal = ({ show, handleClose, empCode, onUpdateSuccess }) => {
    const [employee, setEmployee] = useState({});
    const [emp, setEmp] = useState({
        EmpCode: '',
        EmpJob: '',
        EmpDept: '',
        EmpTel: '',
        EmpEmail: '',
        EmpAddress: '',
        EmpStatus: '',
    });
    const [phoneError, setPhoneError] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (empCode) {
            fetch(`http://localhost:8787/memberDetail/${empCode}`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    setEmployee(data);
                    setEmp({
                        EmpCode: data.empCode.toString(),
                        EmpJob: data.jobCode.toString(),
                        EmpDept: data.deptCode ? data.deptCode.toString() : '',
                        EmpTel: data.empTel || '',
                        EmpEmail: data.empEmail || '',
                        EmpAddress: data.empAddress || '',
                        EmpStatus: data.empStatus || '',
                    });
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        }
    }, [empCode]);

    const validatePhoneNumber = (phoneNumber) => {
        // 전화번호 형식 검사 정규 표현식
        const phoneRegex = /^(010[-\s]?\d{4}[-\s]?\d{4})$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // 전화번호 유효성 검사
        if (name === 'EmpTel') {
            if (value === '') {
                setPhoneError('전화번호는 필수 입력 항목입니다.');
            } else if (!validatePhoneNumber(value)) {
                setPhoneError('유효한 전화번호를 입력해주세요. 형식: 010-XXXX-XXXX 또는 010XXXXXXXX');
            } else {
                setPhoneError('');
            }
        }

        setEmp((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 전화번호 유효성 검사
        if (emp.EmpTel === '') {
            setPhoneError('전화번호는 필수 입력 항목입니다.');
            return;
        }

        if (!validatePhoneNumber(emp.EmpTel)) {
            setPhoneError('유효한 전화번호를 입력해주세요. 형식: 010-XXXX-XXXX 또는 010XXXXXXXX');
            return;
        }

        setPhoneError(''); // 전화번호 오류를 제거합니다.
        setFormError(''); // 폼 오류를 제거합니다.

        const formData = new FormData();
        formData.append('EmpCode', emp.EmpCode);
        formData.append('EmpJob', emp.EmpJob);
        formData.append('EmpDept', emp.EmpDept);
        formData.append('EmpTel', emp.EmpTel);
        formData.append('EmpEmail', emp.EmpEmail);
        formData.append('EmpAddress', emp.EmpAddress);
        formData.append('EmpStatus', emp.EmpStatus);

        try {
            const response = await axios.post(`http://localhost:8787/memberUpdate/${empCode}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            console.log(response.data);
            alert('사원 정보 수정이 완료되었습니다.');
            onUpdateSuccess();
            handleClose();
        } catch (error) {
            console.error('사원 정보 수정 중 오류가 발생했습니다:', error);
            alert('사원 정보 수정 중 오류가 발생했습니다.');
        }
    };

    const getJobTitle = (jobCode) => {
        switch (jobCode) {
            case 1: return '대표';
            case 11: return '이사';
            case 21: return '부장';
            case 31: return '차장';
            case 41: return '과장';
            case 51: return '대리';
            case 61: return '주임';
            case 71: return '사원';
            default: return '직급 미정';
        }
    };

    const getGender = (gender) => {
        switch (gender) {
            case 'F': return '여성';
            case 'M': return '남성';
            default: return '정보 없음';
        }
    };

    const getStatus = (empStatus) => {
        switch (empStatus) {
            case 'Y': return '재직';
            case 'N': return '퇴사';
            case 'V': return '휴가';
            default: return '정보 없음';
        }
    };

    const getDeptTitle = (deptCode) => {
        switch (deptCode) {
            case 1: return '경영총괄';
            case 11: return '경영지원';
            case 21: return '연구개발';
            case 31: return '고객지원';
            case 41: return '운송관리';
            case 51: return '품질관리';
            case 61: return '자재관리';
            case 71: return '생산제조';
            default: return '부서 미정';
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>사원 정보 수정</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formEmpName">
                        <Form.Label>이름</Form.Label>
                        <Form.Control type="text" value={employee.empName || ''} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formEmpJob">
                        <Form.Label>직무</Form.Label>
                        <Form.Control type='text' value={getJobTitle(employee.jobCode)} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formEmpDept">
                        <Form.Label>부서</Form.Label>
                        <Form.Control type='text' name="EmpDept" value={getDeptTitle(employee.deptCode)} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formGender">
                        <Form.Label>성별</Form.Label>
                        <Form.Control type="text" value={getGender(employee.gender) || '정보 없음'} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formEmpTel">
                        <Form.Label>전화번호</Form.Label>
                        <Form.Control
                            type="tel"
                            name="EmpTel"
                            value={emp.EmpTel}
                            onChange={handleChange}
                            isInvalid={phoneError !== ''}
                        />
                        <Form.Control.Feedback type="invalid">
                            {phoneError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formEmpEmail">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control
                            type="email"
                            name="EmpEmail"
                            value={emp.EmpEmail}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmpAddress">
                        <Form.Label>주소</Form.Label>
                        <Form.Control
                            type="text"
                            name="EmpAddress"
                            value={emp.EmpAddress}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmpStatus">
                        <Form.Label>근무현황</Form.Label>
                        <Form.Control type='text' name="EmpStatus" value={getStatus(employee.empStatus)} readOnly />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit">
                            수정
                        </Button>
                        <Button variant="secondary" onClick={handleClose} style={{ marginRight: '10px' }}>
                            닫기
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default MyPageUpdateModal;
