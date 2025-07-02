import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSingleHouse, removeTenant } from "../api/owner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaAngleLeft, FaAngleRight, FaBed, FaToilet, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { AvailableDates } from "../components/AvailableDates";
import { MinimalTenant } from "../components/MinimalTenant"
import { Loader } from "../components/Loader";
import { DisplayBankAccount } from "../components/DisplayBankAccount";
import { Link } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";

export const SingleHouse = () => {
    const { houseid } = useParams();
    const housePics = useRef(null);
    const [tabIndex, setTabIndex] = useState(0);
    
    const {data, status} = useQuery({
        queryKey: ['owner-house', houseid],
        queryFn: ()=>getSingleHouse(houseid)
    });
    
    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);
    
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: current => {
            setCurrent(current);
        },
    };

    const [hide, setHide] = useState(true)
    
    const handleHide = (e) => {
        if(e.target.id !== 'editdropdown')
            setHide(true)
    }

    useEffect(() => {
        if (data) {
            setImages(data?.images)
        }
        document.addEventListener('click', handleHide);
        return () => {
          document.removeEventListener('click', handleHide);
        };
    }, [data, status]);
    
    const swipeImages = (idx, current) => {
        [images[current], images[idx]] = [images[idx], images[current]]
        setImages([...images])
    }
    
    if(status === 'pending')
        return (
        <div className="w-full h-full flex justify-center align-center">
            <Loader />
        </div>
        )

    if (status === 'error')
        return (
            <div className="w-full h-full flex justify-center align-center">
                <div className="w-64 h-64">
                    <MdErrorOutline className="w-full h-full dark:red-300 red-600" />
                    <p className="text-center">Page not found!</p>
                </div>
            </div>
        )

    return (
        <div className="w-full h-full overflow-y-scroll overflow-x-hidden p-8 pt-4 dark:bg-gray-800 mx-32 flex flex-col">
            <div className="relative self-end">

                <button onClick={()=>setHide(!hide)} id="editdropdown" data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 mb-4 focus:outline-none  font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 self-end max-w-64" type="button">Edit House <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </button>


                <div id="dropdown" className={`z-10 ${hide?'hidden':''} absolute right-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <Link to="edit/general" state={data} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">General Info</Link>
                    </li>
                    <li>
                        <Link to="edit/address" state={{address: data?.address, _id: data?._id}} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Address</Link>
                    </li>
                    <li>
                        <Link to="edit/bank" state={{bankaccounts: data?.bankaccounts, _id: data?._id}} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Bank Accounts</Link>
                    </li>
                    <li>
                        <Link to="edit/images" state={{images: data?.images, _id: data?._id}} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Images</Link>
                    </li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-between mb-4">
                <div>
                    <h4>
                        House Number {data?.housenumber}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {data?.address.city}, {data?.address.sub_city}, {data?.address.woreda} {data?.address.kebele && "kebele, "+data?.address.kebele}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        House type: {data?.house_type.toUpperCase()}
                    </p>
                </div>
                <div>
                    <h4>
                        {data?.rent_amount || 0} $
                    </h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Per month
                    </p>
                </div>
            </div>
          {/*   {images.length > 1?

            <Slider {...settings} className="min-w-full mt-2">
                {
                    images.map((image, idx) => 
                        <img key={idx} src={"http://localhost:4001/"+image} className="min-h-80 max-h-80 min-w-full max-w-full dark:bg-white object-fill rounded-lg" alt="" />
                    )
                }
            </Slider>
            :
            <div className="min-w-full w-full mt-2">
                {images.map((image, idx) => 
                        <img key={idx} src={"http://localhost:4001/"+image} className="min-h-80 max-h-80 min-w-full max-w-full dark:bg-white object-fill rounded-lg" alt="" />
                    )
                }
            </div>
            } */}
            <div className="mt-2 flex justify-between items-center min-w-256">
                <div className="flex relative w-[60%] rounded h-full">
                    <div className="flex gap-2 w-full overflow-x-scroll peer" ref={housePics}>
                    {
                        images.map((image, idx) => 
                            <img key={idx} src={"http://localhost:4001/"+image} onClick={() => swipeImages(idx, current)} className="min-h-full max-h-16 max-w-16 min-w-16 dark:bg-white rounded max-h-16 object-fill" alt="" />
                        )
                    }
                    </div>
                    <div onClick={() => housePics.current.scrollBy({
                        left: -200,
                        behavior: 'smooth',
                        })}
                        className="top-0 h-full absolute w-4 cursor-pointer flex items-center left-0 bg-gray-600 opacity-0 dark:bg-gray-800 duration-200 ease-in peer-hover:opacity-70 hover:opacity-70">
                        <FaAngleLeft />
                    </div>
                    <div onClick={() => housePics.current.scrollBy({
                        left: 200,
                        behavior: 'smooth',
                        })} 
                        className="top-0 h-full cursor-pointer absolute w-4 flex items-center right-0 bg-gray-600 opacity-0 dark:bg-gray-800 duration-200 ease-in peer-hover:opacity-70 hover:opacity-70">
                        <FaAngleRight />
                    </div>
                </div>
                <div className="flex border-dashed p-2 rounded">
                    <div className="flex flex-col items-center ml-2 mr-1 min-w-max border-gray-300 bg-gray-100 rounded-lg p-1 dark:bg-gray-700">
                        <FaBed className="min-h-8 min-w-8"/>
                        <span className="text-xs mt-1">{data?.no_of_rooms} bed rooms</span>
                    </div>
                    <div className="flex flex-col items-center mx-1 min-w-max border-gray-300 bg-gray-100 rounded-lg p-1 dark:bg-gray-700">
                        <FaToilet className="min-h-8 min-w-8"/>
                        <span className="text-xs mt-1">{data?.no_of_bath_rooms} bath rooms</span>
                    </div>
                    <div className="flex flex-col items-center mx-1 min-w-max border-gray-300 bg-gray-100 rounded-lg p-1 dark:bg-gray-700">
                        <FaArrowsLeftRightToLine className="min-h-8 min-w-8"/>
                        <span className="text-xs mt-1">{data?.width * data?.length} m<sup>2</sup></span>
                    </div>
                </div>
            </div>
            <div className="flex mt-4 justify-around ">
                <div onClick={()=>setTabIndex(0)} className={`hover:bg-gray-100 hover:dark:bg-gray-700 p-2 rounded cursor-pointer ${tabIndex === 0 && 'bg-gray-100 dark:bg-gray-700'}`}>Description</div>
                <div onClick={()=>setTabIndex(1)} className={`hover:bg-gray-100 hover:dark:bg-gray-700 p-2 rounded cursor-pointer ${tabIndex === 1 && 'bg-gray-100 dark:bg-gray-700'}`}>Calendar</div>
                <div onClick={()=>setTabIndex(2)} className={`hover:bg-gray-100 hover:dark:bg-gray-700 p-2 rounded cursor-pointer ${tabIndex === 2 && 'bg-gray-100 dark:bg-gray-700'}`}>Tenant</div>
                <div onClick={()=>setTabIndex(3)} className={`hover:bg-gray-100 hover:dark:bg-gray-700 p-2 rounded cursor-pointer ${tabIndex === 3 && 'bg-gray-100 dark:bg-gray-700'}`}>Bank Accounts</div>
            </div>
            <div className="border-t border-gray-500 w-3/4 mx-auto my-2"></div>
            <div className="mt-6 min-h-32 mb-4">
                {tabIndex === 0 && <ul className="px-4 font-normal list-disc list-inside">
                        {data?.description.split('\n').map(d => 
                            <li>{d}</li>
                        )}
                </ul>}
                {tabIndex === 1 && <AvailableDates dates={data?.calendar} houseid={data?._id} />}
                {tabIndex === 2 && <MinimalTenant houseId={data?._id} tenant={data?.tenant} />}
                {tabIndex === 3 && <DisplayBankAccount bankaccounts={data?.bankaccounts} />}
            </div>
        </div>
    )
}
