import React, { useState } from 'react'
import {useQuery} from '@tanstack/react-query'
import { getHistory } from '../api/owner'
import { FaAngleUp, FaDropbox } from 'react-icons/fa'
import { Loader } from '../components/Loader'
import dayjs from "dayjs";
import { Link, useSearchParams } from 'react-router-dom'

function ShowTenant() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {data, status, isFetching} = useQuery({
    queryKey: ['owner', 'history', searchParams.get('q')],
    queryFn: () => getHistory(searchParams.toString())
  });

  const [collapsed, setCollapsed] = useState(new Map());
  const [search, setSearch] = useState(searchParams.get('q') || '');

  if (status === 'pending')
    return (
        <div className="w-full h-full flex justify-center align-center">
            <Loader />
        </div>
    )
  
  if (!data || data.length === 0)
      return (
          <div className="w-64 h-64 flex-1">
              <FaDropbox className="w-full h-full" />
              <p className="text-center">No tenants found</p>
          </div>
      )

  const onClick = (houseid, checked) => {
    setCollapsed(prev => {
        prev.set(houseid, checked)
        return new Map(prev)
      })
  }

  return (
    <div className="relative flex-1 mr-2 min-h-screen shadow-md">
      <div className='flex justify-between items-center'>
        <div className="flex my-4 w-80 items-center peer border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 mb-3 dark:border-gray-600">
          <svg className="w-8 h-8 p-1 pointer-events-none text-gray-500 dark:text-gray-400 rounded-l-lg m-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
          <input type="text" id="search" value={search} onChange={(e)=>setSearch(e.target.value)} className="block w-full p-2 text-sm text-gray-900 border border-gray-300 bg-gray-50 outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by email, name, phone..."/>
          <button onClick={() => setSearchParams(prev => {prev.set('q', search); return prev})} className='p-1 bg-blue-500 mx-1 text-sm rounded-lg border'>
            {isFetching ? 
              <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
              </svg>:
              "Search"
            }
          </button>
        </div>
        <Link className='py-2 px-4 rounded bg-blue-500 h-content text-white'>Clear</Link>
      </div>
        {data.map(house => 
        <>
          <input key={house._id} type='checkbox' hidden onChange={(e) => onClick(house._id, e.target.checked)} id={house._id}/> 
          <table key={house._id} className="max-w-full w-full text-sm text-left rtl:text-right my-1 text-gray-500 dark:text-gray-400">
              <caption className="p-5 text-lg font-semibold text-left min-w-full rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                  <div className='flex w-full justify-between'>
                    <Link to={'/owner/'+house._id} className='dark:text-white'>House Number: {house.housenumber}</Link>
                    <div className='flex gap-4'>
                      {!house.tenant && <Link to={'/owner/'+house._id+'/create-tenants'} className='text-sm hover:underline'>Add tenant</Link>}
                      <label htmlFor={house._id} className={'w-8 h-8 p-1 hover:dark:bg-gray-500 duration-300 rounded-full cursor-pointer ' + (collapsed.get(house._id) && 'transform rotate-180')}><FaAngleUp className='w-full h-full' /></label>
                    </div>
                  </div>
              </caption>
              <thead hidden={collapsed.get(house._id)} className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 max-h-0">
                <tr>
                  <th scope="col" className="px-6 py-3">
                      Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                      First Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Last Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Phone number
                  </th>
                  <th scope="col" className="px-6 py-3">
                      From
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Upto
                  </th>
                </tr>
              </thead>
              <tbody hidden={collapsed.get(house._id)}>
                  {house.occupancy_history.slice().reverse().map(history => 
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <Link to={'/owner/tenant/'+history.tenant._id} className='text-gray-900 dark:text-white hover:underline'>{history.tenant.email.split(' ')[0]}</Link>
                      </th>
                      <th scope="row" className="px-6 py-4">
                        {history.tenant.firstname}
                      </th>
                      <td className="px-6 py-4 font-medium">
                      {history.tenant.lastname}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {history.tenant.phonenumber.split(' ')[0]}
                      </td>
                      <td className="px-6 py-4">
                        {dayjs(history.from).format('DD-MMM-YYYY')}
                      </td>
                      <td className="px-6 py-4">
                        {history.upto?dayjs(history.upto).format('DD-MMM-YYYY'): 'Current'}
                      </td>
                    </tr>
                  )}
              </tbody>
          </table>
        </>
        )}
    </div>
  )
}

export default ShowTenant