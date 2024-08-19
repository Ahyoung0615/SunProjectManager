import React from "react";

const RepairListComponent = ({ repairDetail, handleStatusChange }) => {
  return (
    <div style={{ marginTop: 20 }}>
      <h5>수리 내역</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>수리내역번호</th>
            <th>수리내역</th>
            <th>수리일자</th>
            <th>사유</th>
            <th>수리완료여부</th>
          </tr>
        </thead>
        <tbody>
          {repairDetail.length > 0 ? (
            repairDetail.map((repair, index) => (
              <tr key={index}>
                <td>{repair.repairCode}</td>
                <td>{repair.repairDetail}</td>
                <td>{new Date(repair.repairDate).toLocaleDateString()}</td>
                <td>{repair.repairReason}</td>
                <td>
                  {repair.repairStatus !== "O" ? (
                    <select
                      value={repair.repairStatus}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                    >
                      <option value="I">수리중</option>
                      <option value="OS">수리완료</option>
                    </select>
                  ) : (
                    "수리완료"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">수리 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RepairListComponent;
