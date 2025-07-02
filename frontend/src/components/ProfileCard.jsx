import React from "react";
import { Link } from "react-router-dom";

export const ProfileCard = ({user}) => {
    return (
        <Link to="/profile" className="block max-w-sm p-4 bg-white border border-gray-200 rounded-b-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-1 font-bold tracking-tight text-gray-900 dark:text-white">{user.email}</h5>
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{user.firstname} {user.lastname}</p>
        </Link>

    )
}