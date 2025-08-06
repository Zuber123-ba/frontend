import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const KitchenSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    role: '',
    images: [],
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('location', formData.location);
    data.append('role', formData.role);

    formData.images.forEach((image, i) => {
      data.append('images', image);
    });

    try {
      const response = await axios.post('http://localhost:4000/kitchen/signup', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data) {
        alert('Kitchen signed up successfully!');
        navigate('/kitchenlogin'); // Navigate to Kitchen Login after signup
      }
    } catch (error) {
      alert('Error adding kitchen');
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Kitchen Signup</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Kitchen Name */}
            <div>
              <label className="block text-sm font-medium">Kitchen Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-primary"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email Address:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-primary"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-primary"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium">Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-primary"
                required
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-medium">Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-primary"
                required
              >
                <option value="" disabled>Select Role</option>
                <option value="kitchen_owner">Kitchen Owner</option>
              </select>
            </div>

            {/* Kitchen Photos */}
            <div>
              <label className="block text-sm font-medium">Kitchen Photos:</label>
              <input
                type="file"
                multiple
                name="images"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full p-2 border rounded-lg focus:ring-primary"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
            >
              Register your Kitchen
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default KitchenSignup;