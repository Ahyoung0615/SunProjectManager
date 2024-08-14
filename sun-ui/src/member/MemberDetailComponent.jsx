import React from 'react';

const MemberDetailComponent = () => {
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
        <div style={{ flex: 2 }}>
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

        
        <br></br><br></br><br></br>
      </div>

      
    </div>
    );
};

export default MemberDetailComponent;