import React from "react";

export const HouseProgress = ({idx}) => {
    return (
        <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
            <li className="flex items-center text-blue-600 dark:text-blue-500 space-x-2.5 rtl:space-x-reverse">
                <span className="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                    1
                </span>
                <span>
                    <h3 className="font-medium leading-tight">House Information</h3>
                    <p className="text-sm">General house informations here</p>
                </span>
            </li>
            <li className={"flex items-center space-x-2.5 rtl:space-x-reverse" + (idx>0?'text-blue-600 dark:text-blue-500':'text-gray-500 dark:text-gray-400')}>
                <span className={"flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0  "+ (idx>0&&'dark:border-blue-500 border-blue-600') }>
                    2
                </span>
                <span>
                    <h3 className="font-medium leading-tight">Address Information</h3>
                    <p className="text-sm">Your house's detail address informations</p>
                </span>
            </li>
            <li className={"flex items-center space-x-2.5 rtl:space-x-reverse" + (idx>1?'text-blue-600 dark:text-blue-500':'text-gray-500 dark:text-gray-400')}>
                <span className={"flex items-center justify-center w-8 h-8 border rounded-full border-gray-500 shrink-0 " + (idx>1&&'dark:border-blue-500 border-blue-600')}>
                    3
                </span>
                <span>
                    <h3 className="font-medium leading-tight">Bank Accounts</h3>
                    <p className="text-sm">The bank accounts in which you want to reciece your payment for this house</p>
                </span>
            </li>
        </ol>
    )
}