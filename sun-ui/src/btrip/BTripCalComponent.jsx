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

    // 일정 클릭 시 디테일 화면으로 이동
    const handleDetail = (clickInfo) => {
        const btripCode = clickInfo.event.extendedProps.btripCode;
        if (btripCode) {
            navigator(`/btripDetail/${btripCode}`);
        }
    }

    function renderEventContent(eventInfo) {
        const eventStyle = {
            color: 'black', // 텍스트 색상
            textAlign: 'center',
            width: '100%',
            height: '100%', // 높이를 전체 셀로 확장
            display: 'flex', // 플렉스 박스를 사용하여 가운데 정렬
            justifyContent: 'center', // 가로 방향 중앙 정렬
            alignItems: 'center', // 세로 방향 중앙 정렬
            backgroundColor: eventInfo.backgroundColor || '#007bff', // 배경색 지정
            borderRadius: '4px', // 테두리 반경을 설정하여 모서리를 둥글게
            padding: '2px' // 텍스트 주위에 여백 추가
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
