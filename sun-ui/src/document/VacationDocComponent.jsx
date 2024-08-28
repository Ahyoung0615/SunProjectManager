import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // datepicker 스타일
import styles from '../css/VacationDocComponent.module.css';
import axios from 'axios';
import OrgChartComponent from '../commodule/OrgChartComponent';
import { useNavigate } from 'react-router-dom';

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

const VacationDocComponent = () => {
    const navigate = useNavigate();

    const [sessionEmpCode, setSessionEmpCode] = useState(null);
    const [empInfo, setEmpInfo] = useState({});
    const [empDeptCodeToText, setEmpDeptCodeToText] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [weekdayCount, setWeekdayCount] = useState(null);
    const [dateError, setDateError] = useState('');
    const [selectedApprovers, setSelectedApprovers] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reason, setReason] = useState('');
    const [docTitle, setDocTitle] = useState('');
    const [dayOffLeft, setDayOffLeft] = useState(null);
    const [remainingDays, setRemainingDays] = useState(null); // 잔여 연차 표시
    const [balanceError, setBalanceError] = useState(''); // 잔여 연차 오류 메시지

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
        if (startDate && endDate) {
            validateDates(startDate, endDate);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if (weekdayCount !== null && dayOffLeft !== null) {
            const remaining = dayOffLeft - weekdayCount;
            setRemainingDays(remaining);
            if (remaining < 0) {
                setBalanceError('잔여 연차가 부족합니다.');
            } else {
                setBalanceError('');
            }
        }
    }, [weekdayCount, dayOffLeft]);

    const employeeInfo = async (empCode) => {
        try {
            const response = await axios.get("http://localhost:8787/api/jpa/edoc/employeeInfo", { params: { empCode } });
            const dayOffData = await axios.get("http://localhost:8787/api/edoc/getDayOff",{ params: { empCode } });
            const empData = response.data;
            const dayOff = dayOffData.data;
            console.log("dayOff:", dayOff);
            setDayOffLeft(dayOff);
            setEmpInfo(empData);
            setEmpDeptCodeToText(deptCodeToText(empData.deptCode));
        } catch (error) {
            console.error("Error fetching employee info:", error);
        }
        
        
    };

    const koreanHolidays = useMemo(() => {
        const year = new Date().getFullYear();
        return [
            new Date(year, 0, 1),   // 신정
            new Date(year, 2, 1),   // 삼일절
            new Date(year, 4, 5),   // 어린이날
            new Date(year, 5, 6),   // 현충일
            new Date(year, 7, 15),  // 광복절
            new Date(year, 9, 3),   // 개천절
            new Date(year, 9, 9),   // 한글날
            new Date(year, 11, 25)  // 성탄절
        ];
    }, []);

    const isHoliday = (date) => {
        return koreanHolidays.some(holiday => holiday.getTime() === date.getTime());
    };

    const calcDate = (start, end) => {
        const date1 = new Date(start);
        const date2 = new Date(end);

        let count = 0;
        let tempDate = new Date(date1);

        while (tempDate <= date2) {
            const day = tempDate.getDay();
            if (day !== 0 && day !== 6 && !isHoliday(tempDate)) {
                count++;
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }

        setWeekdayCount(count);
    };

    const getDayClassName = (date) => {
        const day = date.getDay();
        if (day === 0 || day === 6 || isHoliday(date)) {
            return styles.redDay;
        }
        return '';
    };

    const validateDates = (start, end) => {
        if (adjustDateToLocalStart(start) > adjustDateToLocalEnd(end)) {
            setDateError('종료일이 시작일보다 이전일 수 없습니다.');
            setWeekdayCount(null);
        } else {
            setDateError('');
            calcDate(start, end);
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
        console.log("data",approvers);
        const sortedApprovers = approvers.sort((a, b) => {
            if (a.empCode == sessionEmpCode) return -1;
            if (b.empCode == sessionEmpCode) return 1;
            return 0;
        });
        setSelectedApprovers(sortedApprovers);
    };

    const handleSubmit = () => {
        // 필수 값이 모두 존재하는지 확인
        if (!startDate || !endDate || !reason || !docTitle || !selectedApprovers.length || !weekdayCount || balanceError) {
            alert("필수값을 모두 입력해 주세요");
            return;
        }
        
        const date = new Date();
        const serverSendDate = formatLocalDate(date);

        // JSON 데이터 생성
        const data = {
            startDate: formatLocalDate(adjustDateToLocalStart(startDate)),
            endDate: formatLocalDate(adjustDateToLocalEnd(endDate)),
            reason,
            weekdayCount,
            docType: "V",
            docTitle,
            docStatus: "A",
            uploadDate: serverSendDate,
            empCode: sessionEmpCode,
            approvers: selectedApprovers.map(approver => approver.empCode) // 결재자 목록
        };

        axios.post("http://localhost:8787/api/edoc/insertVacation", data)
            .then((res) => navigate('/documentList'))
            .catch((error) => console.log(error));
    };

    const tempDocWrite = () => {
        if (!startDate || !endDate || !reason || !docTitle || !selectedApprovers.length || !weekdayCount || balanceError) {
            alert("필수값을 모두 입력해 주세요");
            return;
        }

        const date = new Date();
        const tempDocServerSendDate = formatLocalDate(date);

        const data = {
            startDate: formatLocalDate(adjustDateToLocalStart(startDate)),
            endDate: formatLocalDate(adjustDateToLocalEnd(endDate)),
            reason,
            weekdayCount,
            docType: "V",
            docTitle,
            docStatus: "T",
            uploadDate: tempDocServerSendDate,
            empCode: sessionEmpCode,
            approvers: selectedApprovers.map(approver => approver.empCode)
        };

        axios.post("http://localhost:8787/api/edoc/insertTempVacation", data)
            .then(() => navigate('/documentTempList'))
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
                            <th>문서 제목</th>
                            <td><input type='text' onChange={(e) => setDocTitle(e.target.value)}/></td>
                        </tr>
                        <tr>
                            <th>잔여 연차</th>
                            <td>{dayOffLeft}</td>
                        </tr>
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
                                        dayClassName={getDayClassName}
                                    />
                                    <span className={styles.dateSeparator}>~</span>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        className={styles.dateInput}
                                        placeholderText="종료일"
                                        dayClassName={getDayClassName}
                                    />
                                </div>
                                {dateError && <p className={styles.dateError}>{dateError}</p>}
                                {weekdayCount !== null && !dateError && <p>사용일수: {weekdayCount}일</p>}
                                {remainingDays !== null && (
                                    <p className={remainingDays < 0 ? styles.balanceError : ''}>
                                        잔여 연차: {remainingDays}일
                                    </p>
                                )}
                                {balanceError && <p className={styles.balanceError}>{balanceError}</p>}
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
            <div className={styles.buttonContainer}>
                <input type='button' value="임시저장" onClick={tempDocWrite} className={styles.vacationDocSubmitButton} />
                <input type='button' value="기안" onClick={handleSubmit} className={styles.vacationDocSubmitButton} />
            </div>
        </div>
    );
};

export default VacationDocComponent;
