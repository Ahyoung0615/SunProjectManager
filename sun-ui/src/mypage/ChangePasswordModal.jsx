import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const ChangePasswordModal = ({ show, handleClose, empCode }) => {
    const [employee, setEmployee] = useState({});
    const [emp, setEmp] = useState({
        EmpCode: '',
        CurrentPassword: '',
        ChangePassword: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8787/memberDetail/${empCode}`)
            .then(response => {
                if(!response.ok){
                    throw new Error('사원정보를 받아오지 못했습니다.')
                }
                return response.json();
            })
            .then(data => {
                setEmployee(data);
                setEmp({
                    EmpCode: data.empCode.toString(),
                    CurrentPassword: '',
                    ChangePassword: '',
                });
            })
            .catch(error => {
                console.error('Fetch 에러:',error);
            })
    }, [empCode]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('EmpCode', emp.EmpCode);
        formData.append('CurrentPassword', emp.CurrentPassword);
        formData.append('ChangePassword', emp.ChangePassword);
        if(emp.EmpCode == empCode ){
            try {
                const response = await axios({
                    url: `http://localhost:8787/updatePassword/${empCode}`,
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
                navigate('/');
                window.sessionStorage.removeItem("user");
            } catch (error) {
                console.error('사원 정보 수정 중 오류가 발생했습니다:', error);
                alert('사원 정보 수정 중 오류가 발생했습니다.');
            }
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
                <Modal.Title>비밀번호 수정</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formEmpCode">
                        <Form.Label>사번</Form.Label>
                        <Form.Control
                            type="text"
                            name='empCode'
                            value={emp.EmpCode}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formCurrentPassword">
                        <Form.Label>현재 비밀번호</Form.Label>
                        <Form.Control
                            type='text'
                            name='CurrentPassword'
                            value={emp.CurrentPassword}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formChangePassword">
                        <Form.Label>변경 할 비민번호</Form.Label>
                        <Form.Control
                            type='text'
                            name="ChangePassword"
                            value={emp.ChangePassword}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit">
                            변경
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

export default ChangePasswordModal;