import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import StatusMessage from "../Alert/StatusMessage";
import { userProfileAPI } from "../../API/user/userAPI";

const ContentGenerationHistory = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: userProfileAPI,
    queryKey: ['profile']
  });

  const [selectedContent, setSelectedContent] = useState(null);

  const openModal = (content) => setSelectedContent(content);
  const closeModal = () => setSelectedContent(null);

  if (isLoading) {
    return <StatusMessage type='loading' message='Hold on! While loading...' />;
  }
  if (isError) {
    return <StatusMessage type='error' message={error?.response?.data?.message} />;
  }

  return (
    <div className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-6">
          Content Generation History
        </h2>
        <div className="bg-white shadow sm:rounded-md">
          {data?.user?.history?.length <= 0 ? (
            <p className="text-red-500 font-semibold text-lg text-center py-6">No history found</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {data?.user?.history?.map((item) => {
                const contentText = item?.content || "";
                const truncated = contentText.length > 200 ? contentText.slice(0, 200) + "..." : contentText;

                return (
                  <li key={item._id} className="px-4 py-4 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{truncated}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(item?.createdAt).toDateString()}</p>
                    </div>
                    {contentText.length > 200 && (
                      <button
                        onClick={() => openModal(contentText)}
                        className="text-blue-600 text-sm font-semibold hover:underline mt-2 sm:mt-0 sm:ml-4"
                      >
                        See more
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 overflow-y-auto max-h-[80vh] transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Full Content</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{selectedContent}</p>
            <button
              onClick={closeModal}
              className="mt-6 text-blue-600 hover:underline text-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerationHistory;
