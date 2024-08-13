import React from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarComponent = () => {

    const events = [
        {title: 'Meeting', start: new Date()}
    ]

    return (
        <div style={{ width: 1000, marginBottom: 30 }}>
          <Fullcalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"dayGridMonth"}
            headerToolbar={{
              start: "today prev,next", // will normally be on the left. if RTL, will be on the right
              center: "title",
              end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
            }}
            height={"90vh"}
          />
        </div>
      );
};

export default CalendarComponent;