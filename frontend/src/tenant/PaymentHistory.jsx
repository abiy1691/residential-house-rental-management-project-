import { useQuery } from "@tanstack/react-query"
import { getHistory } from "../api/tenant"
import { FaDropbox } from "react-icons/fa6"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Modal } from "@mui/material"
import { useState } from "react"
import { download } from "../utils/downloadImage"

function PaymentHistory() {
    const [img, setImg] = useState('');
    const [open, setOpen] = useState(false);

    const {data, status} = useQuery({
        queryKey: ['tenant', 'history'],
        queryFn: getHistory
    });

    const {data:url, status: urlStatus} = useQuery({
        enabled: data !== undefined,
        queryKey: ['transaction', img !== ''? img: ''],
        queryFn: () => {
            if(img !== '') 
                return download(img)
            else
                return ''
        }
    });

    if(status === 'pending')
        return (
        <div className="w-full h-full flex justify-center align-center">
            <Loader />
        </div>
    )
    
    if (status === 'error' || data?.length < 1)
        return <div className="w-32 h-32 mx-auto dark:text-gray-300 text-gray-800">
            <FaDropbox className="w-full h-full" />
            <p className="text-center">No payment history!</p>
        </div>

    return (
        <div className="relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 p-4">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Payment Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Payment Deadline
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Transaction Photo
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Months
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Total
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(history => 
                        <tr key={history._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {dayjs(history.date).format('YYYY-MM-DD HH:mm A')}
                            </th>
                            <td className="px-6 py-4">
                                {dayjs(history.deadline).format('YYYY-MM-DD')}
                            </td>
                            <td className="px-6 py-4">
                                {history.status === 'pending'?
                                    <span className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Pending</span>
                                    :history.status === 'failed'?
                                    <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Error</span>
                                    :
                                    <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Success</span>
                                }
                            </td>
                            <td className="px-6 py-4">
                                <button type="button" onClick={()=>{setOpen(true); setImg(history.verification)}} className="inline-flex items-center px-5 py-1.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Show photo</button>
                            </td>
                            <td className="px-6 py-4">
                                {history.month} 
                            </td>
                            <td className="px-6 py-4">
                                {history.month * history.amount}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Link to={'/tenant/payrent'} state={history} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <Modal open={open} className="!z-[10001]" onClose={() => setOpen(false)} >
                <div className="w-[70%] h-full p-8 bg-gray-800 dark:border-gray-200 m-auto">
                    {urlStatus === 'success'?
                        <img src={url} alt="" className="min-w-full max-w-full min-h-full max-h-full"/>
                        :
                        <div className="w-full h-full flex justify-center align-center">
                            <Loader />
                        </div>
                    }
                </div>
            </Modal>
            
        </div>
    )
}

export default PaymentHistory
