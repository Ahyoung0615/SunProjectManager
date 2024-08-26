import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MemberUpdateModal = ({ show, handleClose }) => {
    const { empCode } = useParams();
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
    }, [empCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('EmpCode', emp.EmpCode);
        formData.append('EmpJob', emp.EmpJob);
        formData.append('EmpDept', emp.EmpDept);
        formData.append('EmpTel', emp.EmpTel);
        formData.append('EmpEmail', emp.EmpEmail);
        formData.append('EmpAddress', emp.EmpAddress);
        formData.append('EmpStatus', emp.EmpStatus);

        try {
            const response = await axios({
                url: `http://localhost:8787/memberUpdate/${empCode}`,
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            console.log(response.data);
            alert('사원 정보 수정이 완료되었습니다.');
            handleClose(); // 모달 닫기
        } catch (error) {
            console.error('사원 정보 수정 중 오류가 발생했습니다:', error);
            alert('사원 정보 수정 중 오류가 발생했습니다.');
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmp((prevState) => ({
            ...prevState,
            [name]: value
        }));
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
                        <Form.Control
                            type="text"
                            value={employee.empName || ''}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmpJob">
                        <Form.Label>직무</Form.Label>
                        <Form.Control
                            as="select"
                            name="EmpJob"
                            value={emp.EmpJob}
                            onChange={handleChange}
                            required
                        >
                            <option value="">선택하세요</option>
                            <option value="1">대표</option>
                            <option value="11">이사</option>
                            <option value="21">부장</option>
                            <option value="31">차장</option>
                            <option value="41">과장</option>
                            <option value="51">대리</option>
                            <option value="61">주임</option>
                            <option value="71">사원</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formEmpDept">
                        <Form.Label>부서</Form.Label>
                        <Form.Control
                            as="select"
                            name="EmpDept"
                            value={emp.EmpDept}
                            onChange={handleChange}
                            required
                        >
                            <option value="">선택하세요</option>
                            <option value="1">경영총괄</option>
                            <option value="11">경영지원</option>
                            <option value="21">연구개발</option>
                            <option value="31">고객지원</option>
                            <option value="41">운송관리</option>
                            <option value="51">품질관리</option>
                            <option value="61">자재관리</option>
                            <option value="71">생산제조</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formGender">
                        <Form.Label>성별</Form.Label>
                        <Form.Control
                            type="text"
                            value={getGender(employee.gender) || '정보 없음'}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmpTel">
                        <Form.Label>전화번호</Form.Label>
                        <Form.Control
                            type="text"
                            name="EmpTel"
                            value={emp.EmpTel}
                            onChange={handleChange}
                        />
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
                        <Form.Control
                            as="select"
                            name="EmpStatus"
                            value={emp.EmpStatus}
                            onChange={handleChange}
                            required
                        >
                            <option value="">선택하세요</option>
                            <option value="Y">재직</option>
                            <option value="N">퇴사</option>
                            <option value="V">휴가</option>
                        </Form.Control>
                    </Form.Group>
                    <div>
                    <Button variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                    <Button variant="primary" type="submit">
                        수정
                    </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default MemberUpdateModal;
