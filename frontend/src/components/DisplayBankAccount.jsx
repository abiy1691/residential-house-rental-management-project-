import React, { useMemo } from "react";


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

export const DisplayBankAccount = ({bankaccounts}) => {


    const banks = useMemo(() => groupBy(bankaccounts)
    , [bankaccounts])
    return <div className="grid grid-cols-2 gap-4">
        {
            Object.keys(banks).map((bank, idx) => <div>
                <h2 key={idx} className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{bank}</h2>
                <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                    {banks[bank].map((accounts, idx) => 
                    <li key={idx}>
                        {accounts}
                    </li>
                    )
                    }
                </ul>
            </div>
            )
        }
            

    </div> 
    
}