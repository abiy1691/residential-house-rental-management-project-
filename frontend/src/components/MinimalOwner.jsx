import React from "react";
import { Link } from "react-router-dom";


export const MinimalOwner = ({owner, count}) => {
    
    return <div className="flex flex-col min-h-64">
        <h6 className="mb-1 font-bold tracking-tight text-gray-900 dark:text-white">Email: <span className="ml-4">{owner.user.email}</span></h6> 
        <p className="font-normal text-gray-700 dark:text-gray-400">Full name: <span className="ml-4">{owner.user.firstname} {owner.user.lastname}</span></p>
        <p className="font-normal text-gray-700 dark:text-gray-400">Phone number: <span className="ml-4">{owner.user.phonenumber}</span></p>
        <p className="font-normal text-gray-700 dark:text-gray-400">Username: <span className="ml-4">{owner.user.username}</span></p>
        <p className="font-normal text-gray-700 dark:text-gray-400">Address: <span className="ml-4">{owner.address.city}, {owner.address.sub_city}</span></p>
        <p className="font-normal text-gray-700 dark:text-gray-400">Woreda: <span className="ml-4">{owner.address.woreda}</span></p>
        <p className="font-normal text-gray-700 dark:text-gray-400">Kebele: <span className="ml-4">{owner.address.kebele}</span></p>
        <Link to={'/houses/?owner='+owner.user._id} className="font-normal self-end"> {count} houses by this owner</Link>
    </div>
}