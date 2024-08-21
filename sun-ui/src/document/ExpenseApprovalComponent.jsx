import React, { useState, useEffect } from 'react';
import styles from '../css/VacationDocComponent.module.css'; // 기존 VacationDocComponent CSS 재사용
import axios from 'axios';
import OrgChartComponent from '../commodule/OrgChartComponent';

const ExpenseApprovalComponent = () => {
    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseDate, setExpenseDate] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [department, setDepartment] = useState('');
    const [expenseItems, setExpenseItems] = useState([{ description: '', amount: '' }]); // 지출 항목을 배열로 관리
    const [currentDate, setCurrentData] = useState('');
    const [sessionEmpCode, setSessionEmpCode] = useState(null);
    const [empInfo, setEmpInfo] = useState([]);
    const [empDeptCodeToText, setEmpDeptCodeToText] = useState('');
    const [selectedApprovers, setSelectedApprovers] = useState([]);

    useEffect(() => {
        const sessionStorageInfo = window.sessionStorage.getItem("user");
        if (sessionStorageInfo) {
            try {
                const user = JSON.parse(sessionStorageInfo);
                setSessionEmpCode(user.empcode);
                console.log(user.empcode);
            } catch (error) {
                console.error("Failed to parse session storage item 'user':", error);
            }
        } else {
            console.error("No 'user' item found in session storage");
        }
    }, []);

    useEffect(() => {
        const serverEmpInfo = async () => {
            if (sessionEmpCode) {
                try {
                    const response = await axios.get("http://localhost:8787/api/jpa/edoc/employeeInfo", {
                        params: {
                            empCode: sessionEmpCode
                        }
                    });
                    const empData = response.data;
                    setEmpInfo(empData);
                    setEmpDeptCodeToText(deptCodeToText(empData.deptCode)); // 부서 코드를 부서명으로 변환하여 설정
                } catch (error) {
                    console.error("Error fetching employee info:", error);
                }
            }
        };

        serverEmpInfo();
    }, [sessionEmpCode]); // sessionEmpCode가 변경될 때마다 호출

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const formattedDate = `${year}년 ${month}월 ${day}일`;
        setCurrentData(formattedDate);
    }, []);

    const handleChange = (setter) => (event) => setter(event.target.value);

    const handleItemChange = (index, field) => (event) => {
        const updatedItems = [...expenseItems];
        updatedItems[index][field] = event.target.value;
        setExpenseItems(updatedItems);
    };

    const addExpenseItem = () => {
        setExpenseItems([...expenseItems, { description: '', amount: '' }]);
    };

    const removeExpenseItem = (index) => {
        if (expenseItems.length > 1) {
            const updatedItems = expenseItems.filter((_, i) => i !== index);
            setExpenseItems(updatedItems);
        }
    };

    const data = {
        expenseTitle,
        expenseDate,
        paymentDate,
        department,
        expenseItems
    };

    const serverSend = () => {
        axios.post("http://localhost:8090/api/expenseApproval", data)
            .then((res) => console.log(res.data))
            .catch((error) => console.log(error));
    };

    const deptCodeToText = (deptCode) => {
        switch(deptCode) {
            case 1: return '경영총괄';
            case 11: return '경영지원';
            case 21: return '연구개발';
            case 31: return '고객지원';
            case 41: return '운송관리';
            case 51: return '품질관리';
            case 61: return '자재관리';
            case 71: return '생산제조';
            default: return '부서 없음';
        }
    };

    const handleApproverSelection = (approvers) => {
        // sessionEmpCode와 일치하는 사원을 가장 앞으로 이동
        const sortedApprovers = approvers.sort((a, b) => {
            if (a.empCode == sessionEmpCode) return -1;
            if (b.empCode == sessionEmpCode) return 1;
            return 0;
        });
        setSelectedApprovers(sortedApprovers);
        console.log("결재자 데이터: ", sortedApprovers);
    };

    return (
        <div className={styles.vacationDocContainer}>
            <OrgChartComponent mappingUrl="empList" buttonName="결재자" 
            maxSelection="3" onSelectionChange={handleApproverSelection}/>
            <h1 className={styles.vacationDocHeader}>지출결의서</h1>
            <form>
            <table className={styles.vacationDocTable} 
                style={{ width: '40%', marginLeft: 'auto', marginBottom: '10px' }}>
                    <thead>
                        <tr>
                            {selectedApprovers.map((approver) => (
                                <th key={approver.empCode} style={{ fontSize: '12px', padding: '5px' }}>
                                    {approver.empName} {approver.jobName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {selectedApprovers.map((approver) => (
                                <td key={approver.empCode} style={{ textAlign: 'center', padding: '5px' }}>
                                    {approver.empCode == sessionEmpCode ? (
                                        <img 
                                            src='https://data1.pokemonkorea.co.kr/newdata/pokedex/mid/008003.png' 
                                            alt='싸인' 
                                            style={{ 
                                                width: '80px', 
                                                height: 'auto', 
                                                objectFit: 'contain',
                                                minHeight: '50px', // 최소 높이 설정
                                                maxHeight: '50px'  // 최대 높이 설정
                                            }} 
                                        />
                                    ) : (
                                        <div 
                                            style={{ 
                                                width: '80px', 
                                                height: '50px' // 빈 공간을 위한 최소 높이
                                            }} 
                                        />
                                    )}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                <table className={styles.vacationDocTable}>
                    <tbody>
                        <tr>
                            <th>지출 제목</th>
                            <td colSpan="3">
                                <input type="text" name="expenseTitle" value={expenseTitle} 
                                onChange={handleChange(setExpenseTitle)}/>
                            </td>
                        </tr>
                        <tr>
                            <th>결재 일자</th>
                            <td colSpan="3">
                                <input type="date" name="paymentDate" value={paymentDate} 
                                onChange={handleChange(setPaymentDate)}/>
                            </td>
                        </tr>
                        {expenseItems.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <th>지출 항목 {index + 1}</th>
                                    <td>
                                        <input type="text" name={`description-${index}`} placeholder="항목 설명"
                                            value={item.description} onChange={handleItemChange(index, 'description')}/>
                                    </td>
                                    <td>
                                        <input type="text" name={`amount-${index}`} placeholder="금액"
                                            value={item.amount} onChange={handleItemChange(index, 'amount')}/>
                                    </td>
                                    <td>
                                        {/* 조건부 렌더링: 항목이 1개 이상일 때만 삭제 버튼을 표시 */}
                                        {expenseItems.length > 1 && (
                                            <button type="button" onClick={() => removeExpenseItem(index)}>
                                                삭제
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <button type="button" onClick={addExpenseItem} className={styles.addExpenseButton}>
                    지출 항목 추가
                </button>
            </form>

            <div className={styles.vacationDocSignatureSection}>
                <p className={styles.vacationDocSignature}>위 금액을 청구하오니 결재해 주시기 바랍니다.</p>

                <div className={styles.vacationDocDate}>
                    <p className={styles.signature}>{currentDate}</p>
                </div>

                <p className={styles.vacationDocSignature}>부서: {empDeptCodeToText}</p>
                <p className={styles.vacationDocSignature}>성명: {empInfo.empName}</p>
                <h1 className={styles.companyName}>주식회사 썬컴퍼니</h1>
            </div>

            <input
                type="button"
                value="기안"
                onClick={serverSend}
                className={styles.vacationDocSubmitButton}
            />
        </div>
    );
};

export default ExpenseApprovalComponent;
