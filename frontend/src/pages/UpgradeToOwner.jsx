import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createowner } from "../api/owner";

// Validation to be done
const UpgradeToOwner = () => {
    const [address, setAddress] = useState({
        city: '',
        sub_city: '',
        kebele: '',
        woreda: '',
    });
    const [image, setImage] = useState(null);
    const form = useRef(null);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {mutate} = useMutation({
        mutationFn: createowner,
        onSuccess: (owner) => {
            const user = queryClient.getQueryData(['user']);
            queryClient.invalidateQueries({queryKey: ['user']});
            queryClient.setQueryData(['name'], {...user, owner: owner.savedOwner});
            toast.success('Successfully registered as owner');
            navigate('/profile');
        },
        onError: (error) => {
            const user = queryClient.getQueryData(['user']);
            toast.error(error.response.data.message);
        }
    });

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress({
          ...address,
          [name]: value,
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!image) {
            setError('Please choose a file')
            return;
        }
        
        const newForm = new FormData();
        newForm.append('nationalid', image)
        newForm.append('address', JSON.stringify(address))
        
        mutate(newForm)
    }


    return (
    <>
        <h1 className="mb-8 text-3xl text-center">Welcome to register as owner page</h1>
        <form className="max-w-md mx-auto mt-5 min-w-72" onSubmit={handleSubmit} ref={form}>
            <div className="relative z-0 w-full mb-5 group">
                <input onChange={handleAddressChange} type="text" name="city" id="city" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="city" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">City</label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
                <input onChange={handleAddressChange} type="text" name="sub_city" id="sub_city" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="sub_city" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Sub City</label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
                <input onChange={handleAddressChange} type="text" name="kebele" id="kebele" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "/>
                <label htmlFor="kebele" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Kebele</label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
                <input onChange={handleAddressChange} type="text" name="woreda" id="woreda" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="woreda" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Woreda</label>
            </div>
                        
            <div className="relative z-0 w-full mb-5 group">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload National Id</label>
                <input onChange={e=>setImage(e.target.files[0])} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" name="images" type="file" required/>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">JPEG, WEBP PNG, JPG (MAX. 3 MB).</p>
            </div>

            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
    </>
    )
}

export default UpgradeToOwner;