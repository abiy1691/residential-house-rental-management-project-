import React from 'react'

const DEFAULT_TYPES = ["Apartment", "Condo", "Duplex", "House", "Mansion", "Penthouse", "Studio", "Villa", "Bedsitter", "Chalet", "Farm House", "Room", "Building"];


function HouseForm({ houseData, setHouseData, selectedOption, setSelectedOption, images, setImages, setShowDropDown, showDropDown, edit, errors, setDisplay, displayError }) {
    const handleHouseChange = (e) => {
        setDisplay(new Set(displayError.add(e.target.name)));
        setHouseData({
            ...houseData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setDisplay(new Set(displayError.add('images')));
        setImages(e.target.files);
    };

    const toggleDropdown = () => {
        setShowDropDown(!showDropDown);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        toggleDropdown();
    };
    
    return (
            <div className="max-w-md mx-auto mt-14" >
                <div className="grid md:grid-cols-2 md:gap-6">

                    <div className="relative z-0 w-full mb-5 group">
                        <input onChange={handleHouseChange} type="number" value={houseData.no_of_rooms} name="no_of_rooms" id="no_of_rooms" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="no_of_rooms" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">No_Of_ROOMS</label>
                        {(displayError.has('no_of_rooms') &&errors.no_of_rooms !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.no_of_rooms}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input onChange={handleHouseChange} type="number" value={houseData.no_of_bath_rooms} name="no_of_bath_rooms" id="no_of_bath_rooms" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="no_of_bath_rooms" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">No_Of_Bath_ROOMS</label>
                        {(displayError.has('no_of_bath_rooms') &&errors.no_of_bath_rooms !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.no_of_bath_rooms}</p>}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input onChange={handleHouseChange} type="number" value={houseData.length} name="length" id="length" className="block py-2.5 px-0 w-full number-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                        <label htmlFor="length" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">length in meter</label>
                        {(displayError.has('length') &&errors.length !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.length}</p>}    
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input onChange={handleHouseChange} type="number" value={houseData.width} name="width" id="width" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                        <label htmlFor="width" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Width in meter</label>
                        {(displayError.has('width') &&errors.width !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.width}</p>}
                    </div>
                </div>
            
                <div className='grid md:grid-cols-2 md:gap-6'>
                    <div className="relative z-0 w-full mb-5 group">
                        <button onClick={toggleDropdown} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">{selectedOption || 'House Type'}
                            <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        
                        <div id="dropdown" className={`z-10 ${showDropDown ? 'block' : 'hidden'} bg-white max-h-64 overflow-y-scroll scrollable divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                {DEFAULT_TYPES.map(type => 
                                    <li>
                                        <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleOptionSelect(type)}>{type}</p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    {!edit&&<div className="relative z-0 w-full mb-5 group">
                        <label className={`block p-1.5 text-xs absolute text-gray-500 dark:text-gray-400 w-[110px] bg-gray-50 dark:bg-gray-700 dark:text-white ${images.length>0?'left-[96px]':'left-[93px] w-[133px] p-0 py-1.5 rounded-r-lg'}`} htmlFor="images">{images.length>0?`${images.length} photos`:"Upload house photos"}</label>
                        <input onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="images" type="file" multiple />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">Up to 10 photos (JPEG, WEBP PNG, JPG (MAX. 3 MB)).</p>
                        {(displayError.has('images') &&images.length < 2)&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">Please choose atleast two images</p>}
                    </div>}
                </div>

                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input onChange={handleHouseChange} type="number" value={houseData.housenumber} name="housenumber" id="housenumber" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required/>
                        <label htmlFor="housenumber" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Unique House Number</label>
                        {(displayError.has('housenumber') &&errors.housenumber !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.housenumber}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input onChange={handleHouseChange} type="number" value={houseData.rent_amount} name="rent_amount" id="rent_amount" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                        <label htmlFor="rent_amount" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Initial rent amount</label>
                    </div>
                </div>

                <label htmlFor="description" className="block mb-2 mt-2 text-sm font-[16px] text-gray-900 dark:text-white">Description</label>
                <textarea onChange={handleHouseChange} id="description" rows="4" name="description" value={houseData.description} className="block p-2.5 w-full mb-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="description here..."></textarea>
                {/* <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button> */}
            </div>

    )
}

export default HouseForm