import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const KitchenMenuView = () => {
  const { kitchenId } = useParams();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/kitchen/menu?kitchenId=${kitchenId}`);
        
        const menuData = response.data;

        // Ensure full week with default structure
        const completeMenu = DAYS_OF_WEEK.map(day => {
          const found = menuData.find(item => item.day === day);
          return found || { day, breakfast: "", lunch: "", dinner: "" };
        });

        setMenu(completeMenu);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError("Failed to load menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [kitchenId]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <section className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">Weekly Menu</h2>

        {loading ? (
          <div className="text-center text-gray-500 flex items-center justify-center py-8">
            <FiLoader className="animate-spin mr-2" />
            Loading menu...
          </div>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm md:text-base">
              <thead className="bg-blue-100 dark:bg-blue-800 text-gray-900 dark:text-white">
                <tr>
                  <th className="px-4 py-2">Day</th>
                  <th className="px-4 py-2">Breakfast</th>
                  <th className="px-4 py-2">Lunch</th>
                  <th className="px-4 py-2">Dinner</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 dark:text-gray-200">
                {menu.map((item) => (
                  <tr key={item.day} className="border-t border-gray-200">
                    <td className="px-4 py-2 font-medium">{item.day}</td>
                    <td className="px-4 py-2">{item.breakfast || "Not Specified"}</td>
                    <td className="px-4 py-2">{item.lunch || "Not Specified"}</td>
                    <td className="px-4 py-2">{item.dinner || "Not Specified"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default KitchenMenuView;
