import { useState } from 'react';
import {useSearchParams} from 'react-router-dom';
import { FaAngleUp } from "react-icons/fa6"

const DEFAULT_TYPES = ["Apartment", "Condo", "Duplex", "House", "Mansion", "Penthouse", "Studio", "Villa", "Bedsitter", "Chalet", "Farm House", "Room", "Building"];

export const FilterByType = () => {
    const [searchParams, setSearchParams] = useSearchParams({});
    const [search, setSearch] = useState('');
    const [collapse, setCollapse] = useState(false);
    
    const onChange = (e, type) => {
        if (e.target.checked)
            setSearchParams(prev => {
                prev.append('types', type.toLowerCase())
                return prev
            }, {replace: true})
        else
            setSearchParams(prev => {
                prev.delete('types', type.toLowerCase())
                return prev
            }, {replace: true})
    }

    const filteredTypes = DEFAULT_TYPES.filter(type => type.toLowerCase().includes(search.trim().toLowerCase()));

    
    return (
        <div className={"relative min-w-64 max-w-64 flex my-3  flex-col p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden transition duration-300 " + (collapse ? "max-h-10 min-h-10" : "max-h-80 min-h-80")}>
            <div onClick={() => setCollapse(!collapse)} className={'w-6 absolute top-2 right-2 h-6 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 rounded-full p-1 duration-300 transform ' + (collapse ? "rotate-180" : "")}>
                <FaAngleUp className='w-full h-full'/>
            </div>
            <div className='font-bold mb-3 text-[17px]'>Filter by Type</div>
            
            <div className="flex items-center peer border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 mb-3 dark:border-gray-600">
                <svg className="w-4 h-4 pointer-events-none text-gray-500 dark:text-gray-400 rounded-l-lg m-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
                <input type="text" id="search" onChange={(e) => setSearch(e.target.value)} value={search} className="block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded-r-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search house types"/>
            </div>

            <div className={'p-1 flex-1 overflow-y-scroll scrollable ' + (collapse && 'hidden')}>
                {
                    filteredTypes.map((type) => 
                        <div key={type} className="flex items-center m-1.5">
                            <input checked={searchParams.has('types', type.toLowerCase())} onChange={(e) => onChange(e, type)} id={type} type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 "/>
                            <label htmlFor={type} className="ms-2 font-medium text-gray-900 dark:text-gray-300">{type}</label>
                        </div>
                    )
                }
            </div>

            <div className='flex justify-between'>
                <p onClick={() => setSearchParams(prev => {
                    prev.delete('types')
                    setSearch('')
                    return prev
                }, {replace: true})} className='text-sm underline cursor-pointer hover:text-blue-600 dark:hover:text-blue-400'>Clear All</p>
            </div>
        </div>
            
    )
}