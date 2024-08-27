import React, { useEffect, useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import { DataTable } from "simple-datatables";

const MainTableComponent = () => {
  const [notices, setNotices] = useState([]);
  const [employeeNames, setEmployeeNames] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBoardData = async () => {
        try {
            const response = await fetch('http://localhost:8787/boardList');
            const data = await response.json();

            const sortedData = [
                ...data.filter(notice => notice.notiStatus === 'I' && notice.notiDelflag === 'N'),
            ];

            setNotices(sortedData);

            const employeeCodes = sortedData.map(notice => notice.empCode);
            const fetchEmployeeNames = async () => {
                const data = {};
                for (const code of employeeCodes) {
                    const empResponse = await fetch(`http://localhost:8787/api/employee/${code}`);
                    if (empResponse.ok) {
                        const empdata = await empResponse.json();
                        data[code] = {
                            empName: empdata.empName,
                            empDept: empdata.deptCode,
                        };
                    }
                }
                setEmployeeNames(data);
            };
            fetchEmployeeNames();
        } catch (error) {
            console.error("게시글 불러오기 오류", error);
        }
    };

    fetchBoardData();
}, []);

const getDeptTitle = (empDept) => {
  switch (empDept) {
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
          return '부서명 없음'; 
  }
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};
  return (
    <div className="card mb-4">
      <div className="card-header">
        <i className="fas fa-table me-1"></i> 주요 공지사항
      </div>
      <div className="card-body" style={{textAlign:'center'}}>
        <table id="datatablesSimple" style={{ width: '80%'}}>
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>게시일자</th>
            </tr>
          </thead>
          <tbody>
                    {notices.map((notice, index) => (
                        <tr key={index}>
                            <td style={{ width: '60%'}}>
                                {notice.notiStatus === 'I' && <span className="badge badge-danger">중요</span>}
                                <Link to={`/boardDetail/${notice.notiCode}`}>{notice.notiTitle}</Link>
                            </td>
                            <td style={{ width: '20%'}}>{' [' + getDeptTitle(employeeNames[notice.empCode]?.empDept) + ']'}{employeeNames[notice.empCode]?.empName || notice.empCode}</td>
                            <td style={{ width: '20%'}}>{formatDate(notice.notiDate)}</td>
                        </tr>
                    ))}
                </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainTableComponent;
