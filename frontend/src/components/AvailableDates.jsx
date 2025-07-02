import React, { useEffect, useState } from "react";
import { validateSchedule } from "../utils/validateSchedule";
import TimePickerValue from "./TimePicker";
import dayjs from "dayjs";
import {useMutation, useQueryClient} from '@tanstack/react-query'
import { cerateCallendar } from "../api/owner";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";

const WEEKS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const AvailableDates = ({dates, houseid}) => {

    const {open, schedule} = dates;

    const [myschedule, setMyschedule] = useState([]);
    
    const queryClient = useQueryClient();
    const {mutate, isPending} = useMutation({
        mutationFn: cerateCallendar,
        onSuccess: (data) => {
            toast.success('Successfully updated');
            const prev = queryClient.getQueryData(['owner-house', houseid]);
            queryClient.setQueryData(['owner-house', houseid], {...prev, calendar: {isOpen:true, schedule: data.data.schedule}})
        },
        onError: (error) => {
            toast.error(error.response?error.response.data.message:'Something unexpected happned');
        }
    });

    const [initial, setInitial] = useState(true);
    useEffect(()=> {
        if (initial) {
            const newSchedule = schedule.map((date) => {
                if (!date) { 
                    return {starttime: '', endtime: '', display: false}
                }
                
                return {starttime:dayjs(date.starttime), endtime:dayjs(date.endtime), display: true}
            });
            setMyschedule(newSchedule);
            setInitial(false);
        }
    }, [initial, dates]);

    const onChanged = (idx, date, type) => {
        const d = date.format('HH:mm:ss')
        myschedule[idx] = {...myschedule[idx], [type]:date}
        setMyschedule([...myschedule])
    }
    const onDisplay = (idx, display) => {
        myschedule[idx] = {...myschedule[idx], display:display}
        setMyschedule([...myschedule])
    }

    const applyChanges = () => {
        const error = validateSchedule(myschedule).indexOf(true);

        if (error > -1)
            return toast.error(`${WEEKS[error]}: The difference between the two should atleast be 1 hour`);
        
        let d = myschedule.map((date, idx) => ({...date, idx:idx}));
        d = d.filter((date) => date.display && date.endtime !== '' && date.starttime != '');

        mutate({d, houseid});
    }
    
    return (<div className="flex flex-col">
        {
            myschedule.map((date, idx) => 
                <div key={idx} onClick={()=>{}} className="flex items-center p-3 mx-6 my-2 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <span className="flex-1 ms-3 whitespace-nowrap">{WEEKS[idx]}</span>
                    {date.display ?
                        <TimePickerValue idx={idx} onChanged={onChanged} schedule={myschedule} onDelete={onDisplay} />
                        :
                        <>
                            <span className="mr-1">No schedule available</span>
                            <button type="button" onClick={(e) => onDisplay(idx, true)} className="text-white dark:bg-gray-800 hover:bg-blue-800 focus:ring-4 focus:outline-none ml-2 font-lg rounded-full text-sm p-2 text-center inline-flex items-center me-2 dark:hover:bg-gray-600">
                                <FaPlus />
                            </button>
                        </>
                    }
                </div>
            )
        }
        <button type="button" onClick={applyChanges} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center mt-2 ml-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 self-end">Apply Changes</button> 
    </div>)
}
