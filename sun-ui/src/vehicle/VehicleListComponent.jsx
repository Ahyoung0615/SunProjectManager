import React, { useState } from "react";
import { Link } from "react-router-dom";

const VehicleListComponent = () => {

    const [vehiclelist, setVehiclelist] = useState([{
        vehiclecode:'1',
        vehiclenum:'1가1234',
        vehiclemodel:'아반떼',
        vehiclecolor:'W',
        vehicleregdate:'2018.07.14',
        vehicletype:'영업',
        vehiclesize:'4',
        vehiclerepair:'3',
        vehiclestate:'출차'
    }]);

  return (
    <div className="container" style={{ marginTop: 30 }}>
        <br></br>
      <h4>차량 관리 현황</h4>
      
      {/* 차량 등록 버튼 */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button className="btn btn-secondary">차량 등록</button>
      </div>

      {/* 차량 관리 테이블 */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>차량등록번호</th>
            <th>차량번호</th>
            <th>차종</th>
            <th>색상</th>
            <th>등록일</th>
            <th>구분</th>
            <th>용량(인승/t)</th>
            <th>수리내역(건)</th>
            <th>상태현황</th>
          </tr>
        </thead>
        <tbody>
        {vehiclelist.map((item, index) => (
          <tr key={index}>
            <td><Link to={`/vehicleDetail/${item.vehiclecode}`} >{item.vehiclecode}</Link></td>
            <td>{item.vehiclenum}</td>
            <td>{item.vehiclemodel}</td>
            <td>{item.vehiclecolor}</td>
            <td>{item.vehicleregdate}</td>
            <td>{item.vehicletype}</td>
            <td>{item.vehiclesize}</td>
            <td>{item.vehiclerepair}</td>
            <td>{item.vehiclestate}</td>
          </tr>
        ))}
          <tr>
            <td>2</td>
            <td><a href="#">2가1234</a></td>
            <td>투싼</td>
            <td>B</td>
            <td>2018.07.14</td>
            <td>영업</td>
            <td>4인승</td>
            <td><a href="#">1건</a></td>
            <td>보관</td>
          </tr>
          <tr>
            <td>3</td>
            <td><a href="#">3나1234</a></td>
            <td>포터</td>
            <td>W</td>
            <td>2018.07.19</td>
            <td>화물</td>
            <td>1톤</td>
            <td><a href="#">2건</a></td>
            <td>출차</td>
          </tr>
          <tr>
            <td>4</td>
            <td><a href="#">4나1234</a></td>
            <td>포터</td>
            <td>G</td>
            <td>2019.05.27</td>
            <td>화물</td>
            <td>2.5톤</td>
            <td><a href="#">8건</a></td>
            <td>출차</td>
          </tr>
          <tr>
            <td>5</td>
            <td><a href="#">6가1234</a></td>
            <td>쏘나타</td>
            <td>G</td>
            <td>2020.05.29</td>
            <td>영업</td>
            <td>4인승</td>
            <td><a href="#">0건</a></td>
            <td>출차</td>
          </tr>
          <tr>
            <td>6</td>
            <td><a href="#">5나1234</a></td>
            <td>마이티</td>
            <td>G</td>
            <td>2022.06.28</td>
            <td>화물</td>
            <td>2톤</td>
            <td><a href="#">3건</a></td>
            <td>수리</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VehicleListComponent;
