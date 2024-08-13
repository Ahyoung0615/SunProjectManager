import React, { useState } from "react";
import FVehicleDetailComponent from "./FVehicleDetailComponent";

const FVehicleListComponent = () => {
  const [isfvehicledetailopen, setIsfvehicledetailopen] = useState(false);
  const [selectedFvehicleCode, setSelectedFvehicleCode] = useState(null);

  const [shipments, setShipments] = useState([{
      fvehiclecode: '1234',
      fname:'구리코일',
      fweight:'1',
      origin: '부산 동래구',
      destination: '서울 금천구',
      departureTime: '14:00',
      expectedArrival: '21:45',
      arrivalTime: '-',
      fvehiclestatus: '운송중'
  }]);

  const handleDetailToggle = (fvehiclecode) => {
    setSelectedFvehicleCode(fvehiclecode);
    setIsfvehicledetailopen(!isfvehicledetailopen);
  };

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <br />
      <h4>화물운송 현황조회</h4>
      <p>운송코드 클릭 시 상세 조회</p>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>운송코드</th>
            <th>화물</th>
            <th>용량(t)</th>
            <th>출발지</th>
            <th>목적지</th>
            <th>출발시각</th>
            <th>예상도착시각</th>
            <th>도착시각</th>
            <th>현황</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((item, index) => (
            <tr key={index}>
              <td style={{color:'blue'}} onClick={() => handleDetailToggle(item.fvehiclecode)}><b>{item.fvehiclecode}</b></td>
              <td>{item.fname}</td>
              <td>{item.fweight}</td>
              <td>{item.origin}</td>
              <td>{item.destination}</td>
              <td>{item.departureTime}</td>
              <td>{item.expectedArrival}</td>
              <td>{item.arrivalTime}</td>
              <td>{item.fvehiclestatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isfvehicledetailopen && selectedFvehicleCode && (
        <div>
          <FVehicleDetailComponent shipment={shipments.find(item => item.fvehiclecode === selectedFvehicleCode)} />
        </div>
      )}
    </div>
  );
};

export default FVehicleListComponent;
