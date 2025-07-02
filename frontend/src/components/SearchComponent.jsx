import { useState } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

function SearchComponent() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  return (
    <div>
      <form className="max-w-md mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Houses by, description, location..."
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={(e) => {
              e.preventDefault();
              if (search !== '')
                navigate('houses?q='+search)
            }}
          >
            Search
          </button>
        </div>
      </form>

      <section className="wedo flex justify-center items-center my-10 gap-8">
        <div className="image w-[25%]">
          <img src="/images/hero-1.png" alt="" className="max-w-xs w-full h-auto" />
        </div>
        <div className="rent-landords w-[40%] flex justify-center ">
          <div>
            <h2 className="text-center text-3xl font-bold text-[#081E4A] dark:text-white">
              What We Do
            </h2>
            <h3 className="font-semibold text-2xl my-4 dark:text-white">
              We Simplify Your Rental Home Search
            </h3>
            <p className="text-xl font-normal ">
              Experience hassle-free rental home searching with our platform. We
              simplify the process by linking you directly to legit property
              managers by cutting ou the middleman
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SearchComponent;
