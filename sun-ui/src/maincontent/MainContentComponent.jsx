import React from 'react';
import MainChartComponent from './MainChartComponent';
import MainStickChartComponent from './MainStickChartComponent';
import MainTableComponent from './MainTableComponent';
import MainAlertComponent from './MainAlertComponent';

const MainContentComponent = () => {
  
  return (

      <div>
        <div  className="d-flex" style={{marginLeft:30}}>
            <MainAlertComponent/>
        </div>
      <div className="d-flex" style={{marginLeft:30}}>
        <div className="flex-fill"  style={{marginLeft:-20, marginRight:20}}>
          <MainChartComponent/>
        </div>
        <div className="flex-fill" style={{marginLeft:-50}}>
          <MainStickChartComponent/>
        </div>
      </div>
      <div style={{marginLeft:30}}>
        <MainTableComponent/>
      </div>
    </div>
  );
};

export default MainContentComponent;
