import React from 'react';
import OrgChartComponent from '../commodule/OrgChartComponent';


const DocumentInsertComponent = () => {

    const [selectedDoc, setSelectDoc] = useState('Vacation');

    // 선택된 값에 따라 상태 업데이트
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    }

    return (
        <div>
            DocumentInsertComponent
            <br></br>
            <OrgChartComponent mappingUrl="empList" buttonName="결재자"/>

            <select value={selectedValue} onChange={handleChange}>
                {/* 문자열 값을 value로 설정 */}
                <option value="Vacation">doc1</option>
                <option value="TestDoc">doc2</option>
            </select>

            <div>
                {/* 선택된 값에 따라 조건부 렌더링 */}
                {selectedValue === 'Vacation' && <Vacation />}
                {selectedValue === 'TestDoc' && <TestDoc />}
            </div>
        </div>
    );
};

export default DocumentInsertComponent;