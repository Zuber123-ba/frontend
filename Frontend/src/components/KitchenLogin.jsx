import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const KitchenLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:4000/kitchen/login', formData);
  
      if (response.data && response.data.kitchen) {  // Fix here
        toast.success('Login successful');
        localStorage.setItem('KitchenOwner', JSON.stringify(response.data.kitchen)); // Fix here
        navigate('/kitchendashboard');
      } else {
        toast.error("Invalid response from server!");
      }
    } catch (error) {
      toast.error('Invalid credentials or user not found.');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Kitchen Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default KitchenLogin;
