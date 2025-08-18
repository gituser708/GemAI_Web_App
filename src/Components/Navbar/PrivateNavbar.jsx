import { Fragment, useEffect, useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { FiLogOut } from "react-icons/fi";
import { RiGeminiFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logoutAPI, userProfileAPI } from "../../API/user/userAPI";
import { logoutUser } from '../../utils/oAuth';
import { useAuth } from "../../AuthContext/AuthContext";
import { FaCircleUser } from "react-icons/fa6";
import StatusMessage from "../Alert/StatusMessage";


const navigation = [
  { name: "Your Dashboard", href: "/dashboard", current: true },
  { name: "Pricing", href: "/plans", current: true },
];

export default function PrivateNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const mutation = useMutation({
    mutationFn: logoutAPI,
    mutationKey: ["logout"],
  });

  const {isLoading,isError,data,error} = useQuery({
    queryFn: userProfileAPI,
    queryKey: ['profile']
  });

  if (isLoading) {
    return <StatusMessage type='loading' message='Hold on! While loading...'/>
  };
  if (isError) {
    return <StatusMessage type='error' message={error?.response?.data?.message} />
  };
  

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); 
    try {
      await mutation.mutateAsync();
      await logoutUser();
      logout();
      navigate('/');
    } catch (error) {
      console.log('logout faild!', error);
    } finally {
      setIsLoggingOut(false);
    };
  };

  return (
    <Disclosure as="nav" className="bg-gray-950">
      {({ open }) => {
        useEffect(() => {
          setMenuOpen(open)
        }, [open]);
        
        return (
          <>
            {/* Top Bar */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between items-center">
                {/* Mobile Top Bar: Logo Left, Menu Right */}
                <div className="flex w-full items-center justify-between md:hidden">
                  {/* Logo */}
                  <Link to="/" className="flex items-center gap-x-2 text-white">
                    <RiGeminiFill className="h-6 w-6 text-red-500" />
                    <span className="text-lg font-semibold tracking-tight">GemAI</span>
                  </Link>

                  {/* Menu Icon */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    {menuOpen ? (
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex md:items-center md:gap-x-4">
                  {/* Logo */}
                  <Link to="/" className="flex items-center gap-x-2 text-white">
                    <RiGeminiFill className="h-6 w-6 md:h-7 md:w-7 text-red-500" />
                    <span className="text-base md:text-3xl font-semibold tracking-tight">GemAI</span>
                  </Link>

                  {/* Navigation */}
                  <div className="ml-6 flex items-center space-x-4 font-bold">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          item.current
                            ? "bg-indigo-500 text-white font-bold"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white font-bold"
                        } rounded-md px-3 py-2 text-sm font-medium`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-x-3">
                  
                  <Link
                    to="/generate-content"
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-gradient-to-bl from-violet-500 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-white shadow hover:scale-105 duration-100"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Generate Content
                  </Link>

                  {!data?.user?.profileImage
                    ? 
                    <span className="inline-block ml-5 mr-5">
                      <FaCircleUser color="white" size={33} />
                    </span>
                    : 
                   <img
          alt=""
          src= {data?.user?.profileImage}
          className="inline-block size-10 ml-5 mr-5 rounded-full ring-2 ring-white outline -outline-offset-1 outline-black/5"
        />}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow hover:scale-105 duration-100"
                  >
                    {isLoggingOut ? (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    ) : (
                      <FiLogOut className="h-5 w-5" />
                    )}
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            <Transition
              show={menuOpen}
              enter="transition ease-out duration-300"
              enterFrom="-translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transition ease-in duration-200"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="-translate-x-full opacity-0"
            >
              <Disclosure.Panel className="md:hidden fixed inset-0 z-40 bg-gray-950 text-white overflow-y-auto backdrop-blur-sm">
                <div className="px-6 py-4 sm:max-w-sm">
                  {/* Header: Logo + Close */}
                  <div className="flex items-center justify-between mb-4">
                    <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-x-2 text-white">
                      <RiGeminiFill className="h-6 w-6 text-red-500" />
                      <span className="text-lg font-semibold tracking-tight">GemAI</span>
                    </Link>
                    <Disclosure.Button
                      className="rounded-md p-2.5 text-gray-400"
                      onClick={() => setMenuOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </Disclosure.Button>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex flex-col gap-y-7 mb-4 mt-10">
                    {navigation.map((item) => (
                      <Disclosure.Button key={item.name} as={Fragment}>
                        <Link
                          to={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`${
                            item.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          } block rounded-md px-4 py-2 text-base font-medium`}
                        >
                          {item.name}
                        </Link>
                      </Disclosure.Button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-y-7">
                    <Disclosure.Button as={Fragment}>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/generate-content");
                        }}
                        className="block mt-5 w-full text-center rounded-md bg-gradient-to-bl from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-400"
                      >
                        Generate Content
                      </button>
                    </Disclosure.Button>

                    <Disclosure.Button as={Fragment}>
                      <button
                        onClick={async () => {
                          setMenuOpen(false);
                          await handleLogout();
                        }}
                        disabled={isLoggingOut}
                        className="block w-full text-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-400"
                      >
                        {isLoggingOut ? (
                          <svg className="animate-spin h-5 w-5 mx-auto text-white" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                        ) : (
                          "Sign Out"
                        )}
                      </button>
                    </Disclosure.Button>
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        );
      }}
    </Disclosure>
  );
};
