import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';


const MemberListComponent = () => {
    const [emp, setEmployee] = useState([]);

    const handleSelect = (eventKey) => {
        alert(`Selected option: ${eventKey}`);
    };

    useEffect(() => {
        // Make an HTTP GET request to the Spring Boot API
        fetch('http://localhost:8787/memberDetail')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setEmployee(data))
            .catch(error => console.error('Error fetching employee list:', error));
    }, []);

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

    return (
        <div className="container" style={{ marginTop: 30 }}>
          <br></br>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h4 style={{ marginBottom: 0 }}>사원 목록 조회</h4>
            <DropdownButton
                    id="dropdown-basic-button"
                    title="재직상태"
                    onSelect={handleSelect}
                >
                    <Dropdown.Item eventKey="1">재직</Dropdown.Item>
                    <Dropdown.Item eventKey="2">지각</Dropdown.Item>
                    <Dropdown.Item eventKey="3">휴가</Dropdown.Item>
            </DropdownButton>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>사번</th>
                        <th>이름</th>
                        <th>부서</th>
                        <th>직급</th>
                        <th>이메일</th>
                        <th>근무내역</th>
                    </tr>
                </thead>
                <tbody>
                    {emp.map((item, index) =>(
                        <tr key={index}>
                            <td>{item.empCode}</td>
                            <td>{item.empName}</td>
                            <td>{getDeptTitle(item.deptCode)}</td>
                            <td>{getJobTitle(item.jobCode)}</td>
                            <td>{item.empEmail}</td>
                            <td>{item.empStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MemberListComponent;
