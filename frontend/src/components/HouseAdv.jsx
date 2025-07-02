import { Link } from "react-router-dom"

export const HouseAdv = ({image, house_type, address, rent_amount, no_of_rooms, no_of_bath_rooms, width, length, owner, latest, _id}) => {
    
    
    return (
        <Link to={'/houses/'+_id} className={"container border rounded-lg flex flex-col max-h-[500px] dark:text-white min-h-[500px] "+(latest && 'min-w-80')}>
            <div className="flex-1 h-1">
              <img src={image} className="min-h-full max-h-full min-w-full max-w-full rounded-t-lg" alt="home" />
            </div>
            <div className="p-2">
              <h3 className="mx-2 text-[18px] font-bold mb-1">
                {no_of_rooms} room {house_type.toUpperCase()} in {address.city}
              </h3>
              <h3>
                <span className="mx-2 text-[15px] font-semibold">Price:</span>
                <span className="font-semibold">{rent_amount} ETB</span>
              </h3>
              <h3>
                <span className="mx-2 text-[15px] font-semibold">Bathrooms:</span>
                <span className="font-semibold">{no_of_bath_rooms}</span>
              </h3>
              <h3>
                <span className="mx-2 text-[15px] font-semibold">Location:</span>
                <span>{address.city}, {address.sub_city}</span>
              </h3>
              {address.woreda &&
              <h3>
                <span className="mx-2 text-[15px] font-semibold">Woreda:</span>
                <span> {address.woreda} </span>
              </h3>
              }
              <h3>
                <span className="mx-2 text-[15px] font-semibold">Area:</span>
                <span className="font-semibold">{width * length} m<sup>2</sup></span>
              </h3>
              <h3>
                <span className="mx-2 text-[15px] font-semibold">By:</span>
                <span className="font-semibold">{owner.firstname} {owner.lastname}</span>
              </h3>
            </div>
        </Link>
    )
} 