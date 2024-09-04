import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import  googleCalendarPlugin  from '@fullcalendar/google-calendar';

const VacationListComponent = () => {
    const [holidays, setHolidays] = useState([]);
    const [newHoliday, setNewHoliday] = useState({ summary: '', startDate: '' });
    const [insertNewDay, setInsertNewDay] = useState(false);

    const navigate = useNavigate();

    const apiKey = 'YOUR_GOOGLE_CALENDAR_API_KEY_HERE'; // 여기에 Google Calendar API 키를 입력하세요.

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
    }, [insertNewDay]);

    const handleHolidaySubmit = async () => {
        console.log(typeof newHoliday.startDate);
        const startDateString = new Date(newHoliday.startDate).toISOString().split('T')[0];
        const newHolidayEvent = {
            name: newHoliday.summary,
            startDate: { date: startDateString },
            endDate: { date: startDateString }
        };
        // 새 공휴일 이벤트 추가
        setHolidays([...holidays, newHolidayEvent]);

        try {
            const response = await axios.post('http://localhost:8787/api/insertholiday', newHolidayEvent);
            if (response.status === 200) {
                console.log('공휴일 입력 완료');
                setInsertNewDay(!insertNewDay);
            }
        } catch (error) {
            console.error('공휴일 입력 실패', error);
        }

        setNewHoliday({ summary: '', startDate: '' });
    };

    const holidayEvents = holidays.map((holiday, index) => {
        const event = {
            id: holiday.id || `holiday-${index}`,
            title: holiday.summary || 'Unnamed Holiday',
            // start 및 end 속성이 존재하는지 확인 후 처리
            start: holiday.start && holiday.start.date ? new Date(holiday.start.date.value).toISOString().split('T')[0] : null,
            end: holiday.end && holiday.end.date ? new Date(holiday.end.date.value).toISOString().split('T')[0] : null,
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
        const eventStyle = {
            color: eventInfo.event.textColor || 'black',
            textAlign: 'center',
            width: '100%',
            display: 'block',
            position: 'relative',
            top: '60%',
            transform: 'translateY(-50%)'
        };

        return (
            <div style={eventStyle}>
                <i>{eventInfo.event.title}</i>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: 30, maxWidth: '90%', display: 'flex' }}>
            <div style={{ flex: 2, maxWidth: '70%', marginRight: 20 }}>
                <h4>공휴일 관리</h4>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', backgroundColor: '#C3EFFF' }}>
                    <div style={{ width: '100%', marginTop: 8, marginBottom: 8, backgroundColor: 'white' }}>
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin, googleCalendarPlugin]}
                            initialView="dayGridMonth"
                            googleCalendarApiKey={apiKey}
                            headerToolbar={{
                                start: "prev,next",
                                center: "title",
                                end: "today"
                            }}
                            events={holidayEvents}
                            height="70vh"
                            locale="ko"
                            eventContent={renderEventContent}
                        />
                    </div>
                </div>
            </div>

            {/* 공휴일 입력 폼 */}
            <div style={{ flex: 1, marginTop: 130 }}>
                <h5>공휴일 일정 입력</h5>
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
                        <label>날짜 선택</label>
                        <input
                            type="date"
                            className="form-control"
                            value={newHoliday.startDate}
                            onChange={(e) => setNewHoliday({ ...newHoliday, startDate: e.target.value })}
                        />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleHolidaySubmit}>추가</button>
                </div>
            </div>
        </div>
    );
};

export default VacationListComponent;
