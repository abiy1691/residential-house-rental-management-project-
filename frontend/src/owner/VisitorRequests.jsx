import dayjs from 'dayjs';
import {HouseCard} from '../components/HouseCard';
import { Modal } from "@mui/material";
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVisitors } from '../api/owner';
import { Loader } from '../components/Loader';
import { FaDropbox } from 'react-icons/fa6';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DateRangePicker from '../components/DateRangePicker'

export const VisitorRequests = () => {
    const [open, setOpen] = useState(false);
    const [requests, setRequests] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('name')||'')

    const {data, status, error, isFetching} = useQuery({
        queryKey: ['owner', 'visitors', {
            start: searchParams.get('start') || '',
            end: searchParams.get('end') || '',
            name: searchParams.get('name') || ''
        }],
        placeholderData: (data) => data,
        queryFn: () => getVisitors(searchParams.toString()),
    });

    const total = useMemo(() => {
        let t = 0
        if (data)
            t = data.reduce((ans, d) => ans+d.requests.length, 0);
        return t
    }, [status, isFetching]);

    if (status === 'pending')
        return (
            <div className="w-full h-full flex justify-center align-center">
                <Loader />
            </div>
        )

    if (error)
        toast.error(error.response ? error.response.data.message:error.message)

    return (<div className='pt-4 self-start flex-1 rounded min-h-screen'>
        <div className='flex justify-between max-w-full px-2 rounded items-strech dark:bg-gray-700'>
            <DateRangePicker />
            <div>
                <p className='pb-3'>Search by name</p>
                <div className="flex items-center peer border max-h-10 border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 mb-3 dark:border-gray-600">
                    <svg className="w-8 h-8 p-1 pointer-events-none text-gray-500 dark:text-gray-400 rounded-l-lg m-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                    <input type="text" id="search" onChange={e=>setSearch(e.target.value)} value={search} className="block w-full p-2 text-sm text-gray-900 border border-gray-300 bg-gray-50 outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by name"/>
                    <button className='p-1 bg-blue-500 mx-1 text-sm rounded-lg border' onClick={() => {
                        if (search !== '')
                            setSearchParams(prev => {
                                prev.set('name', search)
                                return prev
                            })
                    }}>Search</button>
                </div>
            </div>
        </div>
        <p className='dark:bg-gray-700 p-2 relative'>{isFetching? 
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>:
            <>Total: {total} requests <Link to='' onClick={() => setSearch('')} className='absolute right-2'>Clear all filters</Link></>
    
    }</p>
        {data && data.length !== 0?
        <div className="grid gap-10 grid-cols-3 mx-6 self-start mt-4">

            {data.map(({house, requests}, idx) => 
                <HouseCard {...house} requests={requests} onClick={setOpen} setRequests={setRequests} key={idx} req/>
            )}
            
            
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="max-w-full p-4 bg-white border border-gray-200 rounded-lg mx-8 my-8 shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Visitor requests</h5>
                    </div>
                <div className="flow-root overflow-scroll max-h-[500px]">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                        {requests && requests.map(({visitor, message, fname, lname, date, request_id}, idx) =>
                            <li key={idx} className="py-3 sm:py-4">
                                <div className="flex items-center">
                                    <div className="flex-1 min-w-0 ms-4">
                                        <Link to={'/user/'+visitor} className="text-lg font-medium truncate text-gray-900 dark:text-white">
                                            {fname} {lname}
                                        </Link>
                                        <p className="text text-gray-500 dark:text-gray-400">
                                            {message}    
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center ml-4 text-base font-semibold text-gray-900 dark:text-white h-full">
                                    <div className='flex flex-col justify-between'>
                                        <div>
                                            <p className="text mb-3 text-gray-500 truncate font-medium dark:text-gray-400">
                                                Schedule: {dayjs(date).format("DD/MMM/YYYY HH:mm A")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
                </div>

            </Modal>
        </div>:
            <div className='flex-1 w-full flex justify-center items-center'>
                <div className="w-64 h-64">
                    <FaDropbox className="w-full h-full" />
                    <p className="text-center">No Visitor requests found.</p>
                    <p className="text-center">May be clear queries and <Link to='' onClick={()=> setSearch('')}>try again</Link></p>
                </div>
            </div>
        }
    </div>)
}
