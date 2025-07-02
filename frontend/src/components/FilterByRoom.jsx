import { useEffect, useState } from 'react';
import {useSearchParams} from 'react-router-dom';
import { FaAngleUp } from "react-icons/fa6"

const DEFAULT_ROOMS = ["1", "2", "3", "4", "5"];

export const FilterByRoom = ({signal}) => {
    const [searchParams, setSearchParams] = useSearchParams({minrooms: '', maxrooms: ''});
    const [minrooms, setMinrooms] = useState(searchParams.get('minrooms') || '');
    const [maxrooms, setMaxrooms] = useState(searchParams.get('maxrooms') || '');
    const [collapse, setCollapse] = useState(false);
    
    const onChange = (e, room) => {
        if (e.target.checked) {
            setSearchParams(prev => {
                prev.set("minrooms", room)
                prev.set("maxrooms", room)
                return prev
            }, {replace: true})
            setMinrooms(room);
            setMaxrooms(room);
        }
    }

    useEffect(() => {
        setMaxrooms('')
        setMinrooms('')
    }, [signal])

    return (
        <div className={"relative min-w-64 max-w-64 flex flex-col my-3 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden transition duration-300 " + (collapse ? "max-h-10 min-h-10" : "min-h-64")}>
            <div onClick={() => setCollapse(!collapse)} className={'w-6 absolute top-2 right-2 h-6 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 rounded-full p-1 duration-300 transform ' + (collapse ? "rotate-180" : "")}>
                <FaAngleUp className='w-full h-full'/>
            </div>
            <div className='font-bold mb-3 text-[17px]'>Filter by Rooms</div>
            <div className="flex">
                <div className="relative border">
                    <input type="number" id="small_outlined" onChange={(e) => setMinrooms(e.target.value)} value={minrooms} className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label htmlFor="small_outlined" className="absolute pointer-events-none text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Min</label>
                </div>
                <p className="mx-2 self-center">-</p>
                <div className="relative border">
                    <input type="number" id="small_outlined" onChange={(e) => setMaxrooms(e.target.value)} value={maxrooms} className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label htmlFor="small_outlined" className="absolute text-sm pointer-events-none text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Max</label>
                </div>
            </div>

            <div className='p-1 flex-1 overflow-y-scroll'>
                {
                    DEFAULT_ROOMS.map((room) => 
                        <div key={room} className="flex items-center m-1.5">
                            <input checked={searchParams.get("minrooms") === searchParams.get("maxrooms") && searchParams.get("maxrooms") === room} onChange={(e) => onChange(e, room)} id={room} type="radio" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 "/>
                            <label htmlFor={room} className="ms-2 font-medium text-gray-900 dark:text-gray-300">{room} rooms</label>
                        </div>
                    )
                }
            </div>

            <div className='flex justify-between'>
                <p onClick={() => setSearchParams(prev => {
                    prev.delete('minrooms')
                    prev.delete('maxrooms')
                    setMaxrooms('');
                    setMinrooms('');
                    return prev
                }, {replace: true})} className='text-sm underline cursor-pointer hover:text-blue-600 dark:hover:text-blue-400'>Clear</p>
                <p onClick={() => setSearchParams(prev => {
                    if (minrooms != '')
                        prev.set('minrooms', minrooms)
                    else
                        prev.delete('minrooms')
                    
                    if (maxrooms != '')
                        prev.set('maxrooms', maxrooms)
                    else
                        prev.delete('maxrooms')
                    return prev
                })} className='text-sm underline cursor-pointer hover:text-blue-600 dark:hover:text-blue-400'>Search</p>
            </div>
        </div>
            
    )
}