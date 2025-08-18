import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../Alert/StatusMessage";
import { useMutation } from '@tanstack/react-query';
import { googleLoginAPI, loginAPI } from '../../API/user/userAPI';
import { useAuth } from '../../AuthContext/AuthContext';
import {FaGoogle} from 'react-icons/fa';
import { signInWithGoogle } from "../../utils/oAuth";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const { isAuthenticated, login } = useAuth();

  const navigate = useNavigate();

  //! redirect if a user is loggedin
  useEffect(() => { 
    if (isAuthenticated) {
      navigate('/dashboard');
    };
  }, [isAuthenticated]);
  
  const mutation = useMutation({
    mutationFn: loginAPI,
    mutationKey: ['login']
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    },
  });

  //!update isAuthenticatd and page and redirect contrll for user flow
  useEffect(() => {
    if (mutation.isSuccess) {
      login();
    }
  }, [mutation.isSuccess]);

  //! handle google login
  const googleMutation = useMutation({
    mutationFn: googleLoginAPI,
    mutationKey: ['google-auth']
  });
  const [error, setError] = useState("");
  
  const handleGoogleSignIn = async () => {
  setError("");
  try {
    const { user, error: authError } = await signInWithGoogle();
    if (authError) {
      setError(authError);
      return;
    }

    if (user) {
      // ✅ Get Firebase ID token
      const idToken = await user.getIdToken();

      // ✅ Call backend with React Query mutation
      googleMutation.mutate(idToken, {
        onSuccess: () => {
          login(); // update your AuthContext
          navigate("/dashboard");
        },
        onError: (err) => {
          setError(err.response?.data?.message || "Google login failed");
        }
      });
    }
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 m-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Login to Your Account
        </h2>

         {mutation.isPending && (
        <StatusMessage type='loading' message='Please hold on, while loading...' />
        )}
        
      {mutation.isError && (
        <StatusMessage type='error' message={mutation?.error?.response?.data?.message} />
        )}
        
      {mutation.isSuccess && (
        <StatusMessage type='success' message='Successfully Logged in' />
        )}

        {googleMutation.isPending && (
          <StatusMessage type="loading" message="Signing in with Google..." />
        )}

        {googleMutation.isError && (
          <StatusMessage type="error" message={googleMutation?.error?.message} />
        )}

        {googleMutation.isSuccess && (
          <StatusMessage type="success" message="Login Successful" />
        )}


        {/* Form for login */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email input field */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-bold shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 mt-1">{formik.errors.email}</div>
            )}
          </div>

          {/* Password input field */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Your Password
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-bold shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 mt-1">{formik.errors.password}</div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Don't have an account? Register
              </Link>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
             hover:scale-105 delay-150 duration-300 ease-in-out hover:-translate-y-1">
            Sign in
          </button>

          <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2 
                      border bg-indigo-600 text-white rounded-md
                      transition-all duration-200 transform hover:-translate-y-0.5 font-medium">
                    <FaGoogle className="w-5 h-5 text-white dark:text-white" />
                    Sign in with Google
                  </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
