import React, { useState } from 'react';
import styles from '../css/DocumentInsertComponent.module.css'; // CSS 모듈 임포트

import VacationDocComponent from './VacationDocComponent';
import ExpenseApprovalComponent from './ExpenseApprovalComponent';

const DocumentInsertComponent = () => {
    const [selectedDoc, setSelectDoc] = useState('Vacation');

    // 선택된 값에 따라 상태 업데이트
    const handleChange = (event) => {
        setSelectDoc(event.target.value);
    };

    return (
        <div className={styles.documentInsertContainer}>
            <div className={styles.documentControl} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <select value={selectedDoc} onChange={handleChange} className={styles.documentSelectBox}>
                    <option value="Expense">지출결의서</option>
                    <option value="Vacation">휴가신청서</option>
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
