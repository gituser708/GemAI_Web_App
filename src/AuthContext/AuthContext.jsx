import { createContext, useContext, useEffect, useState, } from "react";
import { checkAuthAPI } from "../API/user/userAPI";
import { useQuery } from '@tanstack/react-query';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthentiCated] = useState(false);

    //! make request using react-query
    const { isError, isLoading, data, isSuccess } = useQuery({
        queryFn: checkAuthAPI,
        queryKey: ['check-auth']
    });

    //! update the authenticatd user
    useEffect(() => {
        if (isSuccess) {
            setIsAuthentiCated(data);
        };
    }, [data, isSuccess]);

    //! update the user after login
    const login = () => {
        setIsAuthentiCated(true);
    };

    //! update the user after logout
    const logout = () => {
        setIsAuthentiCated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isError, isLoading, isSuccess, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

//! Custom Hook
export const useAuth = () => {
    return useContext(AuthContext);
};