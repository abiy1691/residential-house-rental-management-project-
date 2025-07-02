import React, { useState } from 'react'
import { getHouses } from '../api/house';
import { useQuery } from '@tanstack/react-query';
import { HouseAdv } from '../components/HouseAdv';
import { FilterByRoom } from '../components/FilterByRoom'
import { Link, useSearchParams } from 'react-router-dom';
import { FilterByPrice } from '../components/FilterByPrice';
import { FilterByArea } from '../components/FilterByArea';
import { FilterByType } from '../components/FilterByType';
import { FilterByLocation } from '../components/FilterByLocation';
import { FaDropbox } from 'react-icons/fa6';

const DEFAULT_TYPES = [
  {name:"Apartment", img:'apartment.png'}, 
  {name:"Condo", img:'condo.png'}, 
  {name:"Duplex", img:'duplex.png'}, 
  {name:"House", img:'house.png'}, 
  {name:"Mansion", img:'mansion.png'}, 
  {name:"Penthouse", img:'penthouse.png'}, 
  {name:"Studio", img:'studio-apartment.png'}, 
  {name:"Villa", img:'villa.png'}, 
  {name:"Bedsitter", img:'bedsitter.png'}, 
  {name:"Chalet", img:'chalet.png'}, 
  {name:"Farm House", img:'townhouse.png'}, 
  {name:"Building", img:'condo.png'}
];

