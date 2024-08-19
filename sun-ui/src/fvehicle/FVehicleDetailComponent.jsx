import React from "react";

const FVehicleDetailComponent = ({ shipment }) => {
  if (!shipment) {
    return <div>해당 화물의 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
            <br></br>
            <h4>화물 운송 상세 정보</h4>
            <span className="badge badge-success">운송중</span>
            <table className="table table-bordered">
            <thead>
                    <tr>
                        <th>운송코드</th>
                        <th>화물</th>
                        <th>용량(t)</th>
                        <th>출발지</th>
                        <th>도착지</th>
                        <th>운송일자</th>
                        <th>출발시각</th>
                        <th>도착시각</th>
                        <th>현황</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{shipment.fvehiclecode}</td>
                        <td>{shipment.fname}</td>
                        <td>{shipment.fweight}</td>
                        <td>{shipment.origin}</td>
                        <td>{shipment.destination}</td>
                        <td>{shipment.departureTime}</td>
                        <td>{shipment.expectedArrival}</td>
                        <td>{shipment.arrivalTime}</td>
                        <td>{shipment.fvehiclestatus}</td>
                    </tr>
                </tbody>
            </table>
        </div>
  );
};

export default FVehicleDetailComponent;
