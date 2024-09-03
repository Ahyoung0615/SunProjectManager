import FullCalendar from '@fullcalendar/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { useNavigate } from 'react-router-dom';

const VacationListComponent = () => {
    const [holidays, setHolidays] = useState([]);
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

    const handleHoliday = () => {

        
    }


    // 공휴일 데이터를 FullCalendar 이벤트로 변환
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

        // start가 null인 경우 해당 이벤트를 건너뜁니다.
        if (!event.start) {
            console.warn(`Skipping holiday event due to missing start date: ${holiday.summary}`);
            return null; // null을 반환하여 이 이벤트를 무시합니다.
        }

        // 이벤트 데이터 콘솔에 출력
        console.log('Holiday Event:', event);

        return event;
    }).filter(event => event !== null); // null 값을 필터링하여 제외합니다.

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
        <div className="container" style={{ marginTop: 30, maxWidth: '80%' }}>
        <br></br>
        <h4>공휴일 관리</h4>
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
                             events: holidayEvents
                         }
                     ]}
                    height={"70vh"}
                    locale="ko"
                    eventContent={renderEventContent}
                />
            </div>
            <div><button className="btn btn-secondary" onClick={handleHoliday}>일정 입력</button></div>
        </div>
       
        </div>
    );
};
export default VacationListComponent;
