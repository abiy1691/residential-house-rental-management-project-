import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { editprofile, getUser } from "../api/auth";
import { validateForm } from "../utils/validation";
import { toast } from "react-toastify";
import { useNavigate, useOutletContext } from "react-router-dom";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        _id: '',
        firstname: "",
        lastname:"",
        username:"",
        email: "",
        phonenumber: "",
    });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {mutate} = useMutation({
        mutationFn: editprofile,
        onSuccess: (user) => {
            queryClient.setQueryData(['user'], user);
            toast.success('Successfully updated');
            navigate('/profile')
        },
        onError: (error) => {
            toast.error(error.response.data.message)
        }
    });

    const data = useOutletContext();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();

        if (Object.keys(errors).length === 0)
            mutate({...formData, 'phonenumber': '+251'+formData.phonenumber, user: data.username})

        else {
            (Object.keys(errors).forEach((key)=>{
                toast.error(`${key}: ${errors[key]}`)
            }))
        }
    }

    useEffect(() => {
        if(data) {
            setFormData({...data, phonenumber:data.phonenumber.slice(4)})
        }
    }, [data]);

    const errors = validateForm(formData, []);

    return (
    <form className="max-w-md mx-auto mt-5 min-w-72" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-5 group">
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
            {errors.email !== ''&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.email}</p>}
        </div>
    
        <div className="relative z-0 w-full mb-5 group">
            <input type="text" name="firstname" id="firstname" value={formData.firstname} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label htmlFor="firstname" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
            {errors.firstname !== ''&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.firstname}</p>}
        </div>

        <div className="relative z-0 w-full mb-5 group">
            <input type="text" name="lastname" id="lastname" value={formData.lastname} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label htmlFor="lastname" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
            {errors.lastname !== ''&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.lastname}</p>}
        </div>
        
        <div className="relative z-0 w-full mb-5 group">
            <div className="flex">
                <span className="inline-flex items-center px-1 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                +251
                </span>
                <input type="tel" pattern="[0-9]{9}" value={formData.phonenumber} onChange={handleChange} name="phonenumber" id="phonenumber" className="block py-2.5 px-1 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="phonenumber" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:translate-x-11 peer-focus:scale-75 peer-focus:-translate-y-7 peer-focus:-translate-x-0">Phone number (935556072)</label>
            </div>
            {errors.phonenumber !== ''&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.phonenumber}</p>}
        </div>
        
        <div className="relative z-0 w-full mb-5 group">
            <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label htmlFor="username" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">User name</label>
            {errors.username !== ''&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.username}</p>}
        </div>

        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>
    )
}

export default EditProfile;