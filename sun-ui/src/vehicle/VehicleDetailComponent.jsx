import React, { useState } from "react";
import { useParams } from "react-router-dom";

const VehicleDetailComponent = () => {

  const {vehiclecode} = useParams();

  const [isRepairModalOpen, setRepairModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const openRepairModal = () => setRepairModalOpen(true);
  const closeRepairModal = () => setRepairModalOpen(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <h1>차량 상세</h1>
      
      {/* 상태 표시 버튼들 */}
      <div style={{ display: "flex", marginBottom: 20 }}>
      <span class="badge badge-success">출차</span>
      <span class="badge badge-warning">수리</span>
      <span class="badge badge-primary">보관</span>
      </div>

      {/* 이미지와 차량 정보 테이블을 가로로 배치 */}
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
        {/* 차량 이미지 */}
        <div style={{ width: "300px", height: "300px", backgroundColor: "#ccc", marginRight: 20 }}>
          {/* 이미지 영역 */}
        </div>

        {/* 차량 세부 정보 테이블 */}
        <div style={{ flex: 1 }}>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>차량등록번호</td>
                <td>1</td>
              </tr>
              <tr>
                <td>차량번호</td>
                <td>1가1234</td>
              </tr>
              <tr>
                <td>차종</td>
                <td>아반떼</td>
              </tr>
              <tr>
                <td>색상</td>
                <td>W</td>
              </tr>
              <tr>
                <td>등록일</td>
                <td>2018.07.14</td>
              </tr>
              <tr>
                <td>구분</td>
                <td>영업</td>
              </tr>
              <tr>
                <td>용량</td>
                <td>4인승</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 수리 내역 테이블을 아래로 배치 */}
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
            <tr>
              <td>1</td>
              <td>범퍼 교체</td>
              <td>2019.01.05</td>
              <td>추돌사고로 인한 범퍼 파손</td>
              <td>완료</td>
            </tr>
            <tr>
              <td>2</td>
              <td>엔진 교체</td>
              <td>2020.05.04</td>
              <td>엔진 정기 점검</td>
              <td>완료</td>
            </tr>
            <tr>
              <td>3</td>
              <td>사이드 미러 교체</td>
              <td>2022.09.08</td>
              <td>물건 낙하 사고로 인한 사이드 미러 파손</td>
              <td>완료</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
          <button className="btn btn-danger" onClick={() => { /* 삭제 로직 */ }}>삭제</button>
          <button className="btn btn-warning" onClick={openRepairModal}>수리</button>
          <button className="btn btn-info" onClick={openEditModal}>수정</button>
        </div>
        <br></br><br></br><br></br>
      </div>

      {/* 수리 모달 */}
      {isRepairModalOpen && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">수리 내역</h5>
                <button type="button" className="close" onClick={closeRepairModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>차량번호: 1가1234</p>
                <p>수리내역: 범퍼 교체</p>
                <p>수리일자: 2019.01.05</p>
                <p>사유: 추돌사고로 인한 범퍼 파손</p>
                <p>수리완료여부: 완료</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeRepairModal}>취소</button>
                <button type="button" className="btn btn-primary">저장</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">차량 정보 수정</h5>
                <button type="button" className="close" onClick={closeEditModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>차량번호: 1가1234</p>
                <p>차종: 아반떼</p>
                <p>색상: W</p>
                <p>구분: 영업</p>
                <p>용량: 4인승</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>취소</button>
                <button type="button" className="btn btn-primary">저장</button>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetailComponent;
