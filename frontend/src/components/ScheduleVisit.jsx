import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createHouseVisitRequest, getHouseVisits } from '../api/house';
import { getUser } from '../api/auth';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

function ScheduleVisit({calendar, id}) {
    const {data, status, error} = useQuery({
        queryKey: ['house', id, 'visits'],
        queryFn: ()=>getHouseVisits(id)
    });

    const {data: user, status:userStatus} = useQuery({
        queryKey: ['user'],
        queryFn: getUser
    });

    const navigate = useNavigate();

    const {mutate, status: mstatus} = useMutation({
        mutationFn: createHouseVisitRequest,
        onSuccess: (data) => {
            toast.success('Successfully booked visit')
        },
        onError: (error) => {
            console.log('error', error)
            toast.error(error.response ? error.response.data.message : error.message)
        },
    })
    
    const [choosenDate, setChoosenDate] = useState(null);
    const [serror, setError] = useState('');
    const [selected, setSelected] = useState('');
    const message = useRef(null);

    const scehdulesToMap = useMemo(() => {
        const map = new Map();
        if (data)
        data.requests.forEach((s) => {
            map[dayjs(s._id).format('YYYY-MM-DD')] = s.requests;
        });
        return map
    }, [data, status]);

    const onClick = (id) => {
        if (selected === id)
            setSelected('')
        else
            setSelected(id)
    }

    const onSubmit = () => {
        if (userStatus === 'error') {
            toast.error('You need to login to book visits')
            navigate('/login', {state: '/houses/'+id});
            return
        }

        if (userStatus === 'success' && message.current && message.current.value !== '')
            mutate({houseid: id, date: choosenDate, message: message.current.value});
        else
            toast.error('Please right a short message')
    }

    useEffect(() => {
        if (data && data.date) {
            setChoosenDate(dayjs(data.date.date))
            if (message.current)
                message.current.value = data.date.message
        }
    }, [data, status]);
    
    console.log(serror, 'serror')
    return <div className='flex justify-between min-h-64'>
        <div className='flex flex-col h-full'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker 
                    shouldDisableDate={(date) => {
                        return !calendar.schedule[(7+date.day() - 1) % 7]
                    }}
                    minDateTime={dayjs()}
                    shouldDisableTime={(time, type) => {
                        if (type === 'hours') {
                            if (!choosenDate)
                                return true

                            const c = calendar.schedule[(7+choosenDate.day() - 1) % 7]
                            let starttime = dayjs(c.starttime)
                            starttime = dayjs().set('hour', starttime.hour())
                            let endtime = dayjs(c.endtime)
                            endtime = dayjs().set('hour', endtime.hour() - (endtime.minute() > 0 ? 0: 1))
                            const now = dayjs().set('hour', time.hour())
                            
                            if (now.isAfter(endtime) || now.isBefore(starttime))
                                return true

                            return false
                        } else if (type === 'minutes') {

                            const c = calendar.schedule[(7+choosenDate.day() - 1) % 7]
                            let starttime = dayjs(c.starttime)
                            starttime = dayjs().set('hour', starttime.hour()).set('minute', starttime.minute())
                            let endtime = dayjs(c.endtime)
                            endtime = dayjs().set('hour', endtime.hour()).set('minute', endtime.minute())
                            const now = dayjs().set('hour', time.hour()).set('minute', time.minute())
                            
                            if (now.isAfter(endtime) || now.isBefore(starttime))
                                return true
                            
                            const s = scehdulesToMap[time.format('YYYY-MM-DD')]
                            if (s) {
                                if (s.filter(({date}) =>  (time.isBefore(dayjs(date).subtract(1, 'hour')) || time.isBefore(dayjs(date).add(1,'hour')))).length > 0)
                                    return true
                            }
                            return false
                        }
                    }}
                    value={choosenDate}
                    onError={setError}
                    onChange={(date, error) => {
                        if (!error.validationError || error.validationError === 'shouldDisableTime-hours') {
                            setChoosenDate(date)
                        }
                    }}
                />
            </LocalizationProvider>
            <textarea rows={2} ref={message} className='my-2 border p-2 rounded-lg' placeholder='Write a short message to the owner'></textarea>
            <button className={`bg-blue-600 ${serror&& 'cursor-not-allowed'}`} onClick={onSubmit} disabled={serror !== null}>Schedule</button>
        </div>
        <div className='ml-2'>
            <div className="w-full max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                {data?.requests.length > 0?"Booked Dates":"No Booked dates yet"}
                </h5>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{data?.requests.length > 0?"The below dates are already booked by other users. So they are disabled on the calendar":"Be the first one to book a visit to this house"}</p>
                <ul className="my-4 space-y-3">
                    {data?.requests.map((dates) => 
                        <li key={dates._id}>
                            <div onClick={() => onClick(dates._id)} className="flex cursor-pointer items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                <span className="flex-1 ms-3 whitespace-nowrap">{dayjs(dates._id).format('MMM DD YYYY')}</span>
                                <span className="inline-flex items-center justify-center px-1 py-0.5 ms-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">{dates.count} requests</span>
                            </div>
                            <div id="dropdown" className={"mt-1 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 " + (selected === dates._id?'':'hidden')}>
                                {dates.requests.map(({date}) =>
                                    <ul className="py-2" aria-labelledby="dropdownButton">
                                        <li>
                                            <div className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">{dayjs(date).format('MMM DD YYYY, HH:mma')}</div>
                                        </li>
                                    </ul>
                                )
                                }
                            </div>
                        </li>
                    )   
                    }
                </ul>
            </div>
        </div>
    </div> 
}

export default ScheduleVisit