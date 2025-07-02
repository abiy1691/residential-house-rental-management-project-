import React, { useState } from "react";
import { MdDelete } from "react-icons/md";

const showAdd = (accounts) => accounts.every((val) => val!='');

const handleChange = (value, idx, bank, setBank) => {
    bank[idx] = value
    setBank([...bank])
}
// Handle this states more effeciently and cleverly
const deleteAccount = (idx, bank, setBank) => {
    setBank(bank.filter((val, i) => idx !== i))
}
export const AddBankAccounts = ({CBE, setCBE, BOA, setBOA, awash, setAwash, hijra, setHijra}) => {

    return (
            <div className="grid grid-cols-2 gap-4 max-w-[595px]">
                <div className="flex flex-col">
                    <img className="w-full rounded-lg rounded-b-none h-full dark:bg-white" src="/images/CBE.webp" alt="" />
                    {CBE.map((val, idx) =>
                        <div key={idx} className="relative">
                            <input type="number" aria-describedby="helper-text-explanation" value={val} onChange={(e)=>handleChange(e.target.value, idx, CBE, setCBE)} className="bg-gray-50 border border-gray-300 outline-none no-spiner text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 peer" placeholder="Account Number" />
                            <MdDelete className="absolute top-0 mr-1 right-0 h-full w-6 text-gray-900 dark:text-white hover:text-red-500 cursor-pointer duration-300 transform scale-0 peer-hover:scale-100 hover:scale-100" onClick={() => deleteAccount(idx, CBE, setCBE)}/>
                        </div>
                    )}
                    {
                    showAdd(CBE)&&
                        <li onClick={()=>setCBE([...CBE, ''])} className={`bg-gray-50 border border-gray-300 text-gray-900 cursor-pointer text-xl rounded-b-lg block w-full py-0.5 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}>+</li>
                    }
                </div>
                <div className="flex flex-col">
                    <img className="w-full rounded-lg rounded-b-none h-full dark:bg-white" src="/images/Bank_of_Abyssinia.png" alt="" />
                    {BOA.map((val, idx)=>
                        <div key={idx} className="relative">
                            <input type="number" aria-describedby="helper-text-explanation" value={val} onChange={(e)=>handleChange(e.target.value, idx, BOA, setBOA)} className="bg-gray-50 border no-spiner border-gray-300 outline-none text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 peer" placeholder="Account Number" />
                            <MdDelete className="absolute top-0 mr-1 right-0 h-full w-6 text-gray-900 dark:text-white hover:text-red-500 cursor-pointer duration-300 transform scale-0 peer-hover:scale-100 hover:scale-100" onClick={() => deleteAccount(idx, BOA, setBOA)}/>
                        </div>
                    )}
                    {
                    showAdd(BOA) &&
                        <li onClick={()=>setBOA([...BOA, ''])} className="bg-gray-50 border border-gray-300 text-gray-900 cursor-pointer text-lg rounded-b-lg block w-full py-1 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">+</li>
                    }
                </div>
                <div className="flex flex-col">
                    <img className="w-full rounded-lg rounded-b-none h-full dark:bg-white" src="/images/download.png" alt="" />
                    {awash.map((val, idx)=>
                    <div key={idx} className="relative">
                        <input type="number" aria-describedby="helper-text-explanation" value={val} onChange={(e)=>handleChange(e.target.value, idx, awash, setAwash)} className="bg-gray-50 border no-spiner border-gray-300 outline-none text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 peer" placeholder="Account Number" />
                        <MdDelete className="absolute top-0 mr-1 right-0 h-full w-6 text-gray-900 dark:text-white hover:text-red-500 cursor-pointer duration-300 transform scale-0 peer-hover:scale-100 hover:scale-100" onClick={() => deleteAccount(idx, awash, setAwash)}/>
                    </div>
                    )}
                    {
                    showAdd(awash) &&
                        <li onClick={()=>setAwash([...awash, ''])} className="bg-gray-50 border border-gray-300 text-gray-900 cursor-pointer text-lg rounded-b-lg block w-full py-1 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">+</li>
                    }
                </div>
                <div className="flex flex-col">
                    <img className="w-full rounded-lg rounded-b-none h-full dark:bg-white" src="/images/hijra.png" alt="" />
                    {hijra.map((val, idx)=>
                        <div key={idx} className="relative">
                            <input type="number" aria-describedby="helper-text-explanation" value={val} onChange={(e)=>handleChange(e.target.value, idx, hijra, setHijra)} className="bg-gray-50 border border-gray-300 no-spiner outline-none text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 peer" placeholder="Account Number" />
                            <MdDelete className="absolute top-0 mr-1 right-0 h-full w-6 text-gray-900 dark:text-white hover:text-red-500 cursor-pointer duration-300 transform scale-0 peer-hover:scale-100 hover:scale-100" onClick={() => deleteAccount(idx, hijra, setHijra)}/>
                        </div>
                    )}
                    {
                    showAdd(hijra) &&
                        <li onClick={()=>setHijra([...hijra, ''])} className="bg-gray-50 border border-gray-300 text-gray-900 cursor-pointer text-lg rounded-b-lg block w-full py-1 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">+</li>
                    }
                </div>
            </div>
    )
}