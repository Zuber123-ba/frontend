import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from "../config";

function Login({ isOpen, onClose, onLoginSuccess }) {
  const navigate = useNavigate();
  const [isKitchenLogin, setIsKitchenLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const endpoint = isKitchenLogin 
        ? `${API_BASE_URL}/kitchen/login`
        : `${API_BASE_URL}/user/login`;

      const response = await axios.post(endpoint, {
        email: data.email,
        password: data.password
      });

      if (response.data) {
        const key = isKitchenLogin ? "KitchenOwner" : "Users";
        const userData = isKitchenLogin ? response.data.kitchen : response.data.user;
        
        localStorage.setItem(key, JSON.stringify(userData));
        toast.success(`Logged in successfully as ${isKitchenLogin ? "Kitchen" : "User"}`);
        reset();
        onLoginSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box relative max-w-md p-6 sm:p-8">
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm absolute right-4 top-4"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold mb-6 text-center">Welcome Back</h3>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            className={`btn flex-1 ${!isKitchenLogin ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setIsKitchenLogin(false)}
          >
            User Login
          </button>
          <button
            type="button"
            className={`btn flex-1 ${isKitchenLogin ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setIsKitchenLogin(true)}
          >
            Kitchen Login
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Email</span>
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              className={`input input-bordered input-lg w-full ${errors.email ? 'input-error' : ''}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <span className="text-error text-sm mt-1">{errors.email.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`input input-bordered input-lg w-full ${errors.password ? 'input-error' : ''}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 3,
                  message: "Password must be at least 3 characters"
                }
              })}
            />
            {errors.password && (
              <span className="text-error text-sm mt-1">{errors.password.message}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg w-full mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="text-center pt-4">
            <span className="text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="link link-primary font-semibold"
                onClick={onClose}
              >
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
      
      {/* Modal Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

export default Login;