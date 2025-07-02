import { Link } from "react-router-dom";
import SearchComponent from "../components/SearchComponent";
import LatestHouses from "./LatestHouses";

function Home() {
  return (
    <>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-r from-blue-300 via-purple-200 to-pink-200 bg-[length:400%_400%]" style={{animation: 'gradientBG 15s ease infinite'}} />
      <style>{`
        @keyframes gradientBG {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      <div className="flex flex-col justify-center items-center">
        <div>
          <h1 className="text-[#081E4A] text-center text-3xl font-bold dark:text-white">
            Find Your Perfect Rental Home
          </h1>
        </div>
        <div>
          <p className="text-xl my-5">
            A Great Platform to Connect users Directly with Tenant and
            Discover Your Dream Home
          </p>
        </div>
      </div>
      <div className="search">
        <SearchComponent />
      </div>
      <div>
        <div className="flex flex-col justify-center items-center mx-auto">
          <h2 className="text-[#081E4A] font-bold my-5 text-3xl dark:text-white">
           Latest Listings
          </h2>
         <LatestHouses />
         </div>
        <div className="flex justify-end mr-10 my-5">
          <Link to='/houses' >
          <button className=" text-white bg-[#234B9A] rounded-2xl">
            Explore all
          </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
