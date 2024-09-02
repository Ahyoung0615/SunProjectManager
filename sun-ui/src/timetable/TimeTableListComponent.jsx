import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalComponent from '../commodule/ModalComponent';

const TimeTableListComponent = () => {
    const apiKey = 'AIzaSyAMJA5opuUkb9_PAOeE2qaGiPPoWz-ryJE';

    const [user, setUser] = useState();
    const [reservationList, setReservationList] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: '' });
    const [formData, setFormData] = useState({
        meetroomCode: '',
        startTime: new Date().toISOString().slice(0, 16), // 현재 시간으로 초기화
        endTime: new Date().toISOString().slice(0, 16)    // 현재 시간으로 초기화
    });
    const [meetroomList, setMeetroomList] = useState([]);

    useEffect(() => {
        const sessionStorage = window.sessionStorage.getItem("user");
        const empInfo = JSON.parse(sessionStorage);
        setUser(empInfo);
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8787/api/mrReservation/getReservationList")
            .then((res) => {
                const formattedEvents = res.data.map((reservation) => ({
                    id: reservation.id,
                    title: reservation.title,
                    start: reservation.start,
                    end: reservation.end,
                    display: 'block',
                    backgroundColor: '#3399ff',
                    borderColor: '#3399ff',
                }));
                setReservationList(formattedEvents);
            });

        axios.get("http://localhost:8787/api/mrReservation/getMeetRoom")
            .then((res) => {
                setMeetroomList(res.data);
            });
    }, []);

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

    function renderEventContent(eventInfo) {
        const eventStyle = {
            color: 'white',
            textAlign: 'center',
            width: '100%',
            display: 'block'
        };
        const startTime = eventInfo.event.start ? eventInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        const endTime = eventInfo.event.end ? eventInfo.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        return (
            <div style={eventStyle}>
                <i>{startTime} ~ {endTime} <br />{eventInfo.event.title}</i>
            </div>
        );
    }

    function handleEventClick(info) {
        const { event } = info;
        axios.get(`http://localhost:8787/api/mrReservation/getReservationDetail?mrrCode=${event.id}`)
            .then((res) => {
                const startTime = formatDate(res.data.start);
                const endTime = res.data.end ? formatDate(res.data.end) : '';
                setModalContent({
                    title: '일정 상세',
                    body: (
                        <div>
                            <p>장소: {res.data.title}</p>
                            <p>예약자: {res.data.deptName} {res.data.empName} {res.data.jobName}</p>
                            <p>일정: {startTime} ~ {endTime}</p>
                            {user.empcode == res.data.empCode && (
                                <div style={{ textAlign: 'right', marginTop: 10 }}>
                                    <input
                                        type='button'
                                        value="삭제"
                                        onClick={() => deleteReservation(res.data.mrrCode)}
                                        style={{
                                            backgroundColor: '#ff4d4d',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }} />
                                </div>
                            )}
                        </div>
                    )
                });
                setShowDetailModal(true);
            })
            .catch(error => {
                console.error("Error fetching reservation details: ", error);
            });
    }

    const closeModal = () => {
        setShowDetailModal(false);
        setShowFormModal(false);
    };

    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minute}`;
    };

    const insertReservation = () => {
        setShowFormModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
        // 종료 시간이 시작 시간보다 이전일 수 없게 설정
        if (name === 'startTime' && new Date(formData.endTime) < new Date(value)) {
            setFormData(prevFormData => ({
                ...prevFormData,
                endTime: value
            }));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const sendInsertData = {
            meetroomCode: formData.meetroomCode,
            empCode: user.empcode,
            mrrStarttime: formatLocalDate(new Date(formData.startTime)),
            mrrEndtime: formatLocalDate(new Date(formData.endTime))
        };
        // 중복 검사
        axios.get("http://localhost:8787/api/mrReservation/getReservationOverlap", {
            params: sendInsertData
        })
            .then((res) => {
                if (res.data === 0) {
                    axios.post("http://localhost:8787/api/mrReservation/insertReservation", sendInsertData)
                        .then(() => {
                            setShowFormModal(false);
                            setReservationList(null);
                            // 리스트 새로 불러오기
                            axios.get("http://localhost:8787/api/mrReservation/getReservationList")
                                .then((res) => {
                                    const formattedEvents = res.data.map((reservation) => ({
                                        id: reservation.id,
                                        title: reservation.title,
                                        start: reservation.start,
                                        end: reservation.end,
                                        display: 'block',
                                        backgroundColor: '#3399ff',
                                        borderColor: '#3399ff',
                                    }));
                                    setReservationList(formattedEvents);
                                });
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                } else {
                    alert("예약 시간에 중복이 발생했습니다.");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const deleteReservation = (mrrCode) => {
        axios.delete(`http://localhost:8787/api/mrReservation/deleteReservation/${mrrCode}`)
            .then((response) => {
                if (response.status == 200) {
                    setShowFormModal(false);
                    setReservationList(null);
                    // 리스트 새로 불러오기
                    axios.get("http://localhost:8787/api/mrReservation/getReservationList")
                        .then((res) => {
                            const formattedEvents = res.data.map((reservation) => ({
                                id: reservation.id,
                                title: reservation.title,
                                start: reservation.start,
                                end: reservation.end,
                                display: 'block',
                                backgroundColor: '#3399ff',
                                borderColor: '#3399ff',
                            }));
                            setReservationList(formattedEvents);
                            setShowDetailModal(false);
                        }).catch((error) => console.error(error));
                }
            }).catch((error) => {
                console.error(error);
            });
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
                        backgroundColor: '#6ABEDC',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
                                color: '#3399ff',
                                textColor: 'white'
                            }
                        ]}
                        height={"70vh"}
                        locale="ko"
                        eventClick={handleEventClick}
                        eventContent={renderEventContent}
                    />
                </div>
            </div>

            {/* 폼 모달 */}
            <ModalComponent
                open={showFormModal}
                close={closeModal}
                title="시설 예약 추가"
                body={
                    <form onSubmit={handleFormSubmit}>
                        <div>
                            <label>
                                회의실 코드:
                                <select
                                    name="meetroomCode"
                                    value={formData.meetroomCode}
                                    onChange={handleFormChange}
                                    required>
                                    <option value="">회의실을 선택하세요</option>
                                    {meetroomList.map(room => (
                                        <option key={room.meetroomCode} value={room.meetroomCode}>
                                            {room.meetroomName}({room.meetroomSize})
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                시작 시간:
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    min={new Date().toISOString().slice(0, 16)} // 과거 날짜 선택 불가
                                    onChange={handleFormChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                종료 시간:
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    min={formData.startTime} // 시작 시간보다 이전 시간 선택 불가
                                    onChange={handleFormChange}
                                    required
                                />
                            </label>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: 10 }}>
                            <input
                                type="submit"
                                value="예약 추가"
                                style={{
                                    backgroundColor: '#3399ff',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </form>
                }
            />

            <ModalComponent
                open={showDetailModal}
                close={closeModal}
                title={modalContent.title}
                body={modalContent.body}
            />
        </div>
    );
};

export default TimeTableListComponent;
