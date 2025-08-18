import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { userProfileAPI } from '../../API/user/userAPI';
import StatusMessage from "../Alert/StatusMessage";

const Dashboard = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: userProfileAPI,
    queryKey: ['profile']
  });
  
  if (isLoading) {
    return <StatusMessage type='loading' message='Hold on! While loading...'/>
  };
  if (isError) {
    return <StatusMessage type='error' message={error?.response?.data?.message} />
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900 p-6">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-400">
        User Dashboard
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Profile Section */}
        <div className="bg-linear-to-bl from-violet-500 to-fuchsia-500
        p-6 rounded-lg shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-cyan-50 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-cyan-50 mb-1">
                Name
              </label>
              <p id="username" className=" rounded-md px-4 py-2 text-gray-900 font-bold">
                {data?.user?.username}
              </p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyan-50 mb-1">
                Email
              </label>
              <p id="email" className=" rounded-md px-4 py-2 text-gray-900 font-bold">
                {data?.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Credit Usage Section */}
        <div className="bg-linear-to-bl from-violet-500 to-fuchsia-500
        p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-cyan-50 mb-4">Credit Usage</h2>
          <div className="space-y-2 text-gray-900 font-bold">
            <p>Monthly Credit: <span className="font-semibold text-cyan-100">
              {data?.user?.monthlyRequestCount}</span></p>
            
            <p>Credit Used: <span className="font-semibold text-cyan-100">
              {data?.user?.apiRequestCount}</span></p>
            <p>Credit Remaining: <span className="font-semibold text-cyan-100">
               {data?.user?.monthlyRequestCount - data?.user?.apiRequestCount}
            </span></p>
            <p>Next Billing Date: <span className="font-semibold text-cyan-100">
              {data?.user?.nextBillingDate ?
                new Date(data?.user?.nextBillingDate).toDateString()
                : 'No billing date'
              }
            </span></p>
          </div>
        </div>

        {/* Payment and Plans Section */}
        <div className="bg-linear-to-bl from-violet-500 to-fuchsia-500
         p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-cyan-50 mb-4">Payment & Plans</h2>
          <p className="mb-4 text-gray-900 font-bold">Current Plan:
            <span className="font-bold text-cyan-100 ml-1">
            {data?.user?.subscriptionPlan}</span></p>
          <Link
            to="/plans"
            className="inline-block py-2 px-5 rounded-md text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upgrade Plan
          </Link>
        </div>

        {/* Trial Information Section */}
        <div className="bg-linear-to-bl from-violet-500 to-fuchsia-500
         p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-cyan-50 mb-4">Trial Information</h2>
          <p className="mb-2 text-gray-900 font-bold">Trial Status: <span
            className="font-semibold">
            {data?.user?.trialActive ? (
              <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-green-700 inset-ring inset-ring-green-600/20">
                Active</span>
            ) : <span className="rounded-md bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-800 inset-ring inset-ring-yellow-600/20">
              Inactive</span>
          }</span></p>
          <p className="mb-4 text-gray-900 font-bold">Expires on: <span
            className="font-semibold text-cyan-100">
            {new Date(data?.user?.trialExpires).toDateString()}</span></p>
          <Link
            to="/plans"
            className="inline-block py-2 px-5 rounded-md text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upgrade to Premium
          </Link>
        </div>

        {/* History Section */}
        <div className="bg-linear-to-bl from-violet-500 to-fuchsia-500
        p-6 rounded-xl shadow-lg hover:shadow-xl transition col-span-1 lg:col-span-2">
          <h2 className="text-2xl font-bold text-cyan-50 mb-6">Payment History</h2>
          {data?.user?.payments.length > 0 ? (
             <ul className="divide-y divide-gray-200">
              {data?.user?.payments.map((payment) => {
                return (
                <li key={payment._id} className="py-4 transition duration-150 ease-in-out">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="mb-2 sm:mb-0">
                        <p className="text-xl font-bold text-gray-900">
                          {payment?.subscriptionPlan} Plan</p>
                        <p className="text-lg font-semibold text-cyan-100">
                          {new Date(payment?.createdAt).toDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                        <p className={`text-sm font-semibold 
                          ${payment?.status === 'succeeded' ?
                            'rounded-md bg-green-50 px-2 py-1 text-xs font-bold text-red-700 inset-ring inset-ring-green-600/20'
                          : 'rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-red-600/10'
                          } 
                            `}>
                          {payment?.status}
                        </p>
                        <p className="text-sm text-cyan-100 font-semibold ml-4">{payment?.amount}</p>
                </div>
              </div>
            </li>
             )
           })}
          </ul>
         ) : <p>No Payment history!</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
