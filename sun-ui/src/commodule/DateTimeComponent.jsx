import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimeComponent = () => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        //showTimeSelect
        //dateFormat="Pp"
        dateFormat="yyyy/MM/dd"
        placeholderText="Select a date"
      />
    </div>
    
  );
};

export default DateTimeComponent;
