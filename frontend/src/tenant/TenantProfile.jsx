import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useOutletContext} from "react-router-dom";
import { Modal } from "@mui/material";
import ChangeModal from '../components/Modal'
import { download } from "../utils/downloadImage";
import {frogetPassword} from "../api/auth"
import dayjs from "dayjs";
import { toast } from "react-toastify";

export const TenantProfile = () => {
    const [hide, setHide] = useState(true);
    const [changeHide, setchangeHide] = useState(true);
    const data = useOutletContext(); 
    
    const {data:url, status: urlStatus} = useQuery({
        enabled: data !== undefined,
        queryKey: ['user', 'national_id'],
        queryFn: () => download(data.tenant.national_id)
    });

    const {data:contractUrl, status: contractStatus} = useQuery({
        enabled: data !== undefined,
        queryKey: ['user', 'contract'],
        queryFn: () => download(data.house.contract.photo)
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
            setchangeHide(true)
    }

    useEffect(()=> {
        document.addEventListener('click', handleHide);
        return () => {
            document.removeEventListener('click', handleHide);
        };
    }, [data]);

    let fullname = ''
    let address = ''
    let remainingdays = {}
    if (data) {
        fullname = `${data.firstname}  ${data.lastname}`
        address = `${data.tenant.reference.address.city}, ${data.tenant.reference.address.sub_city}`
        remainingdays.day = dayjs(data.house?.deadline).diff(new Date(), 'd')%30
        remainingdays.month = Math.floor(dayjs(data.house?.deadline).diff(new Date(), 'd') / 30);
    }
    
    console.log(data, 'house')
    return (
        <div className="min-w-[23rem] w-[70%] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 self-center mx-auto px-5 text-center pb-5">

            {data&&
            <div className="flex flex-col items-center">
                <div className={"py-2.5 px-5 me-2 my-4 self-end text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 "+(remainingdays.day < 0 && 'text-red-900 border-red-200 dark:text-red-500 dark:border-red-400')}>
                    {remainingdays.month > 0? remainingdays.month + " months and":''} {remainingdays.day>-1?remainingdays.day+' days until next deadline':Math.abs(remainingdays.day)+' days past the deadline'}
                </div>
                {urlStatus === 'success' ? 
                    <div className="w-[100%] h-64 mb-3 shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-600">
                        <img src={url} className="w-full h-full" />    
                    </div>
                    :
                    <div className="w-24 h-24 mb-3 rounded-full shadow-lg overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <svg className="m-auto w-20 h-20 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                    </div>
                }
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{fullname}</h5>

                <div className="flex justify-around w-full m-4">

                    <div className="flex flex-col">
                        <h6 className="self-start font-bold pb-2 border-b border-b border-gray-200 dark:border-gray-700 w-full">General Info</h6>
                        <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Email: <span className="ml-4">{data.email}</span></span>
                        <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Username: <span className="ml-4">{data.username}</span></span>
                        <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2 divider">Phone: <span className="ml-4">{data.phonenumber}</span></span>
                        <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Mother Name: <span className="ml-4">{data.tenant.mother_name}</span></span>
                        <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2 divider">Next Deadline: <span className="ml-4">{dayjs(data.house?.deadline).format('YYYY-MM-DD')}</span></span>
                        <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2 divider">Start Date: <span className="ml-4">{dayjs(data.house?.contract.startdate).format('YYYY-MM-DD')} </span></span>
                    </div>
                    <hr />
                    <div className="flex flex-col border-gray-200 dark:border-gray-700 text-lg dark:text-white text-gray-900">
                        <h6 className="self-start font-bold pb-2 border-b border-gray-200 dark:border-gray-700 w-full">Refference Data</h6>
                        <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Full Name: {data.tenant.reference.name}</span>
                        
                        
                        <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Phone number: {data.tenant.reference.phonenumber}</span>
                        
                        <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Address: {address}</span>
                        <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Woreda: {data.tenant.reference.address.woreda}</span>
                        <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Kebele: {data.tenant.reference.address.kebele}</span>
                    </div>
                </div>
                

                <div className="flex mt-4 md:mt-6 w-full justify-around pb-4 border-b dark:border-gray-600 border-gray-200 relative">
                    <p className="text-xs absolute p-0.5 -bottom-2 right-0 bg-white dark:bg-gray-800 dark:text-gray-400 text-gray-900"> Account actions</p>
                    <button id='changepassword' onClick={()=> {setchangeHide(false)}} className={`py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 ${isPending&&'cursor-not-allowed'}`} disabled={isPending}>{isPending?'...':'Change Password'}</button>
                    <Link to={"/tenant/edit"} className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Edit Profile</Link>
                    <button onClick={()=> {console.log('hrehe');setHide(false)}} className={`py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}>See Contract</button>
                </div>
                <div className="flex mt-4 md:mt-6 w-full justify-around pb-4 border-b dark:border-gray-600 border-gray-200 relative">
                    <p className="text-xs absolute p-0.5 -bottom-2 right-0 bg-white dark:bg-gray-800 dark:text-gray-400 text-gray-900"> House actions</p>
                    <Link to={"/tenant/owner"} className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Owner detail</Link>    
                    <Link to={"/tenant/payrent"} className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Pay Rent</Link>    
                </div>
                
                <ChangeModal hide={changeHide} title={'Are you sure you want to change your password'} message={'Please click yes if you want to change your password and we will send you an email to help you reset your password or click back if you don\'t want anything'} email={data.email} submit={mutate}/>
                <Modal open={!hide && contractStatus === 'success'} className="!z-[10001]" onClose={()=>setHide(true)}>
                    <div className="w-[70%] h-full p-8 bg-gray-800 dark:border-gray-200 m-auto">
                        <img src={contractUrl} alt="" className="min-w-full max-w-full min-h-full max-h-full"/>
                    </div>
                </Modal>
            </div>
            }
        </div>
        )
}
