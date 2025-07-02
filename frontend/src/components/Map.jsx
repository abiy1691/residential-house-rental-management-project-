import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import {toast} from 'react-toastify';
import {Tooltip} from '@mui/material';
import { MdMyLocation } from "react-icons/md";
import { useMutation } from '@tanstack/react-query';

const FlyToLocation = ({ position }) => {
  const map = useMap();
  map.flyTo(position, 14);
  return null;
};

const searchLocation = async (query) => {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${query}, Ethiopia&format=json&countrycodes=ET&limit=5`
  );
  return response.data
}


const FindMe =({setPosition, setMarkerPosition, setPlace}) => {
  const map = useMapEvents({
    click(e) {
      setMarkerPosition([e.latlng.lat, e.latlng.lng])
      setPosition([e.latlng.lat, e.latlng.lng])
      setPlace(null)
    },
    locationfound(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setMarkerPosition([e.latlng.lat, e.latlng.lng]);
      setPlace('Your current location')
    },
  });
  return <div className='absolute bottom-4 rounded-full p-1 z-[1000] cursor-pointer left-4 h-8 w-8 bg-gray-900 dark:bg-gray-700'>
    <MdMyLocation onClick={() => map.locate()} className='h-full w-full text-gray-50 dark:text-white'/>
  </div>
}

const MapComponent = ({markerPosition, setMarkerPosition}) => {
  markerPosition = markerPosition.includes(undefined) ? [9.0358287, 38.7524127]:markerPosition
  const [position, setPosition] = useState([9.0358287, 38.7524127]);
  const searchQuery = useRef(null);
  const [place, setPlace] = useState(null)
  const [results, setResults] = useState(null)
  const {mutate, status} = useMutation({
    mutationFn: searchLocation,
    onError: (error) => {
      console.log(error)
      toast.error('Error while searching')
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        changePosition(lat, lon, display_name);
        const dataSearch = data.map(({lat, lon, display_name})=> ({lat, lon, display_name}));
        setResults(dataSearch)
      } else {
        toast.error('Location not found');
      }
    }
  })

  const changePosition = (lat, lon, display_name) => {
    setPosition([parseFloat(lat), parseFloat(lon)]);
    setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
    setPlace(display_name)
  }

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      if (!searchQuery.current || searchQuery.current.value === '')
        return;
      mutate(searchQuery.current.value)
      
    } catch (error) {
      console.error('Error fetching location data:', error);
      alert('Error fetching location data');
    }
  };
  
  return (
    <div className='relative w-full'>
      <ul className="min-w-max absolute z-[1000] m-2 bottom-1 right-0 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {results && 
        results.map(({lat, lon, display_name}) =>
          <Tooltip title={display_name}>
            <li key={lat+lon} onClick={()=>changePosition(lat, lon, display_name)} className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600 cursor-pointer">{display_name.slice(0,45) + (display_name.length>45?' ...':'')}</li>
          </Tooltip>
        )}
      </ul>
      
      <MapContainer className='z-0 relative' center={markerPosition} zoom={13} style={{ height: '80vh', width: '100%' }}>        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

      <form className="max-w-md absolute z-[100000] top-0 right-0 m-2" onSubmit={handleSearch}>
          <input type="search" id="default-search" ref={searchQuery} className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Find places..." />
          <button type="submit" className="text-white absolute top-0 bottom-0 right-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm p-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {status === 'pending'?
              <svg aria-hidden="true" role="status" className="inline w-6 h-6 text-blue-400 dark:text-gray-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C69FF"/>
              </svg> :
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            }
          </button>
      </form>
      
        {markerPosition && (
          <Marker position={markerPosition}>
              {place && 
            <Popup>
              {place}
            </Popup>
              }
          </Marker>
        )}
        <FlyToLocation position={markerPosition} />
        <FindMe setPosition={setPosition} setMarkerPosition={setMarkerPosition} setPlace={setPlace}/>
      </MapContainer>
        
    </div>
  );
};

export default MapComponent;
