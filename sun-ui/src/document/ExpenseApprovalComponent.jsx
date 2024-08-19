import React, { useState, useEffect } from 'react';
import styles from '../css/VacationDocComponent.module.css'; // 기존 VacationDocComponent CSS 재사용
import axios from 'axios';
import ModalComponent from '../commodule/ModalComponent';

const ExpenseApprovalComponent = () => {
    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseDate, setExpenseDate] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [department, setDepartment] = useState('');
    const [expenseItems, setExpenseItems] = useState([{ description: '', amount: '' }]); // 지출 항목을 배열로 관리
    const [currentDate, setCurrentData] = useState('');
    const [sessionEmpCode, setSessionEmpCode] = useState(null);

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
        expenseItems,
    };

    const serverSend = () => {
        axios.post("http://localhost:8090/api/expenseApproval", data)
            .then((res) => console.log(res.data))
            .catch((error) => console.log(error));
    };

    return (
        <div className={styles.vacationDocContainer}>
            <h1 className={styles.vacationDocHeader}>지출결의서</h1>
            <ModalComponent />
            <form>
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
                            <th>작성 일자</th>
                            <td colSpan="3">
                                <input type="date" name="expenseDate" value={expenseDate} 
                                onChange={handleChange(setExpenseDate)}/>
                            </td>
                        </tr>
                        <tr>
                            <th>결제 일자</th>
                            <td colSpan="3">
                                <input type="date" name="paymentDate" value={paymentDate} 
                                onChange={handleChange(setPaymentDate)}/>
                            </td>
                        </tr>
                        <tr>
                            <th>부서 / 담당</th>
                            <td colSpan="3">
                                <input type="text" name="department" value={department}
                                    onChange={handleChange(setDepartment)}/>
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
                <p className={styles.vacationDocSignature}>위 금액을 청구하오니 결제해 주시기 바랍니다.</p>

                <div className={styles.vacationDocDate}>
                    <p className={styles.signature}>{currentDate}</p>
                </div>

                <p className={styles.vacationDocSignature}>소속: </p>
                <p className={styles.vacationDocSignature}>성명: </p>
                <h1 className={styles.companyName}>주식회사 가나다라</h1>
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
