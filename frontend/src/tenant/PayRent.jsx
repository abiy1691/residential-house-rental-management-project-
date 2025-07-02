import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react';
import { getHouse, payrent } from '../api/tenant';
import { Loader } from '../components/Loader';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';


const groupBy = (arr) => {
    if (arr)
    return arr.reduce((res, val) => {
        const key = val.bankname
        if (!res[key])
            res[key] = []
        res[key].push(val.accountnumber)
        return res
    }, {})
}

const icons = {
    CBE: "/images/images.jpeg",
    BOA: "/images/boaicon.png",
    Awash: "/images/Awash_International_Bank.png",
    Hijra: 'images/hijraicon.png',
}

function PayRent() {

    const {data, status} = useQuery({
        queryKey: ['tenant', 'house'],
        queryFn: getHouse
    });

    const {state} = useLocation();
    console.log(state)
    const qc = useQueryClient();
    const navigate = useNavigate();
    const {mutate, status: mstatus} = useMutation({
        mutationFn: payrent,
        onSuccess: (data) => {
            console.log(data, 'hererere');
            qc.invalidateQueries(['tenant', 'history']);
            toast.success('Successfully initiated payment');
            navigate('/tenant/history', {replace: true});
        },
        onError: (error) => {
            toast.error(error.response?error.response.data.message:error.message);
            console.log(error);
        }
    })
console.log(data)
    const banks = useMemo(() => groupBy(data?.bankaccounts)
    , [status]);
    
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [months, setMonths] = useState(1);
    const [img, setImg] = useState(null);
    
    useEffect(() => {
        if (state) {
            setSelectedBank(state.paid_to.bankname);
            setSelectedAccount(state.paid_to.accountnumber);
            setMonths(state.month)
        }
        else if(data) {
            setSelectedBank(data.bankaccounts[0].bankname);
            setSelectedAccount(data.bankaccounts[0].accountnumber);
        }
    }, [status]);

    const onSubmit = () => {
        if (!img && !state)
            return toast.error('Please upload the bank transaction slip photo.');
        const id = {id: state?state._id: null}
        mutate({month: months, paid_to: {bankname: selectedBank, accountnumber: selectedAccount}, verification: img, ...id});
    }

    if(status === 'pending')
        return (
        <div className="w-full h-full flex justify-center align-center">
            <Loader />
        </div>
        )
    

    if (status === 'error')
        return (
            <div className="w-full h-full flex justify-center align-center">
                <div className="w-64 h-64">
                    <p className="text-center">{error.response ? error.response.data.message : error.message}</p>
                </div>
            </div>
        )

    return (
        <div className="w-full p-8 flex">

            <div className="block w-full p-6 bg-white border border-gray-200 rounded-l-lg shadow dark:bg-gray-800 dark:border-gray-700">       
                <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">Choose Bank</h3>
                <ul className="grid w-full gap-6 md:grid-cols-2">
                    {Object.keys(banks).map((bank) => 
                        <li key={bank}>
                            <input checked={selectedBank === bank} type="radio" id={bank} name="hosting" onChange={() => {setSelectedBank(bank); setSelectedAccount(banks[bank][0])}} className="hidden peer" />
                            <label htmlFor={bank} className="inline-flex items-center w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                <img src={icons[bank]} className="w-8 h-8 rounded-full mr-4" alt="" />
                                <div className="block">
                                    <div className="w-full text-lg font-semibold">{bank}</div>
                                </div>
                            </label>
                        </li>
                    )}
                </ul>
            </div>
            <div className="block w-full p-6 bg-white border border-gray-200 rounded-r-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
                <h3 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose Bank account:</h3>
                {banks[selectedBank] && banks[selectedBank].map(account => 
                    <div key={account} className="flex items-center mb-4">
                        <input id={account} checked={account === selectedAccount} onChange={()=>setSelectedAccount(account)} type="radio" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:outline-none dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor={account} className="ml-2 font-medium text-gray-900 dark:text-gray-300">{account}</label>
                    </div>
                )}
                <div className="max-w-xs my-6">
                    <label htmlFor="quantity-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number of months:</label>
                    <div className="relative flex items-center max-w-[8rem]">
                        <button type="button" onClick={()=>{if(months > 1) setMonths(months - 1)}} id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-none rounded-l-lg p-3 h-11 focus:outline-none">
                            <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <input type="text" id="quantity-input" data-input-counter data-input-counter-min="1" data-input-counter-max="50" aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) =>{if(e.target.value < 6 && e.target.value > 0) setMonths(e.target.value)}} value={months} />
                        <button type="button" onClick={()=>{if(months < 5) setMonths(months + 1)}} id="increment-button" data-input-counter-increment="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-none rounded-r-lg p-3 h-11 focus:outline-none">
                            <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                    <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">You can pay upto 5 months in the future at once.</p>
                </div>
                <p className="my-4">Please Deposit {data.rent_amount * months} ETB to {selectedBank}: {selectedAccount} and upload the reciet</p>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">{state?'Change transaction photo':'Upload transaction slip'}</label>
                <input onChange={(e) => setImg(e.target.files[0])} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 mb-4" id="file_input_help">PNG, JPG or JPEG (MAX. 3MB).</p>
                <button onClick={onSubmit} className="bg-blue-500 absolute py-1 px-6 right-2 bottom-1">{state?"Edit":"Pay"}</button>
            </div>
        </div>
    )
}

export default PayRent
