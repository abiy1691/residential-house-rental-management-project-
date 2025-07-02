import React, { useState } from "react";
import HouseForm from "./HouseForm";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { editHouse } from "../api/owner";
import { useQueryClient } from "@tanstack/react-query"
import { validateForm } from "../utils/validation";

export const EditHouse = () => {
    const {state} = useLocation();

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
        onError: (error) => {toast.error(error.response?error.response.data:"Something went wrong")}
    })

    const [houseData, setHouseData] = useState({
        housenumber: state.housenumber,
        no_of_rooms: state.no_of_rooms,
        no_of_bath_rooms: state.no_of_bath_rooms,
        length: state.length,
        width: state.width,
        rent_amount: state.rent_amount,
        description: state.description,
    });

    const [selectedOption, setSelectedOption] = useState(state.house_type);
    const [showDropDown, setShowDropDown] = useState(false);
    const onClick = () => {
        mutate({...houseData, house_type:selectedOption, houseid: state._id});
    }
    
    const houseErrors = validateForm(houseData, ['description', 'rent_amount']);
    
    return (<div className="flex-1">
        <HouseForm houseData={houseData} setHouseData={setHouseData} selectedOption={selectedOption} setSelectedOption={setSelectedOption} showDropDown={showDropDown} setShowDropDown={setShowDropDown} edit errors={houseErrors} setDisplay={() => {}} displayError={new Set(Object.keys(houseData))}/>
        <div className="flex justify-end gap-4">
            <Link to={'/owner/'+state._id} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-8 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Back</Link>
            <button type="button" onClick={onClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-8 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Edit house</button>
        </div>
    </div>
    )
}