import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../css/VacationDocComponent.module.css';
import axios from 'axios';
import OrgChartComponent from '../commodule/OrgChartComponent';
import { useNavigate, useParams } from 'react-router-dom';

const DocumentAppDetailComponent = () => {
    const navigate = useNavigate();
    const { edocCode } = useParams();

    const [sessionEmpCode, setSessionEmpCode] = useState(null);
    const [empInfo, setEmpInfo] = useState({});
    const [empDeptCodeToText, setEmpDeptCodeToText] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [weekdayCount, setWeekdayCount] = useState(null);
    const [selectedApprovers, setSelectedApprovers] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reason, setReason] = useState('');
    const [docTitle, setDocTitle] = useState('');
    const [docCode, setDocCode] = useState();
    const [edocStatus, setEdocStatus] = useState('');

    useEffect(() => {
        const today = new Date();
        setCurrentDate(`${today.getFullYear()}년 ${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(today.getDate()).padStart(2, '0')}일`);
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
        console.log(edocCode);
        if (edocCode) {
            axios.get("http://localhost:8787/api/edoc/docDetail", { params: { edocCode } })
                .then((res) => {
                    setEdocStatus(res.data.edocStatus);
                    const tempJsonData = JSON.parse(res.data.edocContent);
                    console.log(res.data.edocContent);
                    setStartDate(new Date(tempJsonData.startDate));
                    setEndDate(new Date(tempJsonData.endDate));
                    setReason(tempJsonData.reason);
                    setDocTitle(res.data.edocTitle);
                    // setIsEditMode(res.data.edocStatus === 'C');
                })
                .catch((error) => console.log(error));

            axios.get("http://localhost:8787/api/edoc/getEDocAppList", { params: { edocCode } })
                .then((res) => {
                    const approvers = res.data;
                    console.log(res.data);
                    setEmpInfo(res.data[0]);
                    if (sessionEmpCode) {
                        // Add session employee info at the start of the approvers list
                        const sessionApprover = approvers.find(a => a.empCode === sessionEmpCode);
                        const filteredApprovers = approvers.filter(a => a.empCode !== sessionEmpCode);
                        setSelectedApprovers(sessionApprover ? [sessionApprover, ...filteredApprovers] : filteredApprovers);
                    } else {
                        setSelectedApprovers(approvers);
                    }
                })
                .catch((error) => console.log(error));
            setDocCode(edocCode);
        }
    }, [edocCode, sessionEmpCode]);

    const handleSubmit = () => {
        const data = {
            edocCode: edocCode,
            empCode: sessionEmpCode
        };

        axios.post("http://localhost:8787/api/edoc/appSuccess", data)
            .then((response) => {
                console.log("Response:", response); // 서버 응답 확인
                navigate('/documentAppList');
            })
            .catch((error) => {
                console.log("Error:", error); // 오류 확인
            });
    };

    const handleReject = () => {
        console.log("반려");
    };

    return (
        <div className={styles.vacationDocContainer}>
            <h1 className={styles.vacationDocHeader}>휴가 신청서</h1>

            <form>
                <table className={styles.vacationDocTable} style={{ width: '40%', marginLeft: 'auto', marginBottom: '10px' }}>
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
                                    {approver.edclStatus == 'S' ? (
                                        <img
                                            src='https://data1.pokemonkorea.co.kr/newdata/pokedex/mid/008003.png'
                                            alt='싸인'
                                            style={{
                                                width: '80px',
                                                height: 'auto',
                                                objectFit: 'contain',
                                                minHeight: '50px',
                                                maxHeight: '50px'
                                            }}
                                        />
                                    ) : (
                                        <div style={{ width: '80px', height: '50px' }} />
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
                            <td>
                                <span>{docTitle}</span>
                            </td>
                        </tr>
                        <tr>
                            <th>기간</th>
                            <td colSpan="3">
                                <span>{startDate ? startDate.toLocaleDateString() : ''} ~ {endDate ? endDate.toLocaleDateString() : ''}</span>
                                <p>사용일수: {weekdayCount}일</p>
                            </td>
                        </tr>
                        <tr>
                            <th>사유</th>
                            <td colSpan="3">
                                <span>{reason}</span>
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

                <p className={styles.vacationDocSignature}>부서: {empInfo.deptName}</p>
                <p className={styles.vacationDocSignature}>성명: {empInfo.empName}</p>
                <h1 className={styles.companyName}>주식회사 썬 컴퍼니</h1>
            </div>

            <div
                className={styles.buttonContainer}
                style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }} >

                {/* 반려 버튼 추가 */}
                <input
                    type='button'
                    value="반려"
                    onClick={handleReject}
                    className={styles.vacationDocRejectButton}
                    style={{
                        marginRight: '10px',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        backgroundColor: '#ff4d4f' // 반려 버튼의 배경색
                    }}
                />

                {/* 승인 버튼 */}
                <input
                    type='button'
                    value="승인"
                    onClick={handleSubmit}
                    className={styles.vacationDocSubmitButton}
                    style={{
                        marginLeft: '10px',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                />
            </div>

        </div>
    );
};

export default DocumentAppDetailComponent;
