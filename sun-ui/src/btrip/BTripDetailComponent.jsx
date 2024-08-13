import React, { useState } from "react";

const BTripDetailComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <h4>출장 상세</h4>
      
      <div style={{ display: "flex" }}>
        {/* 지도 및 주소 정보 */}
        <div style={{ flex: 1, marginRight: 20 }}>
          <div style={{ width: "300px", height: "200px", backgroundColor: "#ccc" }}>
            {/* 지도 컴포넌트 자리 */}
          </div>
          <p>부산광역시 동래구 사직북로28번길 148</p>
        </div>

        {/* 출장 세부 현황 */}
        <div style={{ flex: 2, marginRight: 20 }}>
          <h4>출장 세부 현황</h4>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>출장번호</td>
                <td>1123</td>
                <td>출장목적</td>
                <td>제조 공장 검수</td>
              </tr>
              <tr>
                <td>출장지</td>
                <td>부산제철</td>
                <td>출장기간</td>
                <td>2024.07.17 ~ 2024.07.21</td>
              </tr>
              <tr>
                <td>차량이용여부</td>
                <td>1허1234</td>
                <td>비고</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>

          {/* 여비 상세 구분 */}
          <h4>여비 상세 구분</h4>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>교통비</td>
                <td>-</td>
                <td>유류비</td>
                <td>52,000</td>
              </tr>
              <tr>
                <td>식비</td>
                <td>12,000</td>
                <td>숙박비</td>
                <td>-</td>
              </tr>
              <tr>
                <td>영업비</td>
                <td>-</td>
                <td>기타 경비</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={openModal}>여비 신청</button>
        </div>
      </div>

      {/* 상세 업무 내역 */}
      <div style={{ marginTop: 20 }}>
        <h4>상세 업무 내역</h4>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>참석자 대표</td>
              <td>송품질 대리</td>
              <td>대상자 대표</td>
              <td>임강철 소장</td>
            </tr>
            <tr>
              <td>세부 일정</td>
              <td>14:00 제조 공장 검수</td>
              <td>업체 연락처</td>
              <td>010-1234-1245</td>
            </tr>
            <tr>
              <td>결과 요약</td>
              <td colSpan="3">송품질 대리 외 0명 부산제철 공장 방문하여 제조 공장을 검수하였음</td>
            </tr>
          </tbody>
        </table>
        <button className="btn btn-secondary" onClick={openModal}>상세 수정</button>
      </div>

      {/* 목록 버튼 */}
      <div style={{ marginTop: 20 }}>
        <button className="btn btn-secondary">목록</button>
      </div>

      {/* 모달 컴포넌트 */}
      {isModalOpen && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">결과 요약</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <textarea 
                  className="form-control" 
                  defaultValue="송품질 대리 외 0명 부산제철 공장 방문하여 제조 공장을 검수하였음"
                  rows="4"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>창닫기</button>
                <button type="button" className="btn btn-primary">저장</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BTripDetailComponent;
