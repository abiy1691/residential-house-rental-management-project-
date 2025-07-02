import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import { getSingleHouse } from "../api/house";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaAngleLeft, FaAngleRight, FaBed, FaToilet, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { Loader } from "../components/Loader";
import { MdErrorOutline } from "react-icons/md";
import { MinimalOwner } from "../components/MinimalOwner";
import HouseMap from "../components/HouseMap";
import ScheduleVisit from "../components/ScheduleVisit";

export const DetailHouse2 = () => {
    const { state } = useLocation();
    const { houseid } = useParams();
    const housePics = useRef(null);
    const [tabIndex, setTabIndex] = useState(state?.tabIndex || 0);
    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);
    const [item,setItem]=useState([])
    const { data, status, error } = useQuery({
        queryKey: ['house', houseid],
        queryFn: () => getSingleHouse(houseid)
    });
console.log (data)
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: current => setCurrent(current),
    };

    useEffect(() => {
        if (data?.house?.images) {
            const houseImages = data.house.images;
            setItem(houseImages)
console.log("Updated 'item':", item); 
        }
        // ✅ Logs after state updates
    }, [data]);
    
  
    
 /*    useEffect(() => {
        if (data?.house?.images) {
            const houseImages = data.house.images;
            setItem(houseImages);
            setImages(houseImages.length < 2 ? [...houseImages, houseImages[0]] : [...houseImages]);
        }
    }, [data]); */

/*     const swipeImages = (idx) => {
        const newImages = [...images];
        [newImages[current], newImages[idx]] = [newImages[idx], newImages[current]];
        setImages(newImages);
        setCurrent(idx);
    } */

    if (status === 'pending') {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-w-full min-h-screen flex justify-center items-center">
                <div className="w-64 h-64">
                    <MdErrorOutline className="w-full h-full text-red-600 dark:text-red-300" />
                    <p className="text-center">Page not found!</p>
                </div>
            </div>
        );
    }

    const { house } = data;

    return (
        <div className="flex max-w-full px-8 py-4 min-h-screen rounded-lg">
            <div className="w-1/2 max-h-full overflow-y-auto rounded-l-lg overflow-x-hidden p-8 pt-4 dark:bg-gray-800 flex flex-col">
                {/* Header Section */}
                <div className="flex justify-between mb-4">
                    <div>
                        <h4 className="text-xl font-semibold">
                            {house.house_type?.toUpperCase() || 'HOUSE'}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {house.address?.city}, {house.address?.sub_city}, {house.address?.woreda}
                            {house.address?.kebele && `, Kebele ${house.address.kebele}`}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold">
                            {house.rent_amount ? `${house.rent_amount} $` : 'Price not available'}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Per month
                        </p>
                    </div>
                </div>

                {/* Image Slider */}
              {/*   <Slider {...settings} className="w-full mx-2 mt-2">
                    {item.map((image, idx) => (
                        <div key={`slide-${idx}`} className="h-80">
                            <img 
                                src={image && image.startsWith('http') ? image : image ? `http://localhost:4001/${image}` : '/placeholder-house.jpg'}
                                className="w-full h-full object-cover rounded-lg bg-white dark:bg-gray-200"
                                alt={`House view ${idx + 1}`}
                                onError={(e) => {
                                    e.target.src = '/placeholder-house.jpg';
                                }}
                            />
                        </div>
                    ))}
                </Slider>
 */}
                {/* Thumbnail Navigation */}
                <div className="mt-4 flex justify-between items-center w-full">
                    <div className="relative w-[60%] h-16">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide" ref={housePics}>
                            {item.map((image, idx) => (
                                <img 
                                    key={`thumb-${idx}`}
                                    src={image && image.startsWith('http') ? image : image ? `http://localhost:4001/${image}` : '/placeholder-house.jpg'}
                                    onClick={() => swipeImages(idx)}
                                    className={`h-16 w-16 rounded cursor-pointer object-cover ${idx === current ? 'border-2 border-blue-500' : ''}`}
                                    alt={`Thumbnail ${idx + 1}`}
                                />
                            ))}
                        </div>
                        <button 
                            onClick={() => housePics.current.scrollBy({ left: -200, behavior: 'smooth' })}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-600 bg-opacity-70 rounded-full"
                        >
                            <FaAngleLeft className="text-white" />
                        </button>
                        <button 
                            onClick={() => housePics.current.scrollBy({ left: 200, behavior: 'smooth' })}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-600 bg-opacity-70 rounded-full"
                        >
                            <FaAngleRight className="text-white" />
                        </button>
                    </div>

                    {/* Features */}
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center px-3 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                            <FaBed className="w-6 h-6"/>
                            <span className="text-xs mt-1">{house.no_of_rooms} beds</span>
                        </div>
                        <div className="flex flex-col items-center px-3 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                            <FaToilet className="w-6 h-6"/>
                            <span className="text-xs mt-1">{house.no_of_bath_rooms} baths</span>
                        </div>
                        <div className="flex flex-col items-center px-3 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                            <FaArrowsLeftRightToLine className="w-6 h-6"/>
                            <span className="text-xs mt-1">
                                {house.width && house.length ? `${house.width * house.length}` : 'N/A'} m²
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex mt-6 justify-around border-b border-gray-300 dark:border-gray-600">
                    <button 
                        onClick={() => setTabIndex(0)}
                        className={`pb-2 px-4 ${tabIndex === 0 ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                    >
                        Description
                    </button>
                    <button 
                        onClick={() => setTabIndex(1)}
                        className={`pb-2 px-4 ${tabIndex === 1 ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                    >
                        Owner Info
                    </button>
                    <button 
                        onClick={() => setTabIndex(2)}
                        className={`pb-2 px-4 ${tabIndex === 2 ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                    >
                        Schedule Visit
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-6 min-h-64 mb-4">
                    {tabIndex === 0 && (
                        <ul className="px-4 space-y-2 list-disc list-inside">
                            {house.description?.split('\n').map((d, i) => (
                                <li key={`desc-${i}`} className="text-gray-700 dark:text-gray-300">
                                    {d.trim()}
                                </li>
                            ))}
                        </ul>
                    )}
                    {tabIndex === 1 && <MinimalOwner count={data.count} owner={house.owner} />}
                    {tabIndex === 2 && <ScheduleVisit calendar={house.calendar} id={house._id} />}
                </div>
            </div>

            {/* Map Section */}
            <div className="w-1/2 h-[calc(100vh-32px)] sticky top-4 rounded-r-lg">
                {house.address?.latitude && house.address?.longitude ? (
                    <HouseMap 
                        lat={house.address.latitude} 
                        lng={house.address.longitude} 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <p className="text-gray-500">Location not available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailHouse2;
