import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { AIAPI } from "../../API/AI/AIAPI";
import { useQuery, useMutation } from '@tanstack/react-query';
import StatusMessage from "../Alert/StatusMessage";
import { userProfileAPI } from "../../API/user/userAPI";
import { RiGeminiFill } from "react-icons/ri";

const AIAssistant = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: userProfileAPI,
    queryKey: ['profile']
  });

  const mutation = useMutation({
    mutationFn: AIAPI,
    mutationKey: ['generate-content'],
  });

  // Formik setup for handling form data
  const formik = useFormik({
    initialValues: {
      prompt: "",
      tone: "",
      category: "",
    },
    validationSchema: Yup.object({
      prompt: Yup.string().required("A prompt is required"),
      tone: Yup.string(),
      category: Yup.string()
    }),
    onSubmit: (values) => {
      // Send all form data to AIAPI
      mutation.mutate({
        prompt: `Generate content for "${values.prompt}" in a ${values.tone || 'neutral'} tone about ${values.category || 'general'}`
      });
    },
  });

  if (isLoading) {
    return <StatusMessage type='loading' message='Hold on! While loading...' />;
  }
  if (isError) {
    return <StatusMessage type='error' message={error?.response?.data?.message} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-blue-950 flex justify-center items-center p-5">
      <div className="text-amber-50 overflow-hidden max-w-3xl w-full p-5">
        <h2 className="text-3xl font-bold text-shadow-fuchsia-100 mb-6 text-center">
          Hey, {data?.user?.username} how can I assist you today!
        </h2>

              {mutation.isPending && (
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-x-3 animate-bounce text-gray-700 font-semibold text-2xl">
            <RiGeminiFill size={25} color="red" />
            <span>Generating...</span>
          </div>
        </div>
      )}


        {mutation.isError && (
          <p className="text-red-500 font-semibold text-2xl text-center">
            {mutation?.error?.response?.data?.error || 'Error generating content'}!
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4">
        <span className="text-sm font-semibold bg-green-200 text-gray-900 px-3 py-1 rounded-full">
          Plan: {data?.user?.subscriptionPlan}
        </span>
        <span className="text-sm font-semibold bg-green-200 text-gray-900 px-3 py-1 rounded-full">
          Credit: {data?.user?.apiRequestCount} / {data?.user?.monthlyRequestCount}
        </span>
      </div>


        <form
          onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Prompt input field */}
          <div>
            <input
              id="prompt"
              type="text"
              {...formik.getFieldProps("prompt")}
              className=" font-bold border-2 border-b-blue-950 border-t-blue-950 px-5 py-3 mt-5 w-full shadow-xl rounded-3xl outline-0"
              placeholder="Enter a topic or idea"
              autoComplete="off"
            />
            
            {formik.touched.prompt && formik.errors.prompt && (
              <div className="text-red-500 mt-1">{formik.errors.prompt}</div>)}
          </div>

          <div className="text-gray-500 text-center m-3 p-3">
            <span>Write a content on AI,</span> 
            <span className="ml-5">Summarize somethingh for you</span>
          </div>


          {/* Submit button */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Content
          </button>

          {/* Link to view history */}
          <Link to="/history">View history</Link>
        </form>

        {/* Display generated content */}
        {mutation.isSuccess && mutation.data?.content && (
          <div className="mt-6 p-5">
            <h3 className="text-lg font-semibold mb-2">Generated Content:</h3>
            <p className="text-shadow-violet-300 text-base/8 font-medium">{mutation.data.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
