import {useSearchParams} from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa6';
import { Modal } from '@mui/material';
import { useEffect, useState } from 'react';

export const FilterByLocation = ({signal}) => {
    const [searchParams, setSearchParams] = useSearchParams({});
    const [city, setCity] = useState(searchParams.get('city'));
    const [sub_city, setSubCity] = useState(searchParams.get('sub_city'));
    const [woreda, setWoreda] = useState(searchParams.get('woreda'));
    const [kebele, setkebele] = useState(searchParams.get('kebele'));
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setCity('')
        setSubCity('')
        setWoreda('')
        setkebele('')
    }, [signal])

    const none = searchParams.get('city') || searchParams.get('sub_city') || searchParams.get('woreda') || searchParams.get('kebele')
    return (
        <>
            <div className="min-h-20 relative min-w-64 max-w-64 cursor-pointer flex flex-col my-3 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden" onClick={() => {console.log('reer');setOpen(true)}}>
                <div className={'w-6 absolute top-2 right-2 h-6 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 rounded-full p-1 duration-300'}>
                    <FaAngleRight className='w-full h-full'/>
                </div>
                <div className='font-bold mb-3 text-[17px]'>Filter by Location</div>
                <p className='text-xs p-1 text-gray-900 dark:text-gray-300 truncate'>
                    {searchParams.get('city')?"City: "+searchParams.get('city')+', ': ""} 
                    {searchParams.get('sub_city')?"Sub city: "+ searchParams.get('sub_city')+' ':''}
                    {searchParams.get('woreda')?"Woreda: "+ searchParams.get('woreda')+' ':''}
                    {searchParams.get('kebele')?"Kebele: "+ searchParams.get('kebele')+' ':''}
                    {!none&& 'NO FILTER'}
                </p>
            </div>
            <Modal open={open} onClose={()=>setOpen(false)}>
                <div className="w-[60%] mt-8 p-8 bg-gray-800 dark:border-gray-200 m-auto">
                    <h1 className="mb-8 text-xl text-center">Find by Location</h1>
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="text" value={city} onChange={(e) => setCity(e.target.value.trim())} name="city" id="city" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 dark:text-white border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "/>
                            <label htmlFor="city" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">City</label>    
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="text" name="sub_city" id="sub_city" value={sub_city} onChange={(e) => setSubCity(e.target.value.trim())} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 dark:text-white border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "/>
                            <label htmlFor="sub_city" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Sub City</label>    
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="text" name="woreda" id="woreda" value={woreda} onChange={(e) => setWoreda(e.target.value.trim())} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 dark:text-white border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "/>
                            <label htmlFor="woreda" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Woreda</label>    
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="text" name="kebele" id="kebele" value={kebele} onChange={(e) => setkebele(e.target.value.trim())} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 dark:text-white border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "/>
                            <label htmlFor="kebele" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Kebele</label>    
                        </div>
                    </div>

                    <div className='flex justify-around mt-8'>
                        <button onClick={() => {
                            setCity('')
                            setSubCity('')
                            setWoreda('')
                            setkebele('')
                            setSearchParams(prev => {
                                prev.delete('city');
                                prev.delete('sub_city');
                                prev.delete('woreda');
                                prev.delete('kebele');
                            });
                            setOpen(false)
                        }} className='bg-blue-600'>Clear</button>
                        <button onClick={() => {
                            setSearchParams(prev => {
                                if (city !== '')
                                    prev.set('city', city)
                                else
                                    prev.delete('city')
                                
                                if (sub_city !== '')
                                    prev.set('sub_city', sub_city)
                                else
                                    prev.delete('sub_city')

                                if (woreda !== '')
                                    prev.set('woreda', woreda)
                                else
                                    prev.delete('woreda')

                                if (kebele !== '')
                                    prev.set('kebele', kebele)
                                else
                                    prev.delete('kebele')

                                return prev
                            });
                            setOpen(false)
                        }} className='bg-blue-600'>Search</button>
                    </div>
                </div>
            </Modal>
        </>

 
    )
}