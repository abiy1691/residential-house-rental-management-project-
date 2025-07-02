import { useEffect, useState } from 'react';
import {useSearchParams} from 'react-router-dom'

export const FilterByArea = ({signal}) => {
    const [searchParams, setSearchParams] = useSearchParams({});
    const [minsize, setMinsize] = useState(searchParams.get('minsize') || '');
    const [maxsize, setMaxsize] = useState(searchParams.get('maxsize') || '');

    
    useEffect(() => {
        setMaxsize('')
        setMinsize('')
    }, [signal])
    return (
        <div className="min-h-32 min-w-64 max-w-64 flex flex-col my-3 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            <div className='font-bold mb-3 text-[17px]'>Filter by Area</div>
            <div className="flex">
                <div className="relative border">
                    <input type="number" id="small_outlined" onChange={(e) => setMinsize(e.target.value)} value={minsize} className="no-spiner block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label htmlFor="small_outlined" className="absolute pointer-events-none text-[12px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Min area in m<sup>2</sup></label>
                </div>
                <p className="mx-2 self-center">-</p>
                <div className="relative border">
                    <input type="number" id="small_outlined" onChange={(e) => setMaxsize(e.target.value)} value={maxsize} className="no-spiner block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label htmlFor="small_outlined" className="absolute text-[12px] pointer-events-none text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Max area in m<sup>2</sup></label>
                </div>
            </div>

            <div className='flex justify-between mt-4'>
                <p onClick={() => setSearchParams(prev => {
                    prev.delete('minsize')
                    prev.delete('maxsize')
                    setMaxsize('');
                    setMinsize('');
                    return prev
                }, {replace: true})} className='text-sm underline cursor-pointer hover:text-blue-600 dark:hover:text-blue-400'>Clear</p>
                <p onClick={() => setSearchParams(prev => {
                    if (minsize != '')
                        prev.set('minsize', minsize)
                    else
                        prev.delete('minsize')
                    
                    if (maxsize != '')
                        prev.set('maxsize', maxsize)
                    else
                        prev.delete('maxsize')
                    return prev
                })} className='text-sm underline cursor-pointer hover:text-blue-600 dark:hover:text-blue-400'>Search</p>
            </div>
        </div>
            
    )
}