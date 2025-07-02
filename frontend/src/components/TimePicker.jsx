import { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { FaTrash } from 'react-icons/fa6';

export default function TimePickerValue({onChanged, idx, schedule, onDelete}) {
  
  return (
    <div className='flex items-end'>
      <button type="button" onClick={()=>onDelete(idx, false)} className="text-white h-8 dark:bg-gray-800 hover:bg-blue-800 focus:ring-4 focus:outline-none ml-2 font-lg rounded-full text-sm p-2 text-center inline-flex items-center me-2 dark:hover:bg-gray-600">
        <FaTrash />
      </button>
      <div className='flex-0 flex gap-2 bg-white rounded-lg shadow dark:bg-gray-700 p-1.5'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              className='max-w-32 text-sm p-1 text-white'
              label="Start time"
              value={schedule[idx].starttime || null}
              onChange={(newValue) => onChanged(idx, newValue, 'starttime')}
              timeSteps={{minutes: 1}}
              />
            <TimePicker
              className='max-w-32 text-sm p-1'
              label="End time"
              value={schedule[idx].endtime || null}
              minTime={schedule[idx] && schedule[idx].starttime !== '' ? schedule[idx].starttime.add(1, 'hour') : dayjs('2022-04-17T23:59')}
              onChange={(newValue) => onChanged(idx, newValue, 'endtime')}
              timeSteps={{minutes: 1}}
            />
        </LocalizationProvider>

      </div>
    </div>
  );
}
