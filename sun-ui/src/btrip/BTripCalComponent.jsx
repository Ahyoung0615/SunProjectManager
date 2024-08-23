import React, { useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { useNavigate } from 'react-router-dom';

const BTripCalComponent = ({ bTripList }) => {
    const navigator = useNavigate();

    const apiKey = 'AIzaSyAMJA5opuUkb9_PAOeE2qaGiPPoWz-ryJE';

    // bTripList를 이용해 FullCalendar 이벤트로 변환
    const tripEvents = bTripList.map((trip, index) => ({
        id: trip.btripCode || `trip-${index}`,  // 이벤트의 고유 ID
        title: trip.btripDetail || '출장',       // 이벤트 제목
        start: trip.btripStartDate,              // 시작일
        end: trip.btripEndDate,                  // 종료일
        display: 'block',                        // 블록 형식으로 표시
        backgroundColor: '#007bff',              // 바탕색 (여기서 임의로 지정)
        borderColor: '#007bff',                  // 테두리 색
        extendedProps: {
            content: trip.btripDetail,             // 추가 정보
            participant: trip.participant,         // 참여자 정보
            btripCode: trip.btripCode              // 출장 코드 추가
        }
    }));

    // 일정 클릭 시 디테일 화면으로 이동
    const handleDetail = (clickInfo) => {
        const btripCode = clickInfo.event.extendedProps.btripCode;
        navigator(`/btripDetail/${btripCode}`);
    }

    function renderEventContent(eventInfo) {
        const isTripEvent = eventInfo.event.display === 'block';
        const eventStyle = {
            color: isTripEvent ? 'white' : 'black',
            textAlign: 'center', // 중앙 정렬
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', backgroundColor: '#C3EFFF'}}>
            <div style={{ width: 1200, marginTop:8, marginBottom: 8, backgroundColor: 'white' }}>
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
                            color: '#EBA7A8',   // 공휴일 이벤트의 색상을 빨간색으로 지정
                            textColor: 'red', // 공휴일 이벤트 텍스트 색상
                            display: 'background' // 배경에 표시
                        },
                        {
                            events: tripEvents // 출장 이벤트 추가
                        }
                    ]}
                    eventClick={handleDetail} // 클릭 시 디테일 화면으로 이동
                    height={"70vh"}
                    locale="ko"
                    eventContent={renderEventContent} // 이벤트 텍스트 스타일 적용
                />
            </div>
        </div>
    );
};

export default BTripCalComponent;
