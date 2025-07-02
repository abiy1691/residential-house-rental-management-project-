import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteVisitRequests, fetchVisitRequests } from "../api/visit"
import { Loader } from "../components/Loader";
import { FaDropbox } from "react-icons/fa6";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Modal } from "@mui/material";
import Slider from "react-slick";
import { useState } from "react";
import { toast } from "react-toastify";

function MyRequests() {

    const {data, status} = useQuery({
        queryKey: ['user', 'requests'],
        queryFn: fetchVisitRequests
    });

    const queryClient = useQueryClient();

    const {mutate} = useMutation({
        mutationFn: deleteVisitRequests,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user', 'requests'],
            });
            toast.success('Successfully deleted')
        },
        onMutate: (id) => {
            queryClient.invalidateQueries({
                queryKey: ['house', id, 'visits']
            })
        },
        onError: (error) => {
            console.log(error)
            toast.error(error.response?error.response.data.message : error.message)
        }
    })

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    }

    const [open, setOpen] = useState(false)
    const [images, setImages] = useState([])
    const [id, setId] = useState('')

    if(status === 'pending')
        return (
        <div className="w-full min-h-full flex justify-center align-center fullh">
            <Loader />
        </div>
        )
    return <div className="minfullh p-4">
            <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">Your visit requests</h2>
        <ul className="w-full px-4 dark:bg-gray-700 rounded-lg bg-gray-400 divide-y divide-gray-200 dark:divide-gray-800">
            {data.length === 0 &&
                <div className="w-32 h-32 pb-6 mx-auto dark:text-gray-300 text-gray-800">
                    <FaDropbox className="w-full h-full" />
                    <p className="text-center">No requests yet!</p>
                </div>
            }
            {data.map(({house, message, date}) =>
                <li className="cursor-pointer dark:hover:bg-gray-800">
                    <div state={2} className="flex space-x-4 rtl:space-x-reverse">
                        <div className="flex-shrink-0">
                            <img className="w-64 h-32 rounded-lg" src={"http://localhost:4001/"+house.images[0]} alt="Neil image" />
                        </div>
                        <Link to={'/houses/'+house._id} state={2} className="flex-1 h-32 flex flex-col justify-around min-w-0">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {house.no_of_rooms} room {house.house_type.toUpperCase()} at {house.address.city}, {house.address.sub_city}
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-400">
                            {house.rent_amount} ETB
                            </p>
                            <p className="text-gray-700 dark:text-gray-400 my-1 flex-1">
                            <span className="dark:text-white">Message:</span> {message}
                            </p>
                        </Link>
                        <div className="flex flex-col justify-around">
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                {dayjs(date).format('MMM DD YYYY, HH:mm a')}
                            </div>
                            <button onClick={() =>{ 
                                setImages(house.images)
                                setId(house._id)
                                setOpen(true)
                            }} className="bg-red-500 text-white font-bold p-1">
                                Delete Request
                            </button>
                        </div>
                    </div>
                </li>
            )
            }
        </ul>
        <Modal className="overflow-y-scroll" open={open} onClose={() => setOpen(false)}>
                <div className="relative bg-white mx-32 my-20 rounded-lg shadow dark:bg-gray-700 max-w-full">

                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Are you sure you want to delete your request for this house?
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 space-y-4">
                    <Slider {...settings} className="min-w-full mt-2 max-h-96">
                        {
                            images.map((image, idx) => 
                                <img key={idx} src={"http://localhost:4001/"+image} className="min-w-fill max-w-fill max-h-96 dark:bg-white object-fill rounded-lg" alt="house image" />
                            )
                        }
                    </Slider>
                    </div>

                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button type="button" onClick={() =>{ 
                            if (id !== '')
                                mutate(id)
                            setOpen(false)
                        }} 
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Yes I am sure</button>
                        <button type="button" onClick={() => setOpen(false)} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Back</button>
                    </div>
                </div>
           
        </Modal>
    </div> 
}

export default MyRequests
