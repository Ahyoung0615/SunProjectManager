import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/VacationDocComponent.module.css'; // 동일한 스타일 사용

const DocumentDetailComponent = () => {
    const [documentData, setDocumentData] = useState({});
    const [edocContent, setEdocContent] = useState({});
    const { edocCode } = useParams();

    useEffect(() => {
        const fetchDocumentData = async () => {
            try {
                const response = await axios.get('http://localhost:8787/api/jpa/edoc/eDocDetail?eDocCode=' + edocCode);
                const data = response.data;

                setDocumentData(data);

                // edocContent JSON 문자열을 파싱하여 객체로 변환
                if (data.edocContent) {
                    const parsedContent = JSON.parse(data.edocContent);
                    setEdocContent(parsedContent);
                }
            } catch (error) {
                console.error('문서 데이터를 가져오는 중 오류 발생:', error);
            }
        };
        fetchDocumentData();
    }, [edocCode]);

    const renderContent = () => {
        if (documentData.edocType === 'V') {
            return (
                <>
                    <h1 className={styles.vacationDocHeader}>휴가 신청서 상세</h1>
                    <table className={styles.vacationDocTable}>
                        <tbody>
                            <tr>
                                <th>휴가 시작일</th>
                                <td>{edocContent.startDate}</td>
                            </tr>
                            <tr>
                                <th>휴가 종료일</th>
                                <td>{edocContent.endDate}</td>
                            </tr>
                            <tr>
                                <th>사용한 휴가 일수</th>
                                <td>{edocContent.usedDayOff}</td>
                            </tr>
                            <tr>
                                <th>사유</th>
                                <td>{edocContent.reason}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            );
        } else if (documentData.docType === '지출 결의서') {
            return (
                <>
                    <h1 className={styles.vacationDocHeader}>지출결의서</h1>
                    <table className={styles.vacationDocTable} style={{ width: '40%', marginLeft: 'auto', marginBottom: '10px' }}>
                        <thead>
                            <tr>
                                {documentData.approvers && documentData.approvers.map((approver) => (
                                    <th key={approver.empCode} style={{ fontSize: '12px', padding: '5px' }}>
                                        {approver.empName} {approver.jobName}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {documentData.approvers && documentData.approvers.map((approver) => (
                                    <td key={approver.empCode} style={{ textAlign: 'center', padding: '5px' }}>
                                        {approver.signature && (
                                            <img
                                                src={approver.signature}
                                                alt='싸인'
                                                style={{
                                                    width: '80px',
                                                    height: 'auto',
                                                    objectFit: 'contain',
                                                    minHeight: '50px',
                                                    maxHeight: '50px'
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
                                <td colSpan="3">{documentData.expenseTitle}</td>
                            </tr>
                            <tr>
                                <th>결재 일자</th>
                                <td colSpan="3">{documentData.paymentDate}</td>
                            </tr>
                            {documentData.expenseItems && documentData.expenseItems.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <th>지출 항목 {index + 1}</th>
                                        <td>{item.description}</td>
                                        <td>{item.amount}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </>
            );
        }
    };

    return (
        <div className={styles.vacationDocContainer}>
            {renderContent()}
            <div className={styles.vacationDocSignatureSection}>
                <p className={styles.vacationDocSignature}>
                    {documentData.docType === '휴가 신청서' ? '위와 같이 휴가를 신청하오니 허락하여 주시기 바랍니다.' : '위 금액을 청구하오니 결재해 주시기 바랍니다.'}
                </p>
                <div className={styles.vacationDocDate}>
                    <p className={styles.signature}>
                        {new Date(documentData.uploadDate).getFullYear()}년 {new Date(documentData.uploadDate).getMonth() + 1}월 {new Date(documentData.uploadDate).getDate()}일
                    </p>
                </div>
                <p className={styles.vacationDocSignature}>부서: {documentData.deptName}</p>
                <p className={styles.vacationDocSignature}>성명: {documentData.empName}</p>
                <h1 className={styles.companyName}>주식회사 썬 컴퍼니</h1>
            </div>
        </div>
    );
};

export default DocumentDetailComponent;
