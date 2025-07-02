import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getHouses } from '../api/house';
import {HouseAdv} from '../components/HouseAdv'
import { Loader } from '../components/Loader';

function LatestHouses() {
    // Ensure datas is always an array
    const { data: datas, status } = useQuery({
        queryKey: ['house', 'latest'],
        queryFn: () => getHouses("limit=5")
    });

    if (status === 'pending')
        return <div className="w-full h-full flex justify-center align-center">
                    <Loader />
                </div>
    if (datas)
        return (
            <div className="grid gap-10 grid-cols-3 px-2">
                {datas.data.map((data, index) => {
                    const image = "http://localhost:4001/" + data.images[0];

                    return (
                        <HouseAdv key={index} image={image} {...data} latest/>
                    );
                })}
            </div>
        );
}

export default LatestHouses;
