import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit, FiSave, FiX, FiLoader } from "react-icons/fi";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function KitchenMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const kitchenId = location.state?.kitchenId;

  const [menu, setMenu] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchMenu = async () => {
    if (!kitchenId) {
      toast.error("No kitchen ID found");
      navigate("/"); // redirect if no kitchen ID
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`https://khanakhazana-4wqp.onrender.com/kitchen/menu?kitchenId=${kitchenId}`);

      const fullMenu = DAYS_OF_WEEK.map((day) => {
        const apiData = response.data.find((item) => item.day === day);
        return apiData || { day, breakfast: "", lunch: "", dinner: "", _id: `temp-${day}` };
      });

      setMenu(fullMenu);
    } catch (error) {
      toast.error("Failed to load menu");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [kitchenId]);

  const handleMenuChange = (dayIndex, field, value) => {
    setMenu((prev) =>
      prev.map((item, idx) => (idx === dayIndex ? { ...item, [field]: value } : item))
    );
  };

  const saveMenu = async () => {
    try {
      setSaving(true);

      const menuToSave = menu.map((item) => ({
        kitchenId,
        day: item.day,
        breakfast: item.breakfast || "",
        lunch: item.lunch || "",
        dinner: item.dinner || "",
        _id: item._id?.startsWith("temp-") ? undefined : item._id,
      }));

      const { data } = await axios.put(
        `http://localhost:4000/kitchen/menu`,
        { kitchenId, menu: menuToSave },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.msg === "Menu updated successfully") {
        toast.success("Menu updated!");
        setEditMode(false);
        fetchMenu();
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save menu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 font-poppins">
      <section className="text-center pt-24 pb-16 bg-gradient-to-br from-blue-500 to-amber-600 text-white">
        <h1 className="text-4xl font-bold">Weekly Menu Management</h1>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Weekly Menu Editor</h2>
            <div className="flex gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={saveMenu}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    {saving ? <FiLoader className="animate-spin" /> : <FiSave />} Save
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      fetchMenu();
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    <FiX /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <FiEdit /> Edit Menu
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : (
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-orange-100">
                <tr>
                  <th className="px-4 py-2">Day</th>
                  <th className="px-4 py-2">Breakfast</th>
                  <th className="px-4 py-2">Lunch</th>
                  <th className="px-4 py-2">Dinner</th>
                </tr>
              </thead>
              <tbody>
                {menu.map((dayMenu, index) => (
                  <tr key={dayMenu._id}>
                    <td className="px-4 py-2">{dayMenu.day}</td>
                    {["breakfast", "lunch", "dinner"].map((meal) => (
                      <td key={meal} className="px-4 py-2">
                        <input
                          type="text"
                          value={dayMenu[meal]}
                          onChange={(e) => handleMenuChange(index, meal, e.target.value)}
                          className="w-full border rounded px-2 py-1"
                          disabled={!editMode}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

export default KitchenMenu;
