import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../Alert/StatusMessage";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { registerAPI } from "../../API/user/userAPI";
import { useAuth } from "../../AuthContext/AuthContext";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required!"),
  email: Yup.string()
    .email('Enter a valid email!')
    .required('Email is required!'),
  password: Yup.string()
    .required('Password is required')
    .min(5, 'Set at least 5 charecter password!')
    .max(10, 'Mamimum 10 charecter password allowed!'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Password must match!')
    .required('Confirm password is required!'),
});

const Registration = () => {
  const { isAuthenticated, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //! redirect if a user is loggedin
    useEffect(() => { 
      if (isAuthenticated) {
        navigate('/dashboard');
      };
    }, [isAuthenticated]);

  const mutation = useMutation({
    mutationFn: registerAPI,
    mutationKey: ['register']
  });

  //! Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
      confirmPassword: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
      setTimeout(() => {
        navigate("/login"); 
       }, 3000);
    },
  });

  return (
    <React.Fragment>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg shadow-x1 p-8 m-4
      transition-shadow duration-300 ease-in-out">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Create an account to get free access for 3 days. No credit card
          required.
        </p>

      {mutation.isPending && (
        <StatusMessage type='loading' message='Please hold on, while loading...' />
      )}
      {mutation.isError && (
        <StatusMessage type='error' message={mutation?.error?.response?.data?.message} />
      )}
      {mutation.isSuccess && (
        <StatusMessage type='success' message='Successfully Registered' />
      )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Username input field */}
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              {...formik.getFieldProps("username")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-bold shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500" 
              placeholder="John Doe"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 mt-1">{formik.errors.username}</div>
            )}
          </div>

          {/* Email input field */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-bold shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 mt-1">{formik.errors.email}</div>
            )}
          </div>

         {/* Password input field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
               Set Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                id="password"
              placeholder="Set a password between 5 to 10 charecter"
                  {...formik.getFieldProps("password")}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md font-bold text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />

                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-indigo-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
            </div>
            
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 mt-1">{formik.errors.password}</div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
            placeholder="Confirm your password"
              {...formik.getFieldProps("confirmPassword")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-bold text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="text-red-500 mt-1">{formik.errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md
            shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 
            focus:outline-none focus:ring-2 focus:ring-offset-2 delay-150 duration-300 ease-in-out hover:-translate-y-1">              
            Register
          </button>
        </form>
        <div className="text-sm mt-2">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
      </div>
      </React.Fragment>
  );
};

export default Registration;
