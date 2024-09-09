import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const MemberAddModal = ({ show, handleClose, onSuccess }) => {
    const initialEmpState = {
        EmpName: '',
        EmpJob: '',
        EmpDept: '',
        Gender: '',
        EmpTel: '',
        EmpEmail: '',
        EmpAddress: '',
    };

    const [emp, setEmp] = useState(initialEmpState)

    const [phoneError, setPhoneError] = useState('');
    const [formError, setFormError] = useState('');
    const [emailError, setEmailError] = useState('');
    const validatePhoneNumber = (phoneNumber) => {
        // 전화번호 형식 검사 정규 표현식
        const phoneRegex = /^(010[-\s]?\d{4}[-\s]?\d{4})$/;
        return phoneRegex.test(phoneNumber);
    };

    const validateEmail = (empEmail) => {
        const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;  
        return emailRegEx.test(empEmail);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        
       

        setEmp((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(emp.EmpEmail === ''){
            setEmailError('이에밀은 필수 입력 항목입니다.')
            return;
        }

        if(!validateEmail(emp.EmpEmail)){
            setEmailError('유효한 이메일을 입력해주세요. 형식: XXX@XXX.XXX');
            return;
        }
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
        formData.append('EmpName', emp.EmpName);
        formData.append('EmpJob', emp.EmpJob);
        formData.append('EmpDept', emp.EmpDept);
        formData.append('Gender', emp.Gender);
        formData.append('EmpTel', emp.EmpTel);
        formData.append('EmpEmail', emp.EmpEmail);
        formData.append('EmpAddress', emp.EmpAddress);

        try {
            const response = await axios({
                url: 'http://localhost:8787/NewEmp',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true, // 필요한 경우 크로스 사이트 요청 시 쿠키를 포함
            });
            console.log(response.data); // 서버에서 반환한 데이터를 로그로 출력합니다.
            alert('사원 등록이 완료되었습니다.');
            onSuccess(); // 등록 성공 후 onSuccess 호출
            handleClose(); // 모달 닫기
            
        } catch (error) {
            console.error('사원 등록 중 오류가 발생했습니다:', error);
            alert('사원 등록 중 오류가 발생했습니다.');
        }
    };

    const closeModal = () => {
        setEmp(initialEmpState); // emp 상태 초기화
        handleClose(); // 모달 닫기
    };


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>사원 등록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formEmpName">
                        <Form.Label>이름</Form.Label>
                        <Form.Control
                            type="text"
                            name="EmpName"
                            value={emp.EmpName}
                            onChange={handleChange}
                            required
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
                            as="select"
                            name="Gender"
                            value={emp.Gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">선택하세요</option>
                            <option value="M">남</option>
                            <option value="F">여</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formEmpTel">
                        <Form.Label>전화번호</Form.Label>
                        <Form.Control
                            type="text"
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
                            isInvalid={emailError !== ''}
                        />
                        <Form.Control.Feedback type="invalid">
                            {emailError}
                        </Form.Control.Feedback>
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
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit">
                            사원 등록
                        </Button>
                        <Button variant="secondary" onClick={closeModal}>
                            닫기
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default MemberAddModal;
