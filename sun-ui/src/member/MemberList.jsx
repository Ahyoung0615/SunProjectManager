// MemberList.js
import React from 'react';
import { Link } from 'react-router-dom';

const MemberList = ({ employees, getDeptTitle, getJobTitle, getStatus, employeesPerPage }) => {
    // 빈 요소를 추가하여 항상 10개의 행이 있도록 한다.
    const rows = [...employees];
    while (rows.length < employeesPerPage) {
        rows.push({});
    }

    return (
        <div style={{height:'460px'}}>
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
                {rows.map((item, index) => (
                    <tr key={index}>
                        <td style={{ width: '12%'}}>
                            {item.empCode ? (
                                <Link to={`/memberDetail/${item.empCode}`}>{item.empCode}</Link>
                            ) : (
                                <div>&nbsp;</div>
                            )}
                        </td>
                        <td style={{ width: '12%'}}>{item.empName || <div>&nbsp;</div>}</td>
                        <td style={{ width: '12%'}}>{item.deptCode ? getDeptTitle(item.deptCode) : <div>&nbsp;</div>}</td>
                        <td style={{ width: '12%'}}>{item.jobCode ? getJobTitle(item.jobCode) : <div>&nbsp;</div>}</td>
                        <td style={{ width: '40%'}}>{item.empEmail || <div>&nbsp;</div>}</td>
                        <td style={{ width: '12%'}}>{item.empStatus ? getStatus(item.empStatus) : <div>&nbsp;</div>}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
};

export default MemberList;
