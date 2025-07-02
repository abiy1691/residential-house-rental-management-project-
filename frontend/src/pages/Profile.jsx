import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { frogetPassword, getUser } from "../api/auth";
import { toast } from "react-toastify";
import Modal  from "../components/Modal";
import { download } from "../utils/downloadImage";
import { Loader } from "../components/Loader";
import { MdErrorOutline } from "react-icons/md";

const Profile = () => {
    const [hide, setHide] = useState(true);
    const {id} = useParams();

    const {data, status:qstatus} = useQuery({
        queryKey: id ? ['users', id] : ['user'],
        queryFn: () => {console.log(id); return getUser(id)}
    });

    const {data:url, status, error} = useQuery({
        enabled: data?.owner !== undefined,
        queryKey: ['user', 'national_id'],
        queryFn: () => download(data.owner.national_id)
    });

    const {mutate, isPending} = useMutation({
        mutationFn: frogetPassword,
        onSuccess: (data) => {
            toast.success('We have sent a password reset link to: '+data.email)
        },
        onError: (error) => {
            toast.error('Something went wrong')
        }
    });
    const handleHide = (e) => {
        if(e.target.id !== 'changepassword')
            setHide(true)
    }

    useEffect(()=> {
        document.addEventListener('click', handleHide);
        return () => {
            if (url) 
                URL.revokeObjectURL(url);
    
            document.removeEventListener('click', handleHide);
        };
    }, [data]);
    
    let fullname = ''
    if (data) 
        fullname = `${data.firstname}  ${data.lastname}`

    let address = ''
    if (data?.owner)
        address = `${data.owner.address.city}, ${data.owner.address.sub_city}`
    const woreda = data?.owner? data.owner.address.woreda : ''
    const kebele = data?.owner && data.owner.address.kebele || ''

    if (qstatus === "pending")
        return (
            <div className="w-full h-full flex justify-center align-center">
                <Loader />
            </div>
        )

    if (qstatus === 'error')
        return (
            <div className="min-w-full fullh flex justify-center items-center">
                <div className="w-64 h-64">
                    <MdErrorOutline className="w-full h-full dark:red-300 red-600" />
                    <p className="text-center">User not found!</p>
                </div>
            </div>
        )
    console.log(status, url)
    return (
        <div className="min-w-[23rem] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 self-center mx-auto px-5 text-center py-5">
            {data&&
            <div className="flex flex-col items-center pb-10">
                {status === 'success' ?
                    <div className="w-[100%] h-64 mb-3 shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-600">
                        <img src={url} className="w-full h-full" />    
                    </div>
                    :
                    <div className="w-24 h-24 mb-3 rounded-full shadow-lg overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <svg className="m-auto w-20 h-20 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                    </div>
                }
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{fullname}</h5>
                <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Email: {data.email}</span>
                <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Username: {data.username}</span>
                <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Phone: {data.phonenumber}</span>
                {data.owner &&
                <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Address: {address}</span>
                }
                {data.owner &&
                <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Woreda: {woreda}</span>
                }
                {kebele&&<span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Kebele: {kebele}</span>}
 
                {!id&&
                <>
                    <div className="flex mt-4 md:mt-6 w-full justify-around">
                        <Link to={data.role === 'owner'?"/owner/edit":"edit"} className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Edit Profile</Link>
                        <button id='changepassword' onClick={()=> {setHide(false)}} className={`py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 ${isPending&&'cursor-not-allowed'}`} disabled={isPending}>{isPending?'...':'Change Password'}</button>
                    </div>
                    <Modal hide={hide} title={'Are you sure you want to change your password'} message={'Please click yes if you want to change your password and we will send you an email to help you reset your password or click back if you don\'t want anything'} email={data.email} submit={mutate}/>
                </>}
            </div>
            }
        </div>
        )
}

export default Profile
