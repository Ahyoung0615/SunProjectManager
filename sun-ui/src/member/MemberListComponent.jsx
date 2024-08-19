import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MemberListComponent = () => {
    const [emp, setEmployee] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('1');
    

    useEffect(() => {
        // 선택된 상태에 따라 API 호출
        const fetchData = async () => {
            let url = 'http://localhost:8787/memberDetail'; // 기본 URL
            if (selectedStatus === '2') {
                url = 'http://localhost:8787/memberDetail1'; // 퇴사
            } else if (selectedStatus === '3') {
                url = 'http://localhost:8787/memberDetail2'; // 휴가
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEmployee(data);
            } catch (error) {
                console.error('Error fetching employee list:', error);
            }
        };

        fetchData();
    }, [selectedStatus]);

    const handleSelect = (eventKey) => {
        setSelectedStatus(eventKey);;
    };
    const handleNewEmp = () => {
        window.open(
            '/NewEmp', // 실제로 팝업 창에서 열고자 하는 경로를 지정합니다.
            '신규사원등록',
            'width=500,height=600' // 팝업 창의 크기 설정
          );
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
                    <Dropdown.Item eventKey="2">퇴사</Dropdown.Item>
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
                            <td><Link to={`/memberDetail/${item.empCode}`}>{item.empCode}</Link></td>
                            <td>{item.empName}</td>
                            <td>{getDeptTitle(item.deptCode)}</td>
                            <td>{getJobTitle(item.jobCode)}</td>
                            <td>{item.empEmail}</td>
                            <td>{getStatus(item.empStatus)}</td>
                        </tr>
                    ))}
                </tbody>
                <button className="btn btn-primary" onClick={handleNewEmp} style={{position: 'absolute', right: '190px'}}>
                        신규사원 등록
                </button>
            </table>
        </div>
    );
};

export default MemberListComponent;
