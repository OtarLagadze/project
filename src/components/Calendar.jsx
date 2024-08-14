import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import { ka } from 'date-fns/locale';

registerLocale('ka', ka);

function Calendar({ currDate, setCurrDate }) {
  return (
    <DatePicker
      selected={currDate}
      onChange={(date) => setCurrDate(date)}
      locale="ka"
      showTimeSelect
      inline
      minDate={new Date()}
      timeIntervals={5}
      timeFormat="HH:mm"
      timeCaption="დრო"
      dateFormat="MMMM d, yyyy h:mm aa"
    />
  );
}

export default Calendar;
