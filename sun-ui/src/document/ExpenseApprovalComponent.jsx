import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // datepicker 스타일
import styles from '../css/VacationDocComponent.module.css'; // 스타일 모듈 사용
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

const createDateFromObject = ({ day, month, year }) => {
    return new Date(year, month - 1, day);
};


const adjustDateToLocalStart = (date) => {
    if (!date) return new Date();
    const adjustedDate = new Date(date);
    adjustedDate.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
    return adjustedDate;
};

const ExpenseApprovalComponent = () => {
    const navigate = useNavigate();

    const [sessionEmpCode, setSessionEmpCode] = useState(null);
    const [empInfo, setEmpInfo] = useState({});
    const [empDeptCodeToText, setEmpDeptCodeToText] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [selectedApprovers, setSelectedApprovers] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [reason, setReason] = useState('');
    const [docTitle, setDocTitle] = useState('');
    const [signatureImage, setSignatureImage] = useState();
    const [receiptImage, setReceiptImage] = useState();
    const [receiptImageErrorMessage, setReceiptImageErrorMessage] = useState();
    const [receiptImagePreview, setReceiptImagePreview] = useState();

    const [storeInfo, setStoreInfo] = useState();
    const [totalPrice, setTotalPrice] = useState();

    const [items,setItems] = useState({
        name: [],
        price: [],
        count: []
    });

    const handleItemChange = (index, field, value) => {
        console.log(items);
        const updatedItems = [...items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        };
        setItems(updatedItems);
    };

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

    const employeeInfo = async (empCode) => {
        try {
            const response = await axios.get("http://localhost:8787/api/jpa/edoc/employeeInfo", { params: { empCode } });
            const getEmpSig = await axios.get("http://localhost:8787/api/edoc/getEmpSignatures?empCodes=" + empCode);
            setEmpInfo(response.data);
            setSignatureImage(getEmpSig.data);
            setEmpDeptCodeToText(deptCodeToText(response.data.deptCode));
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

    const getDayClassName = (date) => {
        const day = date.getDay();
        if (day === 0 || day === 6 || isHoliday(date)) {
            return styles.redDay;
        }
        return '';
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
            if (a.empCode === sessionEmpCode) return -1;
            if (b.empCode === sessionEmpCode) return 1;
            return 0;
        });
        setSelectedApprovers(sortedApprovers);
    };

    const handleReceiptFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setReceiptImage(selectedFile);
            setReceiptImageErrorMessage('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptImagePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setReceiptImage(null);
            setReceiptImagePreview('');
            setReceiptImageErrorMessage('이미지 파일만 업로드 해주세요 (jpg, png)');
        }
    };

    const handleReceiptUpload = async () => {
        if (!receiptImage) {
            alert('파일이 없습니다');
            return;
        }
        const formData = new FormData();
        formData.append('receipt', receiptImage);
        try {
            await axios.post('http://localhost:8787/api/clova/setReceipt', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                console.log(res.data.images[0].receipt.result);
                const result = res.data.images[0].receipt.result;
                setStoreInfo(result.storeInfo.name.text);
                
                setStartDate(formatLocalDate(createDateFromObject(result.paymentInfo.date.formatted))); // Date 객체로 설정
    
                console.log(formatLocalDate(createDateFromObject(result.paymentInfo.date.formatted)));
                setTotalPrice(result.totalPrice.price.text);
                if(result.subResults[0] != null){
                    setItems(result.subResults[0].items);
                }
                setReceiptImageErrorMessage('');
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            setReceiptImageErrorMessage('등록에 실패하였습니다');
        }
    };

    const handleSubmit = () => {
        if (!startDate || !reason || !docTitle || !selectedApprovers.length || !items.length) {
            alert("필수값을 모두 입력해 주세요");
            return;
        }
        
        const date = new Date();
        const serverSendDate = formatLocalDate(date);

        // JSON 데이터 생성
        const data = {
            startDate: formatLocalDate(adjustDateToLocalStart(startDate)),
            reason,
            docType: "E",
            docTitle,
            docStatus: "A",
            uploadDate: serverSendDate,
            empCode: sessionEmpCode,
            totalPrice,
            storeInfo,
            approvers: selectedApprovers.map(approver => approver.empCode), // 결재자 목록
            items: items.map(item => ({
                count: item.count.text,
                name: item.name.text,
                price: item.price.price.text
            }))
        };

        console.log(data);

        axios.post("http://localhost:8787/api/edoc/insertExpenseApp", data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log(res.data);
                
                const fileFormData = new FormData();
                fileFormData.append("edocCode", res.data);
                fileFormData.append("receipt", receiptImage);

                axios.post("http://localhost:8787/api/edoc/insertEDocFile", fileFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }})
                .then((res) => navigate('/documentList'))
            })
            .catch((error) => console.log(error));
    };

    const tempDocWrite = () => {
        if (!startDate || !reason || !docTitle || !selectedApprovers.length) {
            alert("필수값을 모두 입력해 주세요");
            return;
        }

        const date = new Date();
        const tempDocServerSendDate = formatLocalDate(date);

        const data = {
            startDate: formatLocalDate(adjustDateToLocalStart(startDate)),
            reason,
            docType: "E",
            docTitle,
            docStatus: "T",
            uploadDate: tempDocServerSendDate,
            empCode: sessionEmpCode,
            totalPrice,
            storeInfo,
            approvers: selectedApprovers.map(approver => approver.empCode), // 결재자 목록
            items: items.map(item => ({
                count: item.count.text,
                name: item.name.text,
                price: item.price.price.text
            }))
        };

        axios.post("http://localhost:8787/api/edoc/insertExpenseApp", data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log(res.data);
                
                const fileFormData = new FormData();
                fileFormData.append("edocCode", res.data);
                fileFormData.append("receipt", receiptImage);

                axios.post("http://localhost:8787/api/edoc/insertEDocFile", fileFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }})
                .then((res) => navigate('/documentList'))
            }) 
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
            <h1 className={styles.vacationDocHeader}>지출 결의서</h1>

            <form>
                <table className={styles.vacationDocTable} 
                    style={{ width: '40%', marginLeft: 'auto', marginBottom: '10px' }}>
                    <thead>
                        <tr>
                            {selectedApprovers.map((approver) => (
                                <th key={approver.empCode} style={{ fontSize: '12px', padding: '5px', textAlign: 'center' }}>
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
                                            src={signatureImage[approver.empCode] || "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/005401.png"}
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
                            <th>사용처</th>
                            <td><input type='text' value={storeInfo} onChange={(e) => setStoreInfo(e.target.value)}/></td>
                        </tr>
                        <tr>
                            <th>지출일</th>
                            <td>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)} // setStartDate 대신 setPaymentDate 사용
                                    dateFormat="yyyy-MM-dd"
                                    className={styles.dateInput}
                                    dayClassName={getDayClassName}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>사유</th>
                            <td colSpan="3">
                                <input type='text' onChange={(e) => setReason(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th>결제 금액</th>
                            <td><input type='text' value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)}/></td>
                        </tr>
                        {items.length > 0 && (
                            <tr>
                                <th>세부 결제내역</th>
                                <td>
                                    <table>
                                        <tbody>
                                            {items.map((item, index) => (
                                                <tr key={index}>
                                                    <td><input type='text' value={item.name.text} onChange={(e) => handleItemChange(index, 'name', { text: e.target.value })}/></td>
                                                    <td>{item.price.price.text}원</td>
                                                    <td>{item.count.text}개</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        )}
                        <tr>
                            <th>영수증</th>
                            <td>
                                <input type='file' accept="image/jpg, image/png" onChange={handleReceiptFileChange}/>
                                <button type='button' className="btn btn-primary" onClick={handleReceiptUpload}>등록</button>
                                {receiptImageErrorMessage && <p style={{ color: 'red' }}>{receiptImageErrorMessage}</p>}
                            </td>
                        </tr>
                        {receiptImagePreview && (
                                <tr>
                                    <td colSpan="2">
                                        <div>
                                            <h5>영수증</h5>
                                            <img
                                                src={receiptImagePreview}
                                                alt="receipt Preview"
                                                style={{ maxWidth: '50%', height: 'auto' }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </form>

            <div className={styles.vacationDocSignatureSection}>
                <p className={styles.vacationDocSignature}>위와 같이 지출을 신청하오니 허락하여 주시기 바랍니다.</p>

                <div className={styles.vacationDocDate}>
                    <p className={styles.signature}>{currentDate}</p>
                </div>

                <p className={styles.vacationDocSignature}>부서: {empDeptCodeToText}</p>
                <p className={styles.vacationDocSignature}>성명: {empInfo.empName}</p>
                <h1 className={styles.companyName}>주식회사 썬 컴퍼니&nbsp;&nbsp;&nbsp;직인</h1>
            </div>
            <div className={styles.buttonContainer}>
                <input type='button' value="임시저장" onClick={tempDocWrite} className={styles.vacationDocSubmitButton} />
                <input type='button' value="기안" onClick={handleSubmit} className={styles.vacationDocSubmitButton} />
            </div>
        </div>
    );
};

export default ExpenseApprovalComponent;
