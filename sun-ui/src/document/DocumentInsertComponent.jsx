import React, { useState } from 'react';
import styles from '../css/DocumentInsertComponent.module.css'; // CSS 모듈 임포트
import OrgChartComponent from '../commodule/OrgChartComponent';
import VacationDocComponent from './VacationDocComponent';
import ExpenseApprovalComponent from './ExpenseApprovalComponent';

const DocumentInsertComponent = () => {
    const [selectedDoc, setSelectDoc] = useState('Vacation');

    // 선택된 값에 따라 상태 업데이트
    const handleChange = (event) => {
        setSelectDoc(event.target.value);
    }

    return (
        <div className={styles.documentInsertContainer}>
            <h1 className={styles.documentInsertHeader}>문서 작성</h1>

            <div className={styles.documentControl}>
                <OrgChartComponent mappingUrl="empList" buttonName="결재자" maxSelection="3" />
                <select value={selectedDoc} onChange={handleChange} className={styles.documentSelectBox}>
                    <option value="Vacation">연차</option>
                    <option value="Expense">지출결의서</option>
                </select>
            </div>

            <div className={styles.documentContent}>
                {selectedDoc === 'Vacation' && <VacationDocComponent />}
                {selectedDoc === 'Expense' && <ExpenseApprovalComponent />}
            </div>
        </div>
    );
};

export default DocumentInsertComponent;
