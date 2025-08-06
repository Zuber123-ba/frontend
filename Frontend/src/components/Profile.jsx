import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import {
  FiMail, FiCalendar, FiPackage, FiSettings,
  FiClock, FiLogOut, FiStar, FiSearch
} from "react-icons/fi";

const planConfig = {
  basic: {
    primary: "bg-amber-600",
    secondary: "bg-amber-100",
    text: "text-amber-600",
    accent: "border-amber-500",
    hex: "#d97706"
  },
  silver: {
    primary: "bg-gray-600",
    secondary: "bg-gray-100",
    text: "text-gray-600",
    accent: "border-gray-600",
    hex: "#4b5563"
  },
  gold: {
    primary: "bg-yellow-500",
    secondary: "bg-yellow-100",
    text: "text-yellow-600",
    accent: "border-yellow-500",
    hex: "#eab308"
  },
  default: {
    primary: "bg-blue-600",
    secondary: "bg-blue-100",
    text: "text-blue-600",
    accent: "border-blue-600",
    hex: "#2563eb"
  },
};

const UPDATE_MEAL_COUNT_URL = "http://localhost:4000/user/updateuses";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [kitchen, setKitchen] = useState(null);
  const [kitchens, setKitchens] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredKitchens, setFilteredKitchens] = useState([]);
  const [recentKitchens, setRecentKitchens] = useState([]);
  const [count, setCount] = useState(0);
  const [qrData, setQrData] = useState("");
  const [selectedKitchen, setSelectedKitchen] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchKitchens = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/kitchen");
      setKitchens(res.data);
      setFilteredKitchens(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch kitchen data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("Users");
    const storedKitchen = localStorage.getItem("KitchenOwner");
    const storedRecent = JSON.parse(localStorage.getItem("RecentKitchens")) || [];

    if (storedKitchen) {
      try {
        const parsedKitchen = JSON.parse(storedKitchen);
        setKitchen(parsedKitchen);
      } catch {
        localStorage.removeItem("KitchenOwner");
        navigate("/");
      }
      setLoading(false);
    } else if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.plan) {
          toast.error("You don't have an active subscription. Please subscribe first.");
          parsedUser.remainingUses = 0;
          setQrData("");
        } else {
          setCount(parsedUser.remainingUses);
          setQrData(JSON.stringify({
            id: parsedUser._id,
            email: parsedUser.email,
            plan: parsedUser.plan,
            remainingUses: parsedUser.remainingUses,
          }));
        }
        setUser(parsedUser);
        localStorage.setItem("Users", JSON.stringify(parsedUser));
        fetchKitchens();
      } catch {
        localStorage.removeItem("Users");
        navigate("/");
      }
    } else {
      navigate("/");
    }

    setRecentKitchens(storedRecent);
  }, [navigate, fetchKitchens]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredKitchens(
        kitchens.filter(k =>
          k.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, kitchens]);

  const recordMealTransaction = async (parsed) => {
    try {
      const payload = {
        customerId: parsed.id,
        customerName: user.fullname,
        customerEmail: user.email,
        plan: parsed.plan,
        mealCount: 1,
        breakdown: {
          basic: parsed.plan.toLowerCase() === "basic" ? 1 : 0,
          silver: parsed.plan.toLowerCase() === "silver" ? 1 : 0,
          gold: parsed.plan.toLowerCase() === "gold" ? 1 : 0,
        }
      };
      await axios.post(
        `http://localhost:4000/kitchen/${selectedKitchen}/transactions`,
        payload
      );
    } catch {
      toast.error("Failed to record transaction.");
    }
  };

  const handleQrScan = async () => {
    if (!qrData || !selectedKitchen) {
      toast.error("Please select a kitchen first!");
      return;
    }

    try {
      const parsed = JSON.parse(qrData);
      if (!parsed.plan) {
        toast.error("Active subscription required!");
        return;
      }

      if (parsed.remainingUses > 0) {
        const res = await axios.post(UPDATE_MEAL_COUNT_URL, { userId: parsed.id });
        const newRemaining = res.data.remainingUses;

        setUser(prev => {
          const updated = { ...prev, remainingUses: newRemaining };
          localStorage.setItem("Users", JSON.stringify(updated));
          return updated;
        });
        setCount(newRemaining);
        setQrData(JSON.stringify({ ...parsed, remainingUses: newRemaining }));

        setRecentKitchens(prev => {
          const updated = [selectedKitchen, ...prev.filter(k => k !== selectedKitchen)].slice(0, 3);
          localStorage.setItem("RecentKitchens", JSON.stringify(updated));
          return updated;
        });

        await recordMealTransaction(parsed);
        toast.success(`Meal added to ${selectedKitchen}!`);
      } else {
        toast.error("No remaining meals! Please renew your plan.");
      }
    } catch {
      toast.error("Error processing meal use.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Users");
    localStorage.removeItem("KitchenOwner");
    toast.success("Logout successful");
    navigate("/");
  };

  const getUserInitials = name =>
    name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "";

  const renderPlanBadge = () => {
    if (!user?.plan) return null;
    const cfg = planConfig[user.plan.toLowerCase()] || planConfig.default;
    return (
      <span className={`${cfg.primary} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
        {user.plan}
        {user.plan.toLowerCase() === "gold" && <FiStar className="text-yellow-300" />}
      </span>
    );
  };

  const renderKitchenProfile = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">
                {getUserInitials(kitchen?.name)}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{kitchen?.name}</h2>
            <p className="text-gray-600 mb-4 flex items-center">
              <FiMail className="mr-2 text-gray-400" />
              {kitchen?.email}
            </p>
            <button
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={() => navigate("/kitchendashboard")}
            >
              View Dashboard
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center text-gray-600">
              <FiCalendar className="mr-2 text-gray-400" />
              <span>Joined: {new Date(kitchen?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="flex items-center text-lg font-semibold mb-4">
            <FiSettings className="mr-2 text-gray-500" />
            Account Settings
          </h3>
          <button
            className="w-full flex items-center justify-center py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            onClick={handleLogout}
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Kitchen Management</h3>
          <button
            onClick={() => navigate("/kitchenmenu", { state: { kitchenId: kitchen._id } })}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Manage Menu
          </button>
        </div>
      </div>
    </div>
  );

  const renderUserProfile = () => {
    const cfg = planConfig[user.plan?.toLowerCase()] || planConfig.default;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`bg-white rounded-xl shadow-lg p-6 border-t-4 ${cfg.accent}`}>
            <div className="flex flex-col items-center">
              <div className={`w-24 h-24 ${cfg.secondary} rounded-full flex items-center justify-center mb-4`}>
                <span className={`text-2xl font-bold ${cfg.text}`}>
                  {getUserInitials(user.fullname)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                {user.fullname}
                {renderPlanBadge()}
              </h2>
              <p className="text-gray-600 mb-4 flex items-center">
                <FiMail className="mr-2 text-gray-400" />
                {user.email}
              </p>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-2 text-gray-400" />
                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiPackage className="mr-2 text-gray-400" />
                <span>Status: {user.plan ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <FiSettings className="mr-2 text-gray-500" />
              Account Settings
            </h3>
            <button
              className="w-full flex items-center justify-center py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              onClick={handleLogout}
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Details */}
          {user.plan && (
            <div className={`bg-white rounded-xl shadow-lg p-6 border-t-4 ${cfg.accent}`}>
              <h3 className="text-lg font-semibold mb-4">Subscription Details</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className={`${cfg.primary} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${(count / 40) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 ${cfg.secondary} rounded-lg`}>
                  <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                  <p className={`text-xl font-semibold ${cfg.text}`}>{user.plan}</p>
                </div>
                <div className={`p-4 ${cfg.secondary} rounded-lg`}>
                  <p className="text-sm text-gray-600 mb-1">Remaining Meals</p>
                  <p className={`text-xl font-semibold ${count > 0 ? "text-green-600" : "text-red-600"}`}>
                    {count > 0 ? `${count} meals` : "EXPIRED"}
                  </p>
                </div>
              </div>
              {count <= 0 && (
                <button
                  className={`w-full py-3 ${cfg.primary} hover:opacity-90 text-white rounded-lg font-semibold`}
                  onClick={() => navigate("/Membership")}
                >
                  Renew Your Plan
                </button>
              )}
            </div>
          )}

          {/* QR Code Section */}
          {user.plan && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiStar className="mr-2" /> Meal QR Code
              </h3>
              <div className="text-center">
                {qrData ? (
                  <div className="p-4 bg-gray-50 rounded-lg inline-block">
                    <QRCode
                      value={qrData}
                      size={196}
                      fgColor={cfg.hex}
                    />
                    <p className="mt-3 text-sm text-gray-500">
                      Valid at {selectedKitchen || "any kitchen"}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">QR code unavailable</p>
                )}
              </div>
            </div>
          )}

          {/* Kitchen Selection Section */}
          {user.plan && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiSearch className="mr-2" /> Find Kitchens
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 pl-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Search kitchens..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-4 text-gray-400" />
                </div>
                <div className="max-h-60 overflow-y-auto border rounded-lg">
                  {filteredKitchens.length > 0 ? filteredKitchens.map(k => (
                    <button
                      key={k._id}
                      onClick={() => setSelectedKitchen(k._id)}
                      className={`w-full p-3 text-left hover:bg-blue-50 ${selectedKitchen === k._id ? "bg-blue-100" : ""}`}
                    >
                      {k.name}
                    </button>
                  )) : (
                    <div className="p-3 text-gray-500">No kitchens found</div>
                  )}
                </div>
                <button
                  onClick={handleQrScan}
                  disabled={!selectedKitchen}
                  className={`w-full py-3 ${cfg.primary} hover:opacity-90 text-white rounded-lg font-semibold`}
                >
                  {selectedKitchen ? `Use Meal at ${kitchens.find(k => k._id === selectedKitchen)?.name}` : "Select a Kitchen"}
                </button>
                {recentKitchens.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Recent Kitchens:</h4>
                    <div className="flex flex-wrap gap-2">
                      {recentKitchens.map(id => (
                        <button
                          key={id}
                          onClick={() => setSelectedKitchen(id)}
                          className={`px-4 py-2 ${cfg.secondary} rounded-full transition-colors text-sm ${cfg.text}`}
                        >
                          {kitchens.find(k => k._id === id)?.name || id}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        {user ? renderUserProfile()
          : kitchen ? renderKitchenProfile()
          : (
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              {loading ? <div className="text-blue-600">Loading...</div> : <div className="text-gray-500">No data found</div>}
            </div>
          )
        }
      </main>
    </div>
  );
};

export default Profile;