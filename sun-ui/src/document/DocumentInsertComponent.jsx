import React, { useState } from 'react';
import OrgChartComponent from '../commodule/OrgChartComponent';


const DocumentInsertComponent = () => {

    // const [selectedDoc, setSelectDoc] = useState('Vacation');

    // // 선택된 값에 따라 상태 업데이트
    // const handleChange = (event) => {
    //     setSelectDoc(event.target.value);
    // }

    return (
        <div>
            {/* DocumentInsertComponent
            <br></br>
            <OrgChartComponent mappingUrl="empList" buttonName="결재자" maxSelection="3"/>

            {/* <select value={selectedDoc} onChange={handleChange}>

                <option value="Vacation">doc1</option>
                <option value="TestDoc">doc2</option>
            </select>

            <div>
                {selectedValue === 'Vacation' && <Vacation />}
                {selectedValue === 'TestDoc' && <TestDoc />}
            </div> */}
        </div>
    );
};

export default DocumentInsertComponent;