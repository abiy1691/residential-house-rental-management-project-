
export const HouseCard = ({images, housenumber, requests, onClick, setRequests, req}) => {
    const solved = requests.filter((req) => req.status)

    return (
    <div className="max-w-fit h-96 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
        
        <img className="rounded-t-lg min-w-full object-fit max-w-full min-h-1 grow" src={'http://localhost:4001/'+images} alt="" />
        
        <div className="p-5">
            <a href="#">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">House no: {housenumber}</h5>
            </a>
            {req?
                <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">Total:  {requests.length}</p>
                :
                <div className="flex justify-between">
                    <div>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">Solved</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{solved.length}</p>
                    </div>
                    <div>
                        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">Unsolved</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{requests.length - solved.length}</p>
                    </div>
                </div>
            }
            <button onClick={()=>{setRequests(requests); onClick(true)}} className="inline-flex items-center px-3 py-2 text-sm text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Show all
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </button>
        </div>
    </div>)
}
