import React, { useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import ModalComponent from '../commodule/ModalComponent';

const BTripCalComponent = ({ bTripList }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const apiKey = 'AIzaSyAMJA5opuUkb9_PAOeE2qaGiPPoWz-ryJE';

  // bTripList를 이용해 FullCalendar 이벤트로 변환
  const tripEvents = bTripList.map((trip, index) => ({
    id: trip.btripCode || `trip-${index}`,  // 이벤트의 고유 ID
    title: trip.btripDetail || '출장',       // 이벤트 제목
    start: trip.btripStartDate,              // 시작일
    end: trip.btripEndDate,                  // 종료일
    backgroundColor: '#007bff',              // 바탕색 (여기서 임의로 지정)
    borderColor: '#007bff',                  // 테두리 색
    extendedProps: {
      content: trip.btripDetail,             // 추가 정보
      participant: trip.participant          // 참여자 정보
    }
  }));

  function handleEditModal(clickedEvent) {
    const event = {
      userId: "",
      id: clickedEvent.event.id,
      title: clickedEvent.event.title,
      start: clickedEvent.event.start,
      end: clickedEvent.event.end,
      content: clickedEvent.event.extendedProps.content, 
      participant: clickedEvent.event.extendedProps.participant, 
      backgroundColor: clickedEvent.event.extendedProps.backgroundColor
    };
    setSelectedEvent(event);
    setIsModalOpen(true);
  }
  
  function closeModal() {
    setIsModalOpen(false);
  }

  function renderEventContent(eventInfo) {
    return (
      <div style={{ color: 'black' }}> {/* 여기서 폰트 색깔을 검은색으로 설정 */}
        <i>{eventInfo.event.title}</i>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#C3EFFF'}}>
      <div style={{ width: 1200, marginBottom: 8, backgroundColor: 'white' }}>
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
              color: 'red',   // 공휴일 이벤트의 색상을 빨간색으로 지정
              textColor: 'black', // 공휴일 이벤트 텍스트 색상
              display: 'background' // 배경에 표시
            },
            {
              events: tripEvents // 출장 이벤트 추가
            }
          ]}
          eventClick={handleEditModal}
          height={"70vh"}
          locale="ko"
          eventContent={renderEventContent} // 이벤트 텍스트 스타일 적용
        />
      </div>

      {isModalOpen && (
        <ModalComponent
          isOpen={isModalOpen}  // 여기서 isOpen으로 prop 전달
          onClose={closeModal}  // 여기서 onClose로 prop 전달
          title={selectedEvent ? selectedEvent.title : '타이틀'}
          body={selectedEvent ? selectedEvent.content : 'modalBody'}
          size="xl"
        />
      )}
    </div>
  );
};

export default BTripCalComponent;
