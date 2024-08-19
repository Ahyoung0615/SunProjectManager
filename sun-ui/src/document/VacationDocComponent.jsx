import React, { useState, useEffect } from 'react';
import styles from '../css/VacationDocComponent.module.css';
import axios from 'axios';
import ModalComponent from '../commodule/ModalComponent';

const VacationDocComponent = () => {
    const [selectedValue, setSelectedValue] = useState('apple');
    const [e, setE] = useState('');
    const [f, setF] = useState('');
    const [g, setG] = useState('');
    const [sessionEmpCode, setSessionEmpCode] = useState(null);

    const [currentDate, setCurrentData] = useState('');

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const formattedDate = `${year}년 ${month}월 ${day}일`;
        setCurrentData(formattedDate);
    }, []);

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

    const handleChange = (event) => setSelectedValue(event.target.value);
    const eChange = (event) => setE(event.target.value);
    const fChange = (event) => setF(event.target.value);
    const gChange = (event) => setG(event.target.value);

    const data = {
        d: selectedValue,
        e: e,
        f: f
    };

    const serverSend = () => {
        axios.post("http://localhost:8090/api/docTest", data)
            .then((res) => console.log(res.data))
            .catch((error) => console.log(error));
    };

    return (
        <div className={styles.vacationDocContainer}>
            <h1 className={styles.vacationDocHeader}>휴 가 신 청 서</h1>
            <ModalComponent/>
            <form>
                <table className={styles.vacationDocTable}>
                    <thead>
                        <tr>
                            <td>결재자 테스트</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>종류</th>
                            <td colSpan="3">
                                <select name='d' value={selectedValue} onChange={handleChange}>
                                    <option value="apple">연차</option>
                                    <option value="orange">반차</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>사유</th>
                            <td colSpan="3">
                                <input type='text' name='e' value={e} onChange={eChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>기간</th>
                            <td colSpan="3">
                                <input type='date' name='f' value={f} onChange={fChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>비상연락망</th>
                            <td colSpan="3">
                                <input type='text' name='g' value={g} onChange={gChange} />
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

                <p className={styles.vacationDocSignature}>소속: </p>
                <p className={styles.vacationDocSignature}>성명: </p>
                <h1 className={styles.companyName}>주식회사 썬 컴퍼니</h1>
            </div>

            <input type='button' value="기안" onClick={serverSend} className={styles.vacationDocSubmitButton}/>
        </div>
    );
};

export default VacationDocComponent;
