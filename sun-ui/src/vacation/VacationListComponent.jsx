import FullCalendar from '@fullcalendar/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { useNavigate } from 'react-router-dom';

const VacationListComponent = () => {
    const [holidays, setHolidays] = useState([]);
    const [newHoliday, setNewHoliday] = useState({ summary: '', startDate: '', endDate: '' });
    const navigator = useNavigate();

    const apiKey = 'AIzaSyAMJA5opuUkb9_PAOeE2qaGiPPoWz-ryJE';

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await axios.get('http://localhost:8787/api/holidays');
                console.log('Fetched holidays:', response.data);
                setHolidays(response.data);
            } catch (error) {
                console.error("Failed to fetch holidays", error);
            }
        };

        fetchHolidays();
    }, []);

    const handleHolidaySubmit = async () => {
        const newHolidayEvent = {
            id: `holiday-${holidays.length}`,
            summary: newHoliday.summary,
            start: { date: newHoliday.startDate },
            end: { date: newHoliday.endDate },
        };

        setHolidays([...holidays, newHolidayEvent]);

        // 여기서 서버에 새 공휴일을 저장하려면 추가적인 API 호출이 필요합니다.
        // 예시: await axios.post('http://localhost:8787/api/holidays', newHolidayEvent);

        setNewHoliday({ summary: '', startDate: '', endDate: '' });
    };

    const holidayEvents = holidays.map((holiday, index) => {
        const event = {
            id: holiday.id || `holiday-${index}`,
            title: holiday.summary || 'Unnamed Holiday',
            start: holiday.start && holiday.start.date ? holiday.start.date : null,
            end: holiday.end && holiday.end.date ? holiday.end.date : null,
            display: 'background',
            backgroundColor: '#EBA7A8',
            textColor: 'red',
        };

        if (!event.start) {
            console.warn(`Skipping holiday event due to missing start date: ${holiday.summary}`);
            return null;
        }

        console.log('Holiday Event:', event);

        return event;
    }).filter(event => event !== null);

    function renderEventContent(eventInfo) {
        const isTripEvent = eventInfo.event.backgroundColor === '#007bff';
        const eventStyle = {
            color: isTripEvent ? 'white' : 'black',
            textAlign: 'center',
            width: '100%',
            display: 'block'
        };

        return (
            <div style={eventStyle}>
                <i>{eventInfo.event.title}</i>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: 30, maxWidth: '90%', display: 'flex' }}>
            <div style={{ flex: 2, marginRight: '20px' }}>
                <h4>공휴일 관리</h4>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', maxWidth:'70%', backgroundColor: '#C3EFFF' }}>
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
                                    events: holidayEvents
                                }
                            ]}
                            height={"70vh"}
                            locale="ko"
                            eventContent={renderEventContent}
                        />
                    </div>
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <h4>공휴일 일정 입력</h4>
                <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                    <div className="form-group">
                        <label>공휴일 이름</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newHoliday.summary}
                            onChange={(e) => setNewHoliday({ ...newHoliday, summary: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>시작 날짜</label>
                        <input
                            type="date"
                            className="form-control"
                            value={newHoliday.startDate}
                            onChange={(e) => setNewHoliday({ ...newHoliday, startDate: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>종료 날짜</label>
                        <input
                            type="date"
                            className="form-control"
                            value={newHoliday.endDate}
                            onChange={(e) => setNewHoliday({ ...newHoliday, endDate: e.target.value })}
                        />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleHolidaySubmit}>추가</button>
                </div>
            </div>
        </div>
    );
};

export default VacationListComponent;