function Houses() {
    const [searchParams, setSearchParams] = useSearchParams({});
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [signal, setSignal] = useState(false);

    const { data:datas, status, isFetching, error } = useQuery({
        queryKey: ['house', {
            minrooms: searchParams.get('minrooms'), 
            maxrooms: searchParams.get('maxrooms'),
            maxprice: searchParams.get('maxprice'),
            minprice: searchParams.get('minprice'),
            maxsize: searchParams.get('maxsize'),
            minsize: searchParams.get('minsize'),
            city: searchParams.get('city'),
            sub_city: searchParams.get('sub_city'),
            woreda: searchParams.get('woreda'),
            kebele: searchParams.get('kebele'),
            types: searchParams.getAll('types'),
            owner: searchParams.get('owner'),
            q: searchParams.get('q'),
            page: searchParams.get('page')
        }],
        placeholderData: (data) => data,
        queryFn: () => {
            const query = searchParams.toString();
            console.log(query)
            return getHouses(query)
        },
    });

    const searchHouse = () => {
        setSearchParams(prev => {
            if (search !== '') {
                prev.set('q', search);
            } else {
                prev.delete('q');
            }
            return prev;
        });
    }
    
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 3;

    if (!datas) return <div>Loading...</div>;

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Filters Sidebar - Hidden on mobile, shown on medium screens and up */}
            <div className='hidden md:flex md:flex-col md:w-64 lg:w-72 xl:w-80 p-2 overflow-y-auto bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'>
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 mb-3 dark:border-gray-600">
                    <svg className="w-5 h-5 p-1 pointer-events-none text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                    <input 
                        type="text" 
                        id="search" 
                        onChange={(e) => setSearch(e.target.value)} 
                        value={search} 
                        className="flex-1 p-2 text-sm text-gray-900 bg-gray-50 outline-none dark:bg-gray-700 dark:text-white" 
                        placeholder="Search house, ..."
                        onKeyPress={(e) => e.key === 'Enter' && searchHouse()}
                    />
                    <button 
                        onClick={searchHouse} 
                        className='p-2 bg-blue-500 text-white text-sm rounded-r-lg hover:bg-blue-600 transition-colors'
                    >
                        Search
                    </button>
                </div>
                <FilterByLocation signal={signal}/>
                <FilterByRoom signal={signal}/>
                <FilterByPrice signal={signal}/>
                <FilterByType />
                <FilterByArea signal={signal}/>
                <Link 
                    onClick={() => setSignal(!signal)} 
                    className='p-2 mt-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-600 text-center dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors' 
                    to='/houses'
                >
                    Clear all filters
                </Link>
            </div> 
            
            {/* Mobile filters toggle - Only shown on small screens */}
            <div className='md:hidden p-2 bg-gray-100 dark:bg-gray-700'>
                <button 
                    onClick={() => setSignal(!signal)} 
                    className='w-full p-2 bg-blue-500 text-white rounded-lg'
                >
                    {signal ? 'Hide Filters' : 'Show Filters'}
                </button>
                {signal && (
                    <div className='mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow'>
                        <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 mb-3 dark:border-gray-600">
                            <svg className="w-5 h-5 p-1 pointer-events-none text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                            <input 
                                type="text" 
                                id="search-mobile" 
                                onChange={(e) => setSearch(e.target.value)} 
                                value={search} 
                                className="flex-1 p-2 text-sm text-gray-900 bg-gray-50 outline-none dark:bg-gray-700 dark:text-white" 
                                placeholder="Search house, ..."
                                onKeyPress={(e) => e.key === 'Enter' && searchHouse()}
                            />
                            <button 
                                onClick={searchHouse} 
                                className='p-2 bg-blue-500 text-white text-sm rounded-r-lg hover:bg-blue-600 transition-colors'
                            >
                                Go
                            </button>
                        </div>
                        <FilterByLocation signal={signal}/>
                        <FilterByRoom signal={signal}/>
                        <FilterByPrice signal={signal}/>
                        <FilterByType />
                        <FilterByArea signal={signal}/>
                        <Link 
                            onClick={() => setSignal(!signal)} 
                            className='p-2 mt-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-600 text-center dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors block' 
                            to='/houses'
                        >
                            Clear all filters
                        </Link>
                    </div>
                )}
            </div>
            
            {/* Main Content */}
            <div className='flex-1 overflow-y-auto p-4'>
                {/* Property Type Scrollable Section */}
                <div className='w-full overflow-x-auto mb-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow'>
                    <div className='flex space-x-4 min-w-max'>
                        {DEFAULT_TYPES.map(({name, img}) => (
                            <label 
                                key={name}
                                htmlFor={name} 
                                className={`flex flex-col items-center p-2 cursor-pointer rounded-lg transition-colors ${searchParams.has('types', name.toLowerCase()) ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <img 
                                    src={`/images/${img}`} 
                                    className='w-10 h-10 object-contain' 
                                    alt={name} 
                                />
                                <span className='text-xs mt-1 text-center'>{name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                
                {/* Results Count */}
                <p className='mb-4 text-lg font-medium dark:text-white'>
                    {isFetching ? 'Loading...' : `${datas.total} results`}
                </p>
                    
                {/* Houses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {datas.data.length === 0 || status === 'error' ? (
                        <div className="col-span-full flex flex-col items-center py-10">
                            <FaDropbox className="w-20 h-20 text-gray-400 dark:text-gray-500" />
                            <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
                                No houses found!{' '}
                                <Link 
                                    onClick={() => setSignal(!signal)} 
                                    to='' 
                                    className='text-blue-500 hover:underline'
                                >
                                    Clear all filters and try again
                                </Link>
                            </p>
                        </div>
                    ) : (
                        datas.data.map((data, index) => {
                            const image = "http://localhost:4001/" + data.images[0];
                            return (
                                <HouseAdv key={index} image={image} {...data}/>
                            );
                        })
                    )}
                </div>
                
                {/* Pagination */}
                {datas.data.length > 0 && (
                    <div className="flex flex-col items-center mt-8">
                        <span className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                            Showing{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {1 + (page - 1) * limit}
                            </span>{' '}
                            to{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {Math.min(page * limit, datas?.total)}
                            </span>{' '}
                            of{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {datas?.total}
                            </span>{' '}
                            Entries
                        </span>
                        <div className="flex space-x-2">
                            {datas.prev && (
                                <button 
                                    onClick={() => setSearchParams((prev) => {
                                        prev.set('page', datas.prev);
                                        return prev;
                                    })} 
                                    className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Previous
                                </button>
                            )}
                            {datas.next && (
                                <button 
                                    onClick={() => setSearchParams((prev) => {
                                        prev.set('page', datas.next);
                                        return prev;
                                    })} 
                                    className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Houses;