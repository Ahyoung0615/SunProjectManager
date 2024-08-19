import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimeComponent = ({ selectedDate, setSelectedDate }) => {
  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy/MM/dd"
        placeholderText="날짜 입력 버튼"
      />
    </div>
  );
};

export default DateTimeComponent;
