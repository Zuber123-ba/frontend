import React from 'react';
import { useForm } from "react-hook-form";
import Login from './Login';
import toast from 'react-hot-toast';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password
    };

    await axios.post("http://localhost:4000/user/signup", userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Signed in successfully");
          navigate("/");
        }

        localStorage.setItem("Users", JSON.stringify(res.data.user));
      })
      .catch((err) => {
        if (err.response) {
          console.log(err);
          toast.error("Error: " + err.response.data.message);
        }
      });
  };

  return (
    <div className="flex flex-col min-h-screen dark:text-white">
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl border border-gray-300 shadow-md p-6 rounded-md bg-white">
          <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
            Signup
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                {...register("fullname", { required: "Full name is required" })}
              />
              {errors.fullname && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email address"
                  }
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
              <button
                type="submit"
                className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
              >
                Register
              </button>
              <p className="text-sm text-center sm:text-base text-gray-700">
                Already have an account?{" "}
                <button
                  type="button"
                  className="underline text-orange-500"
                  onClick={() => document.getElementById("my_modal_3").showModal()}
                >
                  Login
                </button>
                <Login />
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
