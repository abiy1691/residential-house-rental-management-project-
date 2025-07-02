import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { removeTenant } from "../api/owner";

export const MinimalTenant = ({tenant, houseId}) => {
    
    if (!tenant || Object.keys(tenant).length === 0)
        return <div className="m-auto text-xl w-fit">
                No tenants assigned yet, 
                <Link to="create-tenants" className=" my-[15px] block mt-5 text-center focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Tenant</Link>
            </div>
    return <div className="flex flex-col">
        <Link to={'/owner/tenant/'+tenant._id}>
            <h6 className="mb-1 font-bold tracking-tight text-gray-900 dark:text-white">Email: <span className="ml-4">{tenant.email}</span></h6> 
            <p className="font-normal text-gray-700 dark:text-gray-400">Full name: <span className="ml-4">{tenant.firstname} {tenant.lastname}</span></p>
            <p className="font-normal text-gray-700 dark:text-gray-400">Phone number: <span className="ml-4">{tenant.phonenumber}</span></p>
            <p className="font-normal text-gray-700 dark:text-gray-400">Username: <span className="ml-4">{tenant.username}</span></p>
            {!tenant.verified && <p className="font-normal text-gray-700 dark:text-gray-400 mt-6 w-full text-center">This user is not verified</p>}
        </Link>
    </div> 
}
