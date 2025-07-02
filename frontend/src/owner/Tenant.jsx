import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Modal } from "@mui/material";
import { download } from "../utils/downloadImage";
import { getTenant, removeTenant } from "../api/owner";
import dayjs from "dayjs";
import { Loader } from "../components/Loader";
import { toast } from "react-toastify";
import CustomModal from '../components/Modal'

const TenantProfile = () => {
    const [hide, setHide] = useState(true);
    const [another, setAnother] = useState(true)
    const {tenantid} = useParams();
    const {data, status, error} = useQuery({
        queryKey: ['tenant', tenantid],
        queryFn: () => getTenant(tenantid)
    });
    const navigate = useNavigate();
    const {data:url, status: urlStatus} = useQuery({
        enabled: data !== undefined,
        queryKey: ['tenant', 'national_id'],
        queryFn: () => download(data.tenant.national_id)
    });

    const {data:contractUrl, status: contractStatus} = useQuery({
        enabled: data !== undefined,
        queryKey: ['tenant', 'contract'],
        queryFn: () => download(data.house.contract.photo)
    });

    const qc = useQueryClient();

    const {mutate, status:mstatus} = useMutation({
        mutationFn: removeTenant,
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['owner-house', data?.house?._id], exact: true});
            qc.invalidateQueries({queryKey: ['owner', 'history']});
            qc.invalidateQueries({queryKey: ['tenant', tenantid]});
            toast.success('Tenant removed');
            navigate('/owner')
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || error.message)
        }
    });

    const handleHide = (e) => {
        if(e.target.id !== 'removetenant')
            setAnother(true)
    }

    useEffect(()=> {
        document.addEventListener('click', handleHide);
        return () => {
            if (url) 
                URL.revokeObjectURL(url);
        };
    }, [data]);
    
    let fullname = ''
    let address = ''

    const remainingdays = {}
    if (data) {
        fullname = `${data.firstname}  ${data.lastname}`
        address = `${data.tenant.reference.address.city}, ${data.tenant.reference.address.sub_city} `
        remainingdays.day = dayjs(data.house?.deadline).diff(new Date(), 'd')%30
        remainingdays.month = Math.floor(dayjs(data.house?.deadline).diff(new Date(), 'd') / 30);
    }
console.log(data)
    return (
        <div className="min-w-[23rem] w-[70%] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 self-center mx-auto px-5 text-center py-5">
            {status === 'pending' && 
                <div className="w-full h-full flex justify-center align-center">
                    <Loader />
                </div>
            }
            {status === 'error' && 
                <section className="bg-white dark:bg-gray-900">
                    <div className="py-8 px-4 mx-auto text-center">
                        <h1 className="mb-4 text-xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">An error occured</h1>
                    </div>
                </section>
            }
            {data&& 
            <>
            {
                data.isActive?
                <div className={"py-2.5 px-5 my-4 self-end text-sm font-medium text-gray-900 max-w-fit bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 "+(remainingdays.day < 0 && 'text-red-900 border-red-200 dark:text-red-500 dark:border-red-400')}>
                    {remainingdays.month > 0? remainingdays.month + " months and":''} {remainingdays.day>-1?remainingdays.day+' days until next deadline':Math.abs(remainingdays.day)+' days past the deadline'}
                </div>
                :
                data.verified ?
                    <div className={"py-2.5 px-5 me-2 my-4 self-end text-sm font-medium text-gray-900 max-w-fit bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 text-red-500 border-red-200 dark:text-red-200 dark:border-red-400"}>
                        This user was removed {Math.floor(dayjs().diff(dayjs(data.house.contract.enddate), 'd') / 30)} months and {dayjs().diff(dayjs(data.house.contract.enddate), 'd') % 30} days ago.
                    </div>
                    :
                    <div className={"py-2.5 px-5 me-2 my-4 self-end text-sm font-medium text-gray-900 max-w-fit bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 text-red-500 border-red-200 dark:text-red-200 dark:border-red-400"}>
                        This user is not verified yet
                    </div>

            }
                <div className="flex flex-col items-center py-4">
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
                            <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Email: <span className="ml-4">{data.email.split(' ')[0]}</span></span>
                            <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Username: <span className="ml-4">{data.username}</span></span>
                            <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2 divider">Phone: <span className="ml-4">{data.phonenumber.split(' ')[0]}</span></span>
                            <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2">Mother Name: <span className="ml-4">{data.tenant.mother_name}</span></span>
                            <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2 divider">Start Date: <span className="ml-4">{dayjs(data.house?.contract.startdate).format('YYYY-MM-DD')} </span></span>
                            <span className="text-l text-gray-700 dark:text-gray-100 self-start my-2 divider">{data.house.contract.enddate?"End Date":"Next Deadline:"} <span className="ml-4">{data.house.contract.enddate?dayjs(data.house?.contract.enddate).format('YYYY-MM-DD'):dayjs(data.house?.deadline).format('YYYY-MM-DD')}</span></span>
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
                    
                    <div className="flex mt-4 md:mt-6 w-full justify-around">
                        <button onClick={()=>navigate(-1)} className={`py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}>Back</button>
                        <button onClick={()=> {setHide(false)}} className={`py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}>See Contract</button>
                        {data.isActive || !data.verified &&
                            <button onClick={()=> setAnother(false)} id="removetenant" className={`py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}>Remove Tenant</button>
                        }
                    </div>
                    <Modal open={!hide && contractStatus === 'success'} onClose={()=>setHide(true)}>
                        <div className="w-[70%] h-full p-8 bg-gray-800 dark:border-gray-200 m-auto">
                            <img src={contractUrl} alt="" className="min-w-full max-w-full min-h-full max-h-full object-fit"/>
                        </div>
                    </Modal>
                    <CustomModal hide={another} message={"Are you sure you want to remove this tenant from the house?"} title={'Remove Tenant'} submit={mutate} email={data?.house?._id}/>
                </div>
            </>
            }
        </div>
        )
}

export default TenantProfile
