import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // datepicker 스타일
import styles from '../css/ExpenseApprovalComponent.module.css';
import axios from 'axios';
import OrgChartComponent from '../commodule/OrgChartComponent';
import { useNavigate, useParams } from 'react-router-dom';

// 날짜 포맷 함수
const formatLocalDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 날짜를 로컬 시작 시간으로 조정
const adjustDateToLocalStart = (date) => {
    if (!date) return new Date();
    const adjustedDate = new Date(date);
    adjustedDate.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
    return adjustedDate;
};

// 날짜를 로컬 종료 시간으로 조정
const adjustDateToLocalEnd = (date) => {
    if (!date) return new Date();
    const adjustedDate = new Date(date);
    adjustedDate.setHours(23, 59, 59, 999); // 시간을 23:59:59.999로 설정
    return adjustedDate;
};

const ExpenseApprovalComponent = () => {
    const { edocCode } = useParams();
    const navigate = useNavigate();

    const [sessionEmpCode, setSessionEmpCode] = useState(null);
    const [empInfo, setEmpInfo] = useState({});
    const [empDeptCodeToText, setEmpDeptCodeToText] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [dateError, setDateError] = useState('');
    const [selectedApprovers, setSelectedApprovers] = useState([]);
    const [expenseDate, setExpenseDate] = useState(null);
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [docTitle, setDocTitle] = useState('');
    const [documentData, setDocumentData] = useState({});
    const [isEditMode, setIsEditMode] = useState(true);

    useEffect(() => {
        const today = new Date();
        const formattedDate = formatLocalDate(today);
        setCurrentDate(formattedDate);
    }, []);

    useEffect(() => {
        const sessionStorageInfo = window.sessionStorage.getItem("user");
        if (sessionStorageInfo) {
            try {
                const user = JSON.parse(sessionStorageInfo);
                setSessionEmpCode(user.empcode);
            } catch (error) {
                console.error("Failed to parse session storage item 'user':", error);
            }
        } else {
            console.error("No 'user' item found in session storage");
        }
    }, []);

    useEffect(() => {
        if (sessionEmpCode) {
            employeeInfo(sessionEmpCode);
        }
    }, [sessionEmpCode]);

    useEffect(() => {
        if (edocCode) {
            fetchDocumentData(edocCode);
        }
    }, [edocCode]);

    const fetchDocumentData = async (code) => {
        try {
            const response = await axios.get(`http://localhost:8787/api/document/${code}`);
            setDocumentData(response.data);
            if (response.data.docStatus !== 'A') {
                setIsEditMode(false);
            }
        } catch (error) {
            console.error('문서 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    const employeeInfo = async (empCode) => {
        try {
            const response = await axios.get("http://localhost:8787/api/jpa/edoc/employeeInfo", { params: { empCode } });
            const empData = response.data;
            setEmpInfo(empData);
            setEmpDeptCodeToText(deptCodeToText(empData.deptCode));
        } catch (error) {
            console.error("Error fetching employee info:", error);
        }
    };

    const deptCodeToText = (deptCode) => {
        const deptNames = {
            1: '경영총괄',
            11: '경영지원',
            21: '연구개발',
            31: '고객지원',
            41: '운송관리',
            51: '품질관리',
            61: '자재관리',
            71: '생산제조'
        };
        return deptNames[deptCode] || '부서 없음';
    };

    const handleApproverSelection = (approvers) => {
        const sortedApprovers = approvers.sort((a, b) => {
            if (a.empCode == sessionEmpCode) return -1;
            if (b.empCode == sessionEmpCode) return 1;
            return 0;
        });
        setSelectedApprovers(sortedApprovers);
    };

    const handleSubmit = () => {
        // 필수 값이 모두 존재하는지 확인
        if (!expenseDate || !amount || !reason || !docTitle || !selectedApprovers.length) {
            alert("필수값을 모두 입력해 주세요");
            return;
        }
        
        const date = new Date();
        const localStart = adjustDateToLocalStart(date);
        const localEnd = adjustDateToLocalEnd(date);
        
        const data = {
            expenseDate: formatLocalDate(expenseDate),
            amount,
            reason,
            docTitle,
            selectedApprovers,
            createdDate: localStart,
            updatedDate: localEnd
        };
        
        axios.post('http://localhost:8787/api/document/submit', data)
            .then(() => {
                alert("제출 완료");
                navigate('/document/list');
            })
            .catch(error => {
                console.error('제출 중 오류 발생:', error);
                alert("제출에 실패했습니다.");
            });
    };

    return (
        <div className={styles.expenseContainer}>
            <h1 className={styles.expenseHeader}>지출 결의서</h1>

            <form className={styles.expenseForm}>
                <div className={styles.expenseField}>
                    <label htmlFor="expenseDate" className={styles.expenseLabel}>지출일</label>
                    <DatePicker
                        selected={expenseDate}
                        onChange={(date) => setExpenseDate(date)}
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                        className={styles.expenseDatePicker}
                    />
                    {dateError && <p className={styles.expenseError}>{dateError}</p>}
                </div>
                <div className={styles.expenseField}>
                    <label htmlFor="amount" className={styles.expenseLabel}>금액</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={styles.expenseInput}
                    />
                </div>
                <div className={styles.expenseField}>
                    <label htmlFor="reason" className={styles.expenseLabel}>사유</label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className={styles.expenseTextarea}
                    />
                </div>
                <div className={styles.expenseField}>
                    <label htmlFor="docTitle" className={styles.expenseLabel}>문서 제목</label>
                    <input
                        type="text"
                        id="docTitle"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className={styles.expenseInput}
                    />
                </div>
                <div className={styles.expenseButtonContainer}>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className={styles.expenseSubmitButton}
                        disabled={!isEditMode}
                    >
                        제출
                    </button>
                </div>
            </form>
            <OrgChartComponent onSelectApprovers={handleApproverSelection} />
        </div>
    );
};

export default ExpenseApprovalComponent;
