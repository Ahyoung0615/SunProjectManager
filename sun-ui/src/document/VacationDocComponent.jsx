import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // datepicker 스타일
import styles from '../css/VacationDocComponent.module.css';
import axios from 'axios';
import OrgChartComponent from '../commodule/OrgChartComponent';

const VacationDocComponent = () => {
    const [sessionEmpCode, setSessionEmpCode] = useState(null);
    const [empInfo, setEmpInfo] = useState({});
    const [empDeptCodeToText, setEmpDeptCodeToText] = useState('');
    const [currentDate, setCurrentData] = useState('');
    const [weekdayCount, setWeekdayCount] = useState(null);
    const [dateError, setDateError] = useState('');
    const [selectedApprovers, setSelectedApprovers] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reason, setReason] = useState('');

    useEffect(() => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}년 ${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(today.getDate()).padStart(2, '0')}일`;
        setCurrentData(formattedDate);
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
            fetchEmployeeInfo(sessionEmpCode);
        }
    }, [sessionEmpCode]);

    useEffect(() => {
        if (startDate && endDate) {
            validateDates(startDate, endDate);
        }
    }, [startDate, endDate]);

    const fetchEmployeeInfo = async (empCode) => {
        try {
            const response = await axios.get("http://localhost:8787/api/jpa/edoc/employeeInfo", { params: { empCode } });
            const empData = response.data;
            setEmpInfo(empData);
            setEmpDeptCodeToText(deptCodeToText(empData.deptCode));
        } catch (error) {
            console.error("Error fetching employee info:", error);
        }
    };

    const validateDates = (start, end) => {
        if (new Date(start) > new Date(end)) {
            setDateError('종료일이 시작일보다 이전일 수 없습니다.');
            setWeekdayCount(null);
        } else {
            setDateError('');
            calcDate(start, end);
        }
    };

    const calcDate = (start, end) => {
        const date1 = new Date(start);
        const date2 = new Date(end);

        let count = 0;
        let tempDate = new Date(date1);

        while (tempDate <= date2) {
            if (tempDate.getDay() !== 0 && tempDate.getDay() !== 6) {
                count++;
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }

        setWeekdayCount(count);
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
        if (!startDate || !endDate || !reason || !selectedApprovers.length || !weekdayCount) {
            alert("모든 필수 항목을 입력해주세요.");
            return;
        }

        // JSON 데이터 생성
        const data = {
            // toISOString() -> YYYY-MM-DDTHH:MM:SS.sssZ 형태로 형변환
            startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
            endDate: endDate.toISOString().split('T')[0],   // YYYY-MM-DD 형식
            reason,
            weekdayCount,
            docType: "V",
            approvers: selectedApprovers.map(approver => approver.empCode) // 결재자 목록
        };

        axios.post("http://localhost:8787/api/edoc/insertVacation", data)
            .then((res) => console.log(res.data))
            .catch((error) => console.log(error));
    };

    return (
        <div className={styles.vacationDocContainer}>
            <OrgChartComponent
                mappingUrl="empList"
                buttonName="결재자"
                maxSelection="3"
                onSelectionChange={handleApproverSelection}
            />
            <h1 className={styles.vacationDocHeader}>휴가 신청서</h1>

            <form>
                {/* 결재자 테이블 */}
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
                            <th>기간</th>
                            <td colSpan="3">
                                <div className={styles.dateRangeContainer}>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        className={styles.dateInput}
                                        placeholderText="시작일"
                                    />
                                    <span className={styles.dateSeparator}>~</span>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        className={styles.dateInput}
                                        placeholderText="종료일"
                                    />
                                </div>
                                {dateError && <p className={styles.dateError}>{dateError}</p>}
                                {weekdayCount !== null && !dateError && <p>사용일수: {weekdayCount}일</p>}
                            </td>
                        </tr>
                        <tr>
                            <th>사유</th>
                            <td colSpan="3">
                                <input type='text' onChange={(e) => setReason(e.target.value)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>

            <div className={styles.vacationDocSignatureSection}>
                <p className={styles.vacationDocSignature}>위와 같이 휴가를 신청하오니 허락하여 주시기 바랍니다.</p>

                <div className={styles.vacationDocDate}>
                    <p className={styles.signature}>{currentDate}</p>
                </div>

                <p className={styles.vacationDocSignature}>부서: {empDeptCodeToText}</p>
                <p className={styles.vacationDocSignature}>성명: {empInfo.empName}</p>
                <h1 className={styles.companyName}>주식회사 썬 컴퍼니</h1>
            </div>

            <input type='button' value="기안" onClick={handleSubmit} className={styles.vacationDocSubmitButton} />
        </div>
    );
};

export default VacationDocComponent;
