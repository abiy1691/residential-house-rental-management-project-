
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';

function DateRange() {
    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                <p className='pb-2'>Choose date range</p>
                <DateRangePicker 
                    className='min-w-[60%] pb-4'
                    value={[
                        searchParams.get('start') ? dayjs(searchParams.get('start')) : null, 
                        searchParams.get('end') ? dayjs(searchParams.get('end')) : null,
                    ]}
                    minDate={dayjs()}
                    onAccept={(value) => setSearchParams(prev => {
                        prev.set('start', value[0].format())
                        prev.set('end', value[1].format())
                        return prev
                    })}
                />
            </div>
        </LocalizationProvider>
    ) 
}

export default DateRange
