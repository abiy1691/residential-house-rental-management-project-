import dayjs from 'dayjs';
import {HouseCard} from '../components/HouseCard';
import { Modal } from "@mui/material";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { changeStatus, getMaintenance } from '../api/owner';
import { Loader } from '../components/Loader';
import { FaDropbox } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export const OwnerMaintenance = () => {
    const [open, setOpen] = useState(false);
    const [requests, setRequests] = useState(null);

    const {data, status, error} = useQuery({
        queryKey: ['owner', 'maintenance'],
        queryFn: getMaintenance
    })

    const queryClient = useQueryClient();
    
    const {mutate, status: mstatus} = useMutation({
        mutationFn: changeStatus,
        onError: (error) => {
            toast.error(error.response ? error.response.data.message: error.message);
        },
        onSuccess: ({id}) => {
            toast.success('Updated the status');
            queryClient.invalidateQueries({
                queryKey: ['owner', 'maintenance']
            });
            setRequests(
                requests.map((req) => {
                    if (req.request_id === id)
                        req.status = true
                    return req 
                })
            )
        }
    })
    const handleClick = (status, id) => {
        if (status)
            console.log("Delete")
        else
            mutate(id)
    }
    
    if (status === 'pending')
        return (
            <div className="w-full h-full flex justify-center align-center flex-1">
                <Loader />
            </div>
        )

    if (error)
        toast.error(error.response ? error.response.data.message:error.message)

    if (!data || data.length === 0)
        return (
            <div className="w-64 h-64 self-center flex-1">
                <FaDropbox className="w-full h-full" />
                <p className="text-center">No maintenance requests yet</p>
            </div>
        )

    return <div className="grid gap-10 grid-cols-3 w-full flex-1 mx-10 self-start mt-4">
        {data.map(({house, requests}, idx) => 
            <HouseCard {...house} requests={requests} onClick={setOpen} setRequests={setRequests} key={idx}/>
        )}
        

        <Modal open={open} onClose={() => setOpen(false)}>
            <div className="max-w-full p-4 bg-white border border-gray-200 rounded-lg mx-8 my-8 shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Maintenance requests</h5>
                </div>
            <div className="flow-root overflow-scroll max-h-[500px]">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {requests && requests.map(({status, description, createdAt, updatedAt, tenantid, fname, lname, request_id}, idx) =>
                        <li key={idx} className="py-3 sm:py-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <input checked={status} readOnly id="green-checkbox" type="checkbox" value="" className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                </div>
                                <div className="flex-1 min-w-0 ms-4">
                                    <Link to={'/owner/tenant/'+tenantid} className="text-sm font-medium truncate text-gray-900 dark:text-white">
                                        {fname} {lname}
                                    </Link>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {description}    
                                    </p>
                                </div>
                                <div className="inline-flex items-center ml-4 text-base font-semibold text-gray-900 dark:text-white h-full">
                                <div className='flex flex-col justify-between'>
                                    <div>
                                        <p className="text-xs mb-3 text-gray-500 truncate font-medium dark:text-gray-400">
                                            Issued at: {dayjs(createdAt).format("DD/MM/YYYY HH:mm A")}
                                        </p>
                                        <p className="text-xs mt-1 text-gray-500 truncate font-medium dark:text-gray-400">
                                            Updated at: {dayjs(updatedAt).format("DD/MM/YYYY HH:mm A")}
                                        </p>
                                    </div>
                                    {
                                        !status && 
                                        <button onClick={() => handleClick(status, request_id)} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 mt-4 rounded-lg text-sm px-3 py-1.5 inline-flex justify-center w-full text-center">{
                                            mstatus === 'pending'?".....":"Change status"}
                                        </button>
                                    }
                                </div>
                            </div>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
            </div>

        </Modal>
    </div>
}