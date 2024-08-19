import React, { useState } from 'react';
import styles from '../css/DocumentComponent.module.css'; // CSS 모듈 임포트
import axios from 'axios';
import OrgChartComponent from '../commodule/OrgChartComponent';
import ModalComponent from '../commodule/ModalComponent';

const DocumentComponent = () => {
    const [selectedValue, setSelectedValue] = useState('apple');

    const [d, setD] = useState();
    const [e, setE] = useState();
    const [f, setF] = useState();
    const [g, setG] = useState();
    const [sessionEmpCode, setSessionEmpCode] = useState(null);
    const [empInfo, setEmpInfo] = useState([]);

    useEffect(() => {
        // sessionStorage에서 user 정보를 가져오기
        const sessionStorageInfo = window.sessionStorage.getItem("user");

        if (sessionStorageInfo) {
            try {
                // JSON 파싱 후 empCode 추출
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

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const eChange = (event) => {
        setE(event.target.value);
    };

    const fChange = (event) => {
        setF(event.target.value);
    };

    const gChange = (event) => {
        setG(event.target.value);
    };

    const data = {
        d: selectedValue,
        e: e,
        f:f
    };

    const serverSend = () => {
        axios.post("http://localhost:8090/api/docTest", data)
        .then((res) => {
            console.log(res.data);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    return (
        <div className={styles.box}>
            <h1 className={styles.heading}>휴 가 신 청 서</h1>
            <ModalComponent/>
            <form>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th colSpan="4">결 재</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.td}>담당</td>
                            <td className={styles.td}>상무이사</td>
                            <td className={styles.td}>전무이사</td>
                            <td className={styles.td}>사장</td>
                        </tr>
                    </tbody>
                </table>

                <table className={styles.table}>
                    <tbody>
                        {/* 소속, 성명, 직위는 session 가져옴, 사용자 입장에서 보일지 생각 해보기 */}
                        <tr>
                            <th className={styles.th}>종류</th>
                            <td className={styles.td}>
                                <select name='d' id="fruit-select" value={selectedValue} onChange={(handleChange)}>
                                    <option value="apple">연차</option>
                                    <option value="orange">반차</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th className={styles.th}>사유</th>
                            <td className={styles.td}><input type='text' name='e' value={e} onChange={eChange}/></td>
                        </tr>
                        <tr>
                            <th className={styles.th}>기간</th>
                            <td className={styles.td}><input type='date' name='f' value={f} onChange={fChange}/></td>
                        </tr>
                        <tr>
                            <th className={styles.th}>비상연락망</th>
                            <td className={styles.td}><input type='text' name='g' value={g} onChange={gChange}/></td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <p className={styles.signature}>위와 같이 휴가를 신청하오니 허락하여 주시기 바랍니다.</p>

            <p className={styles.signature}>
                <span>년</span>
                <span>월</span>
                <span>일</span>
            </p>

            <p className={styles.signature}>소속: </p>
            <p className={styles.signature}>성명: </p>
            <h1 style={{marginLeft:'30%'}}>주식회사 썬 컴퍼니</h1>
            <input type='button' value="기안" onClick={serverSend} style={{float:'right', borderRadius:'4px'}}/>
        </div>
    );
};

export default DocumentComponent;
