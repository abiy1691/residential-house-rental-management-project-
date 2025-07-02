import React, { useState } from 'react';
import { addTenant } from '../api/owner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaX } from 'react-icons/fa6';
import { validateForm } from '../utils/validation';
import { editTenant } from '../api/tenant';

const initialFormData = {
    mother_name: '',
    firstname: '',
    lastname: '',
    phonenumber: '',
    email: '',
    contract: null,
    nationalid: null,
} 

const initialReferenceData = {
    phonenumber:'',
    name:'',
    kebele:'',
    woreda:'',
    city:'',
    sub_city:'',
} 

function CreateTenants({edit}) {
    if (edit) {
        const data = useOutletContext();
        initialFormData.mother_name = data.tenant.mother_name 
        initialFormData.firstname = data.firstname 
        initialFormData.lastname = data.lastname
        initialFormData.phonenumber = data.phonenumber.slice(4)
        initialFormData.email = data.email

        initialReferenceData.name = data.tenant.reference.name
        initialReferenceData.phonenumber = data.tenant.reference.phonenumber.slice(4)
        initialReferenceData.city = data.tenant.reference.address.city
        initialReferenceData.sub_city = data.tenant.reference.address.sub_city
        initialReferenceData.woreda = data.tenant.reference.address.woreda
        initialReferenceData.kebele = data.tenant.reference.address.kebele
    }

    const [formData, setFormData] = useState(initialFormData);

    const [referenceData ,setReference] = useState(initialReferenceData);

  const handleReferenceChange = (e) =>{
    const {name,value} = e.target
    setDisplayError(new Set(displayError.add(name)))
    setReference({
        ...referenceData,
        [name]:value
    })
  }
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const { mutate, status } = useMutation({
        mutationFn: edit ? editTenant: addTenant,
        onSuccess: (house) => {
            if (edit) {
                queryClient.invalidateQueries({queryKey: ['tenant']})
                toast.success('Tenant edited successfully!');
                navigate('/tenant/')
            }
            else {
                toast.success('Tenant added successfully!');
                navigate('/owner/'+houseId)
            }
        },
        onError: (err) => {
            toast.error(err.response ? err.response.data.message : err.message);
            console.log(err)
        }
    });
    const { houseid:houseId } = useParams();
    
    const [displayError, setDisplayError] = useState(new Set());
    const [checked, setChecked] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setDisplayError(new Set(displayError.add(name)));
        if (files) {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (Object.keys(tenantErrors).length > 0) {
            Object.keys(tenantErrors).forEach((key)=>
                setDisplayError((prev) => new Set(prev.add(key)))
            )
            const field = Object.keys(tenantErrors)[0];

            return toast.error(`${field}: ${tenantErrors[field]}`)
        }

        if (Object.keys(referenceErrors).length > 0) {
            Object.keys(referenceErrors).forEach((key)=>
                setDisplayError((prev) => new Set(prev.add(key)))
            )
            const field = Object.keys(referenceErrors)[0];

            return toast.error(`${field} in reference info: ${referenceErrors[field]}`)
        }

        if (!formData.contract && !edit)
            return toast.error(`Contract photo is required`)
        if (!formData.nationalid && !edit)
            return toast.error(`National photo is required`)

        const data = {...formData, phonenumber: '+251'+formData.phonenumber}
        const address = {city: referenceData.city, sub_city: referenceData.sub_city, woreda: referenceData.woreda, kebele: referenceData.kebele};
        const rdata = {name: referenceData.name, phonenumber: '+251'+referenceData.phonenumber, address};
        
        const newFormData = new FormData();
        for (const key in data) {
            if (data[key] !== null && data[key] !== '') {
                newFormData.append(key, data[key]);
            }
        }
        newFormData.append('reference', JSON.stringify(rdata));
        
        if (edit)
            mutate(newFormData);
        else
            mutate({ formData: newFormData, houseId });
    }

    const handleAddReference = (e) =>{
        e.preventDefault()
        setModalVisible(false);
    }

    const showModal = () => {
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    const nonrequired = checked?['mother_name', 'nationalid', 'contract', 'firstname', 'lastname', 'phonenumber'] : ['mother_name', 'nationalid', 'contract']
    const tenantErrors = validateForm(formData, nonrequired);
    const referenceErrors = validateForm(referenceData, ['kebele', 'woreda']);

    return (
        <div className='w-full flex-1'>
            <form className="max-w-md mx-auto my-4" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="firstname"
                            id="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required={!checked}
                            disabled={checked}
                        />
                        <label htmlFor="firstname" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                        {(displayError.has('firstname') && tenantErrors.firstname !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{tenantErrors.firstname}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="lastname"
                            id="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required={!checked}
                            disabled={checked}
                        />
                        <label htmlFor="lastname" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                        {(displayError.has('lastname') &&tenantErrors.lastname !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{tenantErrors.lastname}</p>}
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                        {(displayError.has('email') &&tenantErrors.email !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{tenantErrors.email}</p>}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="mother_name"
                            id="mother_name"
                            value={formData.mother_name}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "      
                        />
                        <label htmlFor="mother_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Mother Name</label>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                    <div className="flex">
                            <span className="inline-flex items-center px-1 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                            +251
                            </span>
                            <input type="tel" pattern="[0-9]{9}" value={formData.phonenumber} onChange={handleChange} name="phonenumber" id="phonenumber" className="block py-2.5 px-1 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required={!checked} disabled={checked} />
                            <label htmlFor="phonenumber" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:translate-x-11 peer-focus:scale-75 peer-focus:-translate-y-7 peer-focus:-translate-x-0">Phone number (935556072)</label>
                    </div>
                        {(displayError.has('phonenumber') &&tenantErrors.phonenumber !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{tenantErrors.phonenumber}</p>}
                </div>
        
                    <div className="relative z-0 w-full mb-5 group">
                        <button
                            type="button"
                            className={"block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " + (Object.keys(referenceErrors).length>0?"border-2 border-red-500":"border-2 border-green-500")}
                            onClick={showModal}
                        >
                            Add Reference
                        </button>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    {
                        !edit&&
                        <div className="relative z-0 w-full mb-5 group">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="contract">Contract</label>
                            <input
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                id="contract"
                                name="contract"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">JPEG, WEBP, PNG, JPG (MAX. 3 MB).</p>
                            {(displayError.has('contract') && !formData.contract)&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">Please submit the contract photo</p>}
                        </div>
                    }
                    <div className="relative z-0 w-full mb-5 group">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="nationalid">{edit?"Change ":''}National Id</label>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            id="nationalid"
                            name="nationalid"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">JPEG, WEBP, PNG, JPG (MAX. 3 MB).</p>
                        {(!edit &&displayError.has('nationalid') && !formData.nationalid)&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">Please submit the tenants national id</p>}
                    </div>
                </div>
                {!edit&&
                    <div className="flex items-start my-3">
                  <div className="flex items-center h-5">
                    <input
                      onChange={(e) => setChecked(e.target.checked)}
                      value={checked}
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Aleady have an account (If the tenant have an account, only the email is needed)
                    </label>
                  </div>
                </div>}
                <Link to={edit?'/tenant':'/owner'} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg w-full sm:w-auto px-5 py-3.5 text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Back</Link>
                <button type="submit" className={"text-white bg-blue-700 hover:bg-blue-800 ml-6 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " + (status === 'pending'&&'pointer-events-none')} disabled={status==='pending'}>{status === 'pending'?
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>:
                    "Submit"}</button>
                
            </form>

            {/* Main modal */}
            {modalVisible && (
                <div
                    id=""
                    tabIndex="-1"
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
                >
                    <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                        
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        
                            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Add reference
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent p-1 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={hideModal}
                                >

                                    <FaX className='w-full h-full' />
                                </button>
                            </div>
                            {/* Modal body */}
                            <div className="p-4">
                                <form className="space-y-4" onSubmit={handleAddReference}>
                                    <div className="grid md:grid-cols-2 md:gap-6">

                                        <div>
                                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                                            <input onChange={handleReferenceChange} value={referenceData.name} type="name" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name" required />
                                            {(displayError.has('name') &&referenceErrors.name !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{referenceErrors.name}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="phonenumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                            <div className='flex'>
                                                <span className="inline-flex items-center px-1 text-sm text-gray-900 bg-gray-200 border rounded-s-md dark:bg-gray-600 dark:text-gray-400 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-500">
                                                    +251
                                                </span>
                                                <input onChange={handleReferenceChange} value={referenceData.phonenumber} type="phonenumber" name="phonenumber" id="phonenumber" placeholder=" phonenumber" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                            </div>
                                            {(displayError.has('phonenumber') &&referenceErrors.phonenumber !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{referenceErrors.phonenumber}</p>}
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 md:gap-6">

                                        <div>
                                            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                                            <input onChange={handleReferenceChange} value={referenceData.city} type="city" name="city" id="city" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="city" required />
                                            {(displayError.has('city') &&referenceErrors.city !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{referenceErrors.city}</p>}    
                                        </div>
                                        <div>
                                            <label  htmlFor="sub_city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sub City</label>
                                            <input onChange={handleReferenceChange} value={referenceData.sub_city} type="subcity" name="sub_city" id="sub_city" placeholder="sub city" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                            {(displayError.has('sub_city') &&referenceErrors.sub_city !== '')&& <p className="mt-1 text-xs text-red-600 dark:text-red-500">{referenceErrors.sub_city}</p>}
                                        
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 md:gap-6">

                                        <div>
                                            <label htmlFor="kebele" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">kebele</label>
                                            <input onChange={handleReferenceChange} value={referenceData.kebele} type="kebele" name="kebele" id="kebele" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="kebele" />
                                        </div>
                                        <div>
                                            <label htmlFor="woreda" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">woreda</label>
                                            <input onChange={handleReferenceChange} value={referenceData.woreda} type="woreda" name="woreda" id="woreda" placeholder="woreda" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                                        </div>
                                    </div>
                                    <div className='flex justify-center items-center'>
                                        <button onClick={() => setModalVisible(false)} className="w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateTenants;
