import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const VehicleRentListComponent = () => {

    const navigate = useNavigate();

    const [vrentlist, setVrentlist] = useState([{
        vrentcode: '1',
        empname: '김경영',
        jobname: '과장',
        deptname: '경영지원부',
        vrentdate: '2024.07.02',
        vrentlength: '15km',
        vrentstate: '승인대기중'
    }]);

    const showDetail = (vrentcode) => {
        navigate(`/vehicleRentDetail/${vrentcode}`);
    }

    const handleSelect = (eventKey) => {
        alert(`Selected option: ${eventKey}`);
    };

    return (
        <div className='container' style={{ marginTop: 30 }}>
            <br></br>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h4 style={{ marginBottom: 0 }}>배차 관리</h4>
                <DropdownButton
                    id="dropdown-basic-button"
                    title="배차현황"
                    onSelect={handleSelect}
                >
                    <Dropdown.Item eventKey="1">승인대기중</Dropdown.Item>
                    <Dropdown.Item eventKey="2">반려</Dropdown.Item>
                    <Dropdown.Item eventKey="3">승인완료</Dropdown.Item>
                </DropdownButton>
            </div>

            {/* 배차 관리 테이블 */}
            <table className="table table-bordered" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>연번</th>
                        <th>신청자</th>
                        <th>직급</th>
                        <th>부서</th>
                        <th>기간</th>
                        <th>거리</th>
                        <th>배차 현황</th>
                        <th>상세</th>
                    </tr>
                </thead>
                <tbody>
                    {vrentlist.map((item, index) => (
                        <tr key={index}>
                            <td>{item.vrentcode}</td>
                            <td>{item.empname}</td>
                            <td>{item.jobname}</td>
                            <td>{item.deptname}</td>
                            <td>{item.vrentdate}</td>
                            <td>{item.vrentlength}</td>
                            <td>{item.vrentstate}</td>
                            <td>
                                <button className="btn btn-secondary" onClick={() => showDetail(item.vrentcode)}>상세</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VehicleRentListComponent;
