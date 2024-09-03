import React from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { useNavigate } from 'react-router-dom';

const BTripCalComponent = ({ bTripList, holidays }) => {
    const navigator = useNavigate();

    const apiKey = 'AIzaSyAMJA5opuUkb9_PAOeE2qaGiPPoWz-ryJE';

    // bTripList를 이용해 FullCalendar 이벤트로 변환
    const tripEvents = bTripList.map((trip, index) => ({
        id: trip.btripCode || `trip-${index}`,
        title: trip.btripDetail || '출장',
        start: trip.btripStartDate,
        end: trip.btripEndDate,
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        extendedProps: {
            content: trip.btripDetail,
            participant: trip.participant,
            btripCode: trip.btripCode
        }
    }));

    // 공휴일 데이터를 FullCalendar 이벤트로 변환
    const holidayEvents = holidays.map((holiday, index) => {
        const event = {
            id: holiday.id || `holiday-${index}`,
    title: holiday.summary,
    start: new Date(holiday.start.date.value).toISOString().split('T')[0],  // 날짜를 ISO 형식으로 변환
    end: new Date(holiday.end.date.value).toISOString().split('T')[0],      // 날짜를 ISO 형식으로 변환
    display: 'background',
    backgroundColor: '#EBA7A8',
    textColor: 'red',
        };

        // 이벤트 데이터 콘솔에 출력
        console.log('Holiday Event:', event);

        return event;
    });

    // 일정 클릭 시 디테일 화면으로 이동
    const handleDetail = (clickInfo) => {
        const btripCode = clickInfo.event.extendedProps.btripCode;
        if (btripCode) {
            navigator(`/btripDetail/${btripCode}`);
        }
    }

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
                        },
                        {
                            events: tripEvents
                        }
                    ]}
                    eventClick={handleDetail}
                    height={"70vh"}
                    locale="ko"
                    eventContent={renderEventContent}
                />
            </div>
        </div>
    );
};

export default BTripCalComponent;
