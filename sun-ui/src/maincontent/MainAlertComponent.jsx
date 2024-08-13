import React from 'react';

const MainAlertComponent = () => {
    return (
        <div className="container-fluid px-4">
      <h2 className="mt-4">일일 업무</h2>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">나의 알림</li>
      </ol>
      <div className="row">
        <div className="col-xl-3 col-md-6">
          <div className="card bg-primary text-white mb-4">
            <div className="card-body">전자결재문서</div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <a className="small text-white stretched-link" href="#">신규 3 건</a>
              <div className="small text-white"><i className="fas fa-angle-right"></i></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-warning text-white mb-4">
            <div className="card-body">사내 메일</div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <a className="small text-white stretched-link" href="#">신규 2 건</a>
              <div className="small text-white"><i className="fas fa-angle-right"></i></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-success text-white mb-4">
            <div className="card-body">개인/팀 일정</div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <a className="small text-white stretched-link" href="#"> 14:00-15:00 [201 회의실]</a>
              <div className="small text-white"><i className="fas fa-angle-right"></i></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-danger text-white mb-4">
            <div className="card-body">사내 공지</div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <a className="small text-white stretched-link" href="#">신규 1 건</a>
              <div className="small text-white"><i className="fas fa-angle-right"></i></div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
};

export default MainAlertComponent;