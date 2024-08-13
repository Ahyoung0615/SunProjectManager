import React, { useEffect } from 'react';
import { DataTable } from "simple-datatables";

const MainTableComponent = () => {


    useEffect(() => {
        const datatablesSimple = document.getElementById('datatablesSimple');
        if (datatablesSimple) {
          new DataTable(datatablesSimple, {
            searchable: false,  // 검색 기능 비활성화
            paging: false,      // 페이지네이션 비활성화
            info: false,        // 하단 정보 표시 비활성화
          });
        }
    
        // Clean-up function to remove the data table when the component is unmounted
        return () => {
          if (datatablesSimple && datatablesSimple.simpleDatatables) {
            datatablesSimple.simpleDatatables.destroy();
          }
        };
      }, []);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <i className="fas fa-table me-1"></i> 주요 공지사항
      </div>
      <div className="card-body" style={{textAlign:'center'}}>
        <table id="datatablesSimple">
          <thead>
            <tr>
              <th>공지번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>게시일자</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>System Architect</td>
              <td>Edinburgh</td>
              <td>2011/04/25</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Accountant</td>
              <td>Tokyo</td>
              <td>2011/07/25</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Senior Javascript Developer</td>
              <td>Edinburgh</td>
              <td>2012/03/29</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Senior Javascript Developer</td>
              <td>Edinburgh</td>
              <td>2012/03/29</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Accountant</td>
              <td>Tokyo</td>
              <td>2008/11/28</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainTableComponent;
