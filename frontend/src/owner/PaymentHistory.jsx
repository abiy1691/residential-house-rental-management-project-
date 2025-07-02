import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FaAngleUp, FaDropbox } from "react-icons/fa6"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import { Loader } from "../components/Loader"
import { Modal } from "@mui/material"
import { useState } from "react"
import { download } from "../utils/downloadImage"
import { paymentActions, paymentHistory } from "../api/owner"
import BasicMenu from "../components/DropDown"
import {toast}  from 'react-toastify'

function PaymentHistory() {
    const [img, setImg] = useState('');
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(new Map());
    const [popup, setPopup] = useState(false);
    const [accept, setAccept] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('');

    const {data, status} = useQuery({
        queryKey: ['owner', 'payment-history'],
        queryFn: paymentHistory
    });

    const qc = useQueryClient()
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

    const {mutate, status:mstatus} = useMutation({
      mutationFn: paymentActions,
      onSuccess: () => {
        toast.success('Paymnet status changed');
        qc.invalidateQueries({queryKey: ['owner', 'payment-history'], exact: true});
      },
      onError: (error) => {
        toast.error(error.response? error.response.data?.message : error.message)
        console.log(error)
      }
    })

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

    const onClick = (houseid, checked) => {
        setCollapsed(prev => {
            prev.set(houseid, checked)
            return new Map(prev)
        })
    }

    const onSubmit = () => {
      const payload = {}
      if (selectedPayment !== '')
        payload.pid = selectedPayment
      else
        return toast.error("Payment not choosen")

      if (selectedHouse !== '')
        payload.hid = selectedHouse
      else
        return toast.error('House not choosen')
      
      payload.accept = accept
      mutate(payload)
    }
console.log(data)
    return (
        <div className="relative flex-1 mr-2 overflow-x-auto min-h-screen shadow-md">
        {data.map(house => 
        <div key={house._id}>
          <input type='checkbox' hidden onChange={(e) => onClick(house._id, e.target.checked)} id={house._id}/> 
          <table className="w-full overflow-x-auto text-sm text-left rtl:text-right my-1 text-gray-500 dark:text-gray-400">
              <caption className="p-5 text-lg font-semibold text-left min-w-full rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                  <div className='flex w-full justify-between'>
                    <Link to={'/owner/'+house._id} className='dark:text-white'>House Number: {house.house.houseno}</Link>
                    <div className='flex gap-4'>
                      <label htmlFor={house._id} className={'w-8 h-8 p-1 hover:dark:bg-gray-500 duration-300 rounded-full cursor-pointer ' + (collapsed.get(house._id) && 'transform rotate-180')}><FaAngleUp className='w-full h-full' /></label>
                    </div>
                  </div>
              </caption>
              <thead hidden={collapsed.get(house._id)} className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 max-h-0">
                <tr>
                  <th scope="col" className="px-6 py-3">
                      Payment Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Payment Deadline
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Months
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Total Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Tenant name
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Tenant Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Verification
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Paid to
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Edit</span>
                   </th>
                </tr>
              </thead>
              <tbody hidden={collapsed.get(house._id)}>
                  {house.payments.map(payment => 
                    <tr key={payment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 whitespace-nowrap">
                        {dayjs(payment.date).format('YYYY-MM-DD HH:mm A')}
                      </th>
                      <th scope="row" className="px-6 py-4 whitespace-nowrap">
                        {dayjs(payment.deadline).format('YYYY-MM-DD')}
                      </th>
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        {payment.month}
                      </td>
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        {payment.month * payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.tenant.firstname} {payment.tenant.lastname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.tenant.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button type="button" onClick={()=>{setOpen(true); setImg(payment.verification)}} className="inline-flex items-center px-5 py-1.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Show photo</button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.status === 'pending'?
                            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Pending</span>
                            :payment.status === 'failed'?
                            <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Failed</span>
                            :
                            <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Success</span>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.paid_to.bankname}: {payment.paid_to.accountnumber}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {payment.status === 'pending' &&
                          <BasicMenu setPopup={setPopup} setAccept={setAccept} house={house._id} setHouse={setSelectedHouse} setPayment={setSelectedPayment} payment={payment.id} />
                        }
                      </td>
                    </tr>
                  )}
              </tbody>
          </table>
        </div>
        )}
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
            
            <Modal open={popup} onClose={() => setPopup(false)}>
              <div className="relative p-4 w-full max-w-md max-h-full flex justify-cener items-center mx-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to {accept?'Accept ': 'Decline '} this payment?</h3>
                <button onClick={onSubmit} data-modal-hide="popup-modal" type="button" className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                    Yes, I'm sure
                </button>
                <button onClick={() => setPopup(false)} data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
            </div>
        </div>
      </div>
            </Modal>    
    </div> 
    )
}

export default PaymentHistory
