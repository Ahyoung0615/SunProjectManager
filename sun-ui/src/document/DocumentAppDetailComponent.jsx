import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ModalComponent from '../commodule/ModalComponent';
import styles from '../css/VacationDocComponent.module.css';

const DocumentAppDetailComponent = () => {
    const navigate = useNavigate();
    const { edocCode, status } = useParams();

    const [sessionEmpCode, setSessionEmpCode] = useState(null);
    const [empInfo, setEmpInfo] = useState({});
    const [currentDate, setCurrentDate] = useState('');
    const [weekdayCount, setWeekdayCount] = useState(null);
    const [selectedApprovers, setSelectedApprovers] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reason, setReason] = useState('');
    const [docTitle, setDocTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [sessionEmp, setSessionEmp] = useState();
    const [docEmpCode, setDocEmpCode] = useState();
    const [signatureImage, setSignatureImage] = useState({});
    const [docType, setDocType] = useState();
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState();
    const [storeInfo, setStoreInfo] = useState();
    const [receiptImage, setReceiptImage] = useState();


    useEffect(() => {
        const today = new Date();
        setCurrentDate(`${today.getFullYear()}년 ${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(today.getDate()).padStart(2, '0')}일`);
    }, []);

    useEffect(() => {
        const sessionStorageInfo = window.sessionStorage.getItem("user");
        console.log("session 정보: ", sessionStorageInfo);
        if (sessionStorageInfo) {
            try {
                const user = JSON.parse(sessionStorageInfo);
                setSessionEmp(user);
                setSessionEmpCode(user.empcode);
            } catch (error) {
                console.error("Failed to parse session storage item 'user':", error);
            }
        } else {
            console.error("No 'user' item found in session storage");
        }
    }, []);

    useEffect(() => {
        if (edocCode) {
            axios.get("http://localhost:8787/api/edoc/docDetail", { params: { edocCode } })
                .then((res) => {
                    console.log(res.data);
                    const tempJsonData = JSON.parse(res.data.edocContent);
                    console.log(tempJsonData);
                    setStartDate(new Date(tempJsonData.startDate));
                    setEndDate(new Date(tempJsonData.endDate));
                    setReason(tempJsonData.reason);
                    setWeekdayCount(tempJsonData.weekdayCount);
                    setDocTitle(res.data.edocTitle);
                    setDocEmpCode(res.data.empCode);
                    setDocType(res.data.edocType);
                    setItems(tempJsonData.items);
                    setTotalPrice(tempJsonData.totalPrice);
                    setStoreInfo(tempJsonData.storeInfo);
                    if (res.data.edocType == 'E') {
                        axios.get("http://localhost:8787/api/edoc/getDocFile", { params: { edocCode } })
                            .then((res) => {
                                setReceiptImage(res.data);
                            }).catch((error) => console.error(error))
                    }
                })
                .catch((error) => console.log(error));

            axios.get("http://localhost:8787/api/edoc/getEDocAppList", { params: { edocCode } })
                .then((res) => {
                    const approvers = res.data;
                    setEmpInfo(res.data[0]);
                    if (sessionEmpCode) {
                        const sessionApprover = approvers.find(a => a.empCode === sessionEmpCode);
                        const filteredApprovers = approvers.filter(a => a.empCode !== sessionEmpCode);

                        axios.get("http://localhost:8787/api/edoc/getEmpSignatures?empCodes=" + filteredApprovers.map(approvers => approvers.empCode)).then((res) => {
                            setSignatureImage(res.data);

                            setSelectedApprovers(sessionApprover ? [sessionApprover, ...filteredApprovers] : filteredApprovers);
                        });
                    } else {
                        setSelectedApprovers(approvers);
                    }
                })
                .catch((error) => console.log(error));
        }
    }, [edocCode, sessionEmpCode]);

    const handleSubmit = () => {
        const data = {
            edocCode: edocCode,
            empCode: sessionEmpCode
        };

        axios.post("http://localhost:8787/api/edoc/appSuccess", data)
            .then(() => navigate('/documentAppList'))
            .catch((error) => console.error("Error:", error));
    };

    const handleReject = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
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

    const jobCodeToText = (jobCode) => {
        const jobNames = {
            1: '대표',
            11: "이사",
            21: "부장",
            31: "차장",
            41: "과장",
            51: "대리",
            61: "주임",
            71: "사원"
        };
        return jobNames[jobCode] || '직급 없음';
    }

    const handleRejectSubmit = () => {
        const data = {
            edocCode: edocCode,
            empCode: sessionEmpCode,
            empName: sessionEmp.empName,
            jobName: jobCodeToText(sessionEmp.jobCode),
            deptName: deptCodeToText(sessionEmp.deptCode),
            reason: rejectReason,
            rejectDate: currentDate,
            weekdayCount: weekdayCount,
            docEmpCode: docEmpCode
        };
        console.log(data);
        axios.post("http://localhost:8787/api/edoc/appReject", data)
            .then(() => {
                closeModal();
                navigate('/documentAppList');
            })
            .catch((error) => console.error("Error:", error));
    };

    const buttonStyle = {
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        width: '120px'
    };

    return (
        <div className={styles.vacationDocContainer}>
            <ModalComponent
                open={showModal}
                close={closeModal}
                title="반려 사유"
                body={
                    <div>
                        <p>반려 사유를 입력해주세요</p>
                        <textarea
                            rows="4"
                            cols="50"
                            placeholder="반려 사유를 입력하세요..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div style={{ marginTop: '10px', textAlign: 'right' }}>
                            <button onClick={handleRejectSubmit} style={{ marginRight: '10px' }}>확인</button>
                        </div>
                    </div>
                }
            />
            {
                docType == 'V' && (
                    <>
                        <h1 className={styles.vacationDocHeader}>휴가 신청서</h1>
                        <form>
                            <table className={styles.vacationDocTable} style={{ width: '40%', marginLeft: 'auto', marginBottom: '10px', textAlign: 'center' }}>
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
                                                {approver.edclStatus === 'S' ? (
                                                    <img
                                                        src={signatureImage[approver.empCode] || "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/005401.png"}
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
                            <h1 className={styles.companyName}>주식회사 썬 컴퍼니&nbsp;&nbsp;&nbsp;직인</h1>
                        </div>
                    </>
                )}
            {
                docType == 'E' && (
                    <>
                        <h1 className={styles.vacationDocHeader}>지출결의서</h1>
                        <form>
                            <table className={styles.vacationDocTable} style={{ width: '40%', marginLeft: 'auto', marginBottom: '10px', textAlign: 'center' }}>
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
                                                {approver.edclStatus === 'S' ? (
                                                    <img
                                                        src={signatureImage[approver.empCode] || "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/005401.png"}
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
                                        <th>사용처</th>
                                        <td>
                                            <span>{storeInfo}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>결제 금액</th>
                                        <td>
                                            <span>{totalPrice}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>세부 결제 내역</th>
                                        <td>
                                            <table>
                                                <tbody>
                                                    {items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td><span>{item.name}</span></td>
                                                            <td><span>{item.price}원</span></td>
                                                            <td><span>{item.count}개</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>사유</th>
                                        <td colSpan="3">
                                            <span>{reason}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>영수증</th>
                                        <td>
                                            <img src={receiptImage} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                        <div className={styles.vacationDocSignatureSection}>
                            <p className={styles.vacationDocSignature}>위와 같이 지출을 신청하오니 허락하여 주시기 바랍니다.</p>

                            <div className={styles.vacationDocDate}>
                                <p className={styles.signature}>{currentDate}</p>
                            </div>

                            <p className={styles.vacationDocSignature}>부서: {empInfo.deptName}</p>
                            <p className={styles.vacationDocSignature}>성명: {empInfo.empName}</p>
                            <h1 className={styles.companyName}>주식회사 썬 컴퍼니&nbsp;&nbsp;&nbsp;직인</h1>
                        </div>
                    </>
                )}
            {
                status == 'A' && (
                    <div
                        className={styles.buttonContainer}
                        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }} >

                        <input
                            type='button'
                            value="반려"
                            onClick={handleReject}
                            className={styles.vacationDocRejectButton}
                            style={{
                                ...buttonStyle,
                                marginRight: '10px',
                                backgroundColor: '#ff4d4f' // 반려 버튼의 배경색
                            }}
                        />

                        <input
                            type='button'
                            value="승인"
                            onClick={handleSubmit}
                            className={styles.vacationDocSubmitButton}
                            style={{
                                ...buttonStyle,
                                marginLeft: '10px',
                                backgroundColor: '#007bff' // 승인 버튼의 배경색 설정
                            }}
                        />
                    </div>
                )
            }
        </div>
    );
};

export default DocumentAppDetailComponent;