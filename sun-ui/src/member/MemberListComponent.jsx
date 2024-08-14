import React, { useState } from "react";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from "react-router-dom";

const MemberListComponent = () => {
    const handleSelect = (eventKey) => {
        alert(`Selected option: ${eventKey}`);
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
                        <th>직급</th>
                        <th>부서</th>
                        <th>연락처</th>
                        <th>이메일</th>
                        <th>근무내역</th>
                    </tr>
                </thead>
            </table>
        </div>
    );
};

export default MemberListComponent;