import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal  from "../components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editHouseImages } from "../api/owner";
import { toast } from "react-toastify";

export const EditImages = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const {state} = useLocation();
    const [hide, setHide] = useState(true);
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const {mutate, isPending} = useMutation({
        mutationFn: editHouseImages,
        onSuccess: (e) => {
            queryClient.invalidateQueries({
                queryKey: ['onwer-house', state._id]
            });
            toast.success('Successfully Changed images')
            navigate('/owner/'+state._id);
        },
        onError: (e) => {
            toast.error(e.response?e.response.data.message : e.message);
        }
    })

    const onChange = (e, imageurl) => {
        if (e.target.checked)
            setSelectedImages([...new Set([...selectedImages, imageurl])])
        else
            setSelectedImages(selectedImages.filter((url) => url !== imageurl))
    }

    const handleHide = (e) => {
        if(e.target.id !== 'applychange')
            setHide(true)
    }
    
    useEffect(()=> {
        document.addEventListener('click', handleHide);
        return () => {
            document.removeEventListener('click', handleHide);
        };
    }, [state]);
    
    const onApplyChange = ({selectedImages, newImages, id}) => {
        const form = new FormData();
        form.append('deletedImages',  JSON.stringify(selectedImages));
        for (let i = 0; i < newImages.length; i++) {
            form.append('images', newImages[i]);
        }
        mutate({houseid: id, form})
    }
    
    return (
        <div className="min-h-screen flex flex-col justify-between flex-1">
            <div>
                Please Select images you want to remove
                <div className="grid md:grid-cols-3 sm:grid-col-1 gap-4 mt-4">
                    {state.images.map((image, idx) =>
                        <div key={idx} className="relative">
                            <img className="max-h-64 min-h-64 min-w-64 max-w-full w-full rounded-lg dark:bg-white" src={'http://localhost:4001/'+image} alt="" />
                            <input onChange={(e)=>onChange(e, image)} checked={selectedImages.includes(image)} type="checkbox" value="" className="w-4 h-4 cursor-pointer absolute top-2 right-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                        </div>
                            
                    )}
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <div className="relative z-0 group">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="national_id">Add Images</label>
                    <input
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        type="file"
                        onChange={(e) => setNewImages(e.target.files)}
                        accept="image/*"
                        multiple
                    />    
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">Upto 10 images in total (JPEG, WEBP, PNG, JPG (MAX. 3 MB)).</p>    
                </div>
                <div>
                    <Link to={'/owner/'+state._id} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-8 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Back</Link>
                    <button type="button" id="applychange" onClick={() => setHide(false)} className="text-gray-900 hover:text-white min-w-1/4 self-end mt-8 border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">Apply changes</button>
                </div>
            </div>

            <Modal hide={hide} title={'Apply Changes to your houses images'} message={`If you press yes ${selectedImages.length} images will be deleted and ${newImages.length} new ones will be add. Are you sure you want to do that`} submit={onApplyChange} email={{newImages, selectedImages, id:state._id}}/>
        </div>
    );
}
