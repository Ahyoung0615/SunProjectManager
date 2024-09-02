import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const MinutesDetailComponent = () => {
    const { minutesCode } = useParams();
    const [minutesDetail, setMinutesDetail] = useState('');
    const [attendees, setAttendees] = useState([]);
    const [employeeName, setEmployeeName] = useState('');
    const [sammary, setSammary] = useState(false);

    const getMinutesDetail = async (minutesCode) => {
        try {
            const request = await axios.get(`http://localhost:8787/api/minutesDetail/${minutesCode}`);
            console.log('회의록상세 : ', request.data);
            setMinutesDetail(request.data);

            // JSON 문자열을 객체로 파싱
            const parsedAttendees = JSON.parse(request.data.minutesAttendees);

            // 객체를 배열 형태로 변환
            const attendeesArray = Object.entries(parsedAttendees);
            setAttendees(attendeesArray);

            // employeeName 설정
            setEmployeeName(parsedAttendees[request.data.empCode]);
        } catch (error) {
            console.error('회의록 상세보기 실패', error);
        }
    }

    useEffect(() => {
        console.log('회의록 코드', minutesCode);
        getMinutesDetail(minutesCode);
    }, [minutesCode]);

    const openSammary = () => {
        setSammary(!sammary);
    }

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h4 style={{ marginTop: 30, display: "inline-flex", alignItems: "center" }}>
                    문서번호 : {minutesDetail.minutesCode} | 회의록 상세
                </h4>
            </div>

            <table className="table table-bordered" style={{ marginBottom: 20, textAlign: "center" }}>
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                        <th style={{ width: "15%" }}>작성자</th>
                        <th style={{ width: "15%" }}>회의장소</th>
                        <th style={{ width: "50%" }}>회의 참여자</th>
                        <th style={{ width: "20%" }}>회의일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{employeeName}</td>
                        <td>{minutesDetail.meetroomCode} 호실</td>
                        <td>
                            <>
                                {attendees.length > 0 ? (
                                    attendees.map(([id, name], index) => (
                                        <div key={id}>
                                            {index + 1}. {name} ({id})
                                        </div>
                                    ))
                                ) : (
                                    <li>참여자 정보 없음</li>
                                )}
                            </>
                        </td>
                        <td>{minutesDetail.minutesDate}</td>
                    </tr>
                </tbody>
            </table>
            <div style={{padding:30, marginTop:-20}}>
            {minutesDetail.minutesSummary !== null &&
                <div>
                    <button onClick={openSammary}>AI 요약 보기 ▼ </button>
                    <br></br> <br></br>
                    {sammary &&
                        minutesDetail.minutesSummary
                    }
                </div>
            }
            </div>
            <table className="table table-bordered" style={{ marginBottom: 20, textAlign: "center" }}>
                <tbody>
                    <tr>
                        <th style={{ width: "30%", textAlign: "center", backgroundColor: "#f2f2f2", verticalAlign: "middle" }}>회의 주제</th>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{minutesDetail.minutesSubject}</td>
                    </tr>
                    <tr>
                        <th style={{ width: "30%", textAlign: "center", backgroundColor: "#f2f2f2", verticalAlign: "middle" }}>회의 내용</th>
                        <td style={{ textAlign: "center", verticalAlign: "middle", lineHeight: "1.6", padding: "20px 10px" }}>
                            {minutesDetail.minutesContent}
                        </td>
                    </tr>
                </tbody>
            </table>
            <br></br>
            <Link to='/meetingSummary'><button className="btn btn-secondary" style={{ marginLeft: 600, marginBottom:50 }}>목록</button></Link>
        </div>
    );
};

export default MinutesDetailComponent;
