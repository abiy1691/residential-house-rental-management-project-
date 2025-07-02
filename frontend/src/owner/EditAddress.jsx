import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { editHouse } from "../api/owner";
import { useQueryClient } from "@tanstack/react-query"
import AddressData from "./addressData";
import { validateForm } from "../utils/validation";


export const EditHouseAddress = () => {
    const {state} = useLocation();
    const address = state.address

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {mutate} = useMutation({
        mutationFn: editHouse,
        onSuccess: (house) => {
            queryClient.invalidateQueries({
                queryKey: ['onwer-house', state._id]
            });
            toast.success('Successfully updated')
            navigate('/owner/'+state._id)
        },
        onError: (error) => {console.log(error);toast.error(error.response?error.response.data:"Something went wrong")}
    });

    const [addressData, setAddressData] = useState({
        city: address.city,
        sub_city: address.sub_city,
        kebele: address.kebele,
        woreda: address.woreda,
        longitude: address.longitude,
        latitude: address.latitude,
    });

    const onClick = () => {
        mutate({address: addressData, houseid: state._id})
    }
    
    const addressErrors = validateForm(addressData, ['longitude', 'latitude', 'woreda', 'kebele']);
    return (<div className="h-full flex flex-col flex-1 px-32 justify-start overflow-scroll py-4">
        <AddressData addressData={addressData} setAddressData={setAddressData} errors={addressErrors} setDisplay={(name) => {}} displayError={new Set(['city', 'sub_city'])}/>
        <div className="flex gap-4 justify-end">
            <Link to={'/owner/'+state._id} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-8 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Back</Link>
            <button type="button" onClick={onClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-8 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Edit address</button>
        </div>
    </div>
    )
}