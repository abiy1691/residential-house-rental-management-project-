
import { useState } from "react";
import { MdMyLocation } from "react-icons/md";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";


const FindMe =({lat, lng}) => {
const map = useMap();
return <div className='absolute bottom-4 rounded-full p-1 z-[1000] cursor-pointer left-4 h-8 w-8 bg-gray-900 dark:bg-gray-700'>
    <MdMyLocation onClick={() => map.flyTo([lat, lng], 14)} className='h-full w-full text-gray-50 dark:text-white'/>
</div>
}

function HouseMap({lat, lng}) {

    return <MapContainer center={[lat || 9.0358287, lng || 38.7524127]} className="rounded-r-lg" zoom={13} style={{ height: '100%', width: '100%' , zIndex: 0}} >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat || 9.0358287, lng || 38.7524127]}>
                    <Popup>Houses location</Popup>
                </Marker>
                {(!lng || !lat)&&
                    <div className="absolute top-0 z-[1001] pointer-events-none bg-[#1c00007b] bottom-0 flex justify-center items-center left-0 right-0">
                        <p className="m-auto text-2xl text-white font-bold"> No map data available  </p>
                    </div>
                }
                <FindMe lat={lat} lng={lng}/>
            </MapContainer>
}

export default HouseMap