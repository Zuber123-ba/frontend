import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from "axios";

function Kitchens() {
  const [kitchens, setKitchens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        const response = await axios.get("http://localhost:4000/kitchen");
        setKitchens(response.data);
      } catch (error) {
        console.error("Error fetching kitchen data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKitchens();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
    appendDots: dots => (
      <div className="custom-dots">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-3 h-3 bg-orange-300 rounded-full transition-all duration-300" />
    )
  };

  return (
    <div className="max-w-screen-2xl container mx-auto px-4 md:px-20">
      <div className="pt-28 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-4">
          Culinary Spaces
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover professional kitchens and cozy messes serving authentic flavors
        </p>
      </div>

      <div className="pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                <div className="mt-4 space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : kitchens.length > 0 ? (
          <>
            <Slider {...settings}>
              {kitchens.map((kitchen, index) => (
                <div key={index} className="px-4 group">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 p-1 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full flex flex-col">
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        {kitchen.images?.length > 0 ? (
                          <img
                            src={`http://localhost:4000/${kitchen.images[0]}`}
                            alt={kitchen.name}
                            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-gray-700 dark:to-gray-600 flex flex-col items-center justify-center gap-3">
                            <svg
                              className="w-16 h-16 text-orange-400 dark:text-orange-500"
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

                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        {kitchen.name}
                      </h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                        <svg
                          className="w-5 h-5 mr-2 flex-shrink-0"
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
                        <span>{kitchen.location || "Location not available"}</span>
                      </div>

                      <div className="flex items-center mt-auto">
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }, (_, starIndex) => (
                            <span
                              key={starIndex}
                              className={`text-2xl ${
                                starIndex < Math.round(kitchen.rating || 0)
                                  ? "text-amber-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            >
                              &#9733;
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          ({kitchen.rating?.toFixed(1) || '0.0'})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

            <div className="flex justify-center mt-12">
              <button
                onClick={() => navigate("/kitchen")}
                className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-300 flex items-center"
              >
                Explore All Kitchens
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
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
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-6">
              No Kitchens Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Check back later for updates
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Kitchens;