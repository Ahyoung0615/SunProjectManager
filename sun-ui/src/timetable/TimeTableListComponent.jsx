import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalComponent from '../commodule/ModalComponent';

const TimeTableListComponent = () => {

    const apiKey = 'AIzaSyAMJA5opuUkb9_PAOeE2qaGiPPoWz-ryJE';

    const [reservationList, setReservationList] = useState(null);
    const [show, setShow] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: '' });

    useEffect(() => {
        axios.get("http://localhost:8787/api/mrReservation/getReservationList")
            .then((res) => {
                // API 응답 데이터를 FullCalendar 이벤트 형식으로 변환
                const formattedEvents = res.data.map((reservation) => ({
                    id: reservation.id,  // 고유 ID
                    title: reservation.title || '회의 예약',       // 이벤트 제목
                    start: reservation.start,              // 시작일
                    end: reservation.end,                  // 종료일
                    display: 'block',                        // 블록 형식으로 표시
                    backgroundColor: '#3399ff',              // 바탕색
                    borderColor: '#3399ff',                  // 테두리 색
                }));
                setReservationList(formattedEvents);
            });
    }, []);

    // 서버에서 받은 날짜 및 시간 문자열을 변환하는 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // 이벤트 콘텐츠를 렌더링하는 함수
    function renderEventContent(eventInfo) {
        const eventStyle = {
            color: 'white', // 이벤트 텍스트 색상
            textAlign: 'center',
            width: '100%',
            display: 'block'
        };
        // 날짜 객체를 문자열로 변환하여 렌더링
        const startTime = eventInfo.event.start ? eventInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        const endTime = eventInfo.event.end ? eventInfo.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        return (
            <div style={eventStyle}>
                <i>{startTime} ~ {endTime} <br />{eventInfo.event.title}</i>
            </div>
        );
    }

    // 이벤트 클릭 시 호출
    function handleEventClick(info) {
        const { event } = info;
        const sessionStorage = window.sessionStorage.getItem("user");
        const empInfo = JSON.parse(sessionStorage);
        axios.get(`http://localhost:8787/api/mrReservation/getReservationDetail?mrrCode=${event.id}`)
            .then((res) => {
                const startTime = formatDate(res.data.start); // 서버에서 받은 시작일
                const endTime = res.data.end ? formatDate(res.data.end) : ''; // 서버에서 받은 종료일
                setModalContent({
                    title: '일정 상세',
                    body: (
                        <div>
                            <p>장소: {res.data.title}</p>
                            <p>예약자: {res.data.deptName} {res.data.empName} {res.data.jobName}</p>
                            <p>일정: {startTime} ~ {endTime}</p>
                            {empInfo.empcode == res.data.empCode && (
                                <div style={{ textAlign: 'right', marginTop: 10 }}>
                                    <input
                                        type='button'
                                        value="수정"
                                        onClick={modifyReservation}
                                        style={{
                                            backgroundColor: '#3399ff',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px', // 크기 조정
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '14px' // 텍스트 크기 조정
                                        }} />
                                </div>
                            )}
                        </div>
                    )
                });
                setShow(true);
            })
            .catch(error => {
                console.error("Error fetching reservation details: ", error);
            });
    }


    const closeModal = () => {
        setShow(false);
    };

    // insertReservation
    const insertReservation = () => {

    };

    const modifyReservation = () => {

    };

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <br />
            <h4>시설 예약 현황</h4>
            <div style={{ textAlign: 'right', marginTop: 10 }}>
                <input
                    type='button'
                    value="시설 예약"
                    onClick={insertReservation}
                    style={{
                        backgroundColor: '#6ABEDC', // 버튼 색상
                        border: 'none',
                        padding: '8px 16px', // 버튼 크기
                        borderRadius: '5px', // 버튼 모서리 둥글기
                        cursor: 'pointer',
                        fontSize: '14px', // 버튼 텍스트 크기
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 버튼 그림자 효과
                        marginBottom: 10
                    }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', backgroundColor: '#C3EFFF' }}>
                <div style={{ width: 1200, marginTop: 8, marginBottom: 8, backgroundColor: 'white' }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin, googleCalendarPlugin]}
                        initialView={"dayGridMonth"}
                        googleCalendarApiKey={apiKey}
                        headerToolbar={{
                            start: "prev,next",
                            center: "title",
                            end: "today"
                        }}
                        eventSources={[
                            {
                                googleCalendarId: 'ko.south_korea#holiday@group.v.calendar.google.com',
                                color: '#EBA7A8',
                                textColor: 'red',
                                display: 'block'
                            },
                            {
                                events: reservationList,
                                color: '#3399ff', // 로컬 예약 이벤트의 색상
                                textColor: 'white' // 텍스트 색상
                            }
                        ]}
                        height={"70vh"}
                        locale="ko"
                        eventClick={handleEventClick}
                        eventContent={renderEventContent} // 이벤트 텍스트 스타일 적용
                    />
                </div>
            </div>
            <ModalComponent
                open={show}
                close={closeModal}
                title={modalContent.title}
                body={modalContent.body}
            />
        </div>
    );
};

export default TimeTableListComponent;
