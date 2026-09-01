import React, { useState, useEffect } from 'react';
import Cards from "../components/cards";
import axios from "axios";
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

function Kitchenss() {
  const [kitchens, setKitchens] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getKitchens = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/kitchen`);
        setKitchens(res.data);
      } catch (error) {
        console.error("Error fetching kitchen data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getKitchens();
  }, []);

  const filteredKitchens = kitchens.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location &&
        item.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 min-h-screen">
      <div className="pt-28 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-orange-600 bg-clip-text text-transparent mb-4">
          Discover Our Kitchens
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore our curated selection of professional kitchens and messes 
          where magic happens daily
        </p>

        <div className="relative flex justify-center my-12">
          <div className="w-full max-w-2xl bg-gradient-to-r from-green-400 to-orange-500 p-1 rounded-2xl shadow-xl">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl px-4 py-3">
              <input
                type="text"
                className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder-gray-400 dark:placeholder-gray-500 dark:text-white"
                placeholder="Search kitchens by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
              <div className="p-6 space-y-4 bg-white dark:bg-gray-800 rounded-b-2xl">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredKitchens.length > 0 ? (
            filteredKitchens.map((item) => (
              <div 
                key={item._id || item.name}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-2"
              >
                <div className="relative overflow-hidden rounded-t-2xl">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`${API_BASE_URL}/${item.images[0]}`}
                      alt={item.name}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-red-100 dark:from-gray-700 dark:to-gray-600 flex flex-col items-center justify-center gap-3">
                      <svg
                        className="w-12 h-12 text-orange-400 dark:text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {item.location ? (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {item.location}
                      </a>
                    ) : (
                      <span>Location details coming soon</span>
                    )}
                  </div>

                  <Link to={`/kitchen/${item._id}`}
                   className="inline-block w-full text-center bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
                    Explore Kitchen →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-24">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-24 h-24 mx-auto text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-6 mb-2">
                  No Kitchens Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms or check back later
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Kitchenss;
