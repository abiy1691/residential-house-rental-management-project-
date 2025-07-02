import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AddBankAccounts } from "../components/AddBankAccounts";
import { editHouse } from "../api/owner";
import { toast } from "react-toastify";

const groupBy = (arr) => {
    return arr.reduce((res, val) => {
        const key = val.bankname 
        if (!res[key])
            res[key] = []
        res[key].push(val.accountnumber)
        return res
    }, {}
    )
}

// If you got time handle this states more cleverly
export const EditBankAccounts = () => {
    const {state} = useLocation();
    const banks = state.bankaccounts;

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

    const [CBE, setCBE] = useState([]);
    const [BOA, setBOA] = useState([]);
    const [awash, setAwash] = useState([]);
    const [hijra, setHijra] = useState([]);
    useEffect(() => {
        const b = groupBy(banks);
        setCBE(b['CBE'] || []);
        setBOA(b['BOA'] || []);
        setAwash(b['Awash'] || []);
        setHijra(b['Hijra'] || []);
    }, [state]);

    const onClick = () => {
        let bankData = []
        CBE.forEach((accountno) => {
            if (accountno.trim() === '')
                return
            bankData.push({bankname:'CBE', accountnumber:accountno.trim()})
        })
        BOA.forEach((accountno) => {
            if (accountno.trim() === '')
                return
            bankData.push({bankname:'BOA', accountnumber:accountno.trim()})
        })
        awash.forEach((accountno) => {
            if (accountno.trim() === '')
                return
            bankData.push({bankname:'Awash', accountnumber:accountno.trim()})
        })
        hijra.forEach((accountno) => {
            if (accountno.trim() === '')
                return
            bankData.push({bankname:'Hijra', accountnumber:accountno.trim()})
        })

        mutate({bankaccounts: bankData, houseid: state._id})
    }
    

    return (<div className="h-full flex-1 flex flex-col items-center overflow-scroll py-4">
        <AddBankAccounts CBE={CBE} setCBE={setCBE} BOA={BOA} setBOA={setBOA} awash={awash} setAwash={setAwash} hijra={hijra} setHijra={setHijra}/>
        <div className="flex gap-6 self-end mr-8">
            <Link to={'/owner/'+state._id} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-8 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Back</Link>
            <button type="button" onClick={onClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-8 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Edit bank address</button>
        </div>
    </div>
    )

}
