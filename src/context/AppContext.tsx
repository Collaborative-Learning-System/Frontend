import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleLogging } from "../services/LoggingService";

interface AppContextType {
  userData: User | null;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  getUserData: () => Promise<void>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
}

interface User {
  userId: string;
  fullName: string;
  email: string;
  bio: string;
}

export const AppContext = createContext<AppContextType>({
  userData: null,
  setUserData: () => {},
  getUserData: async () => {},
  userId: "",
  setUserId: () => {},
  logout: () => {},
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [userData, setUserData] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );
  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/auth/get-user-data/${userId}`
      );
      if (data.success) {
        setUserData(data.data);
      } else {
        toast.error("Please login again to continue");
        navigate("/auth");
        logout();
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await axios.post(`${backendUrl}/auth/refresh-token`);
          getUserData();
        } catch (error) {
          navigate("/auth");
          logout();
        }
      } else {
        toast.error("Something went wrong. Please try again later.");
        navigate("/auth");
        logout();
      }
    }
  };

  useEffect(() => {
    if (userId) {
      getUserData();
    }
  }, [userId]);

  const logout = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.post(
        `${backendUrl}/auth/logout/${userId}`
      );
      if (response.data.success) {
        handleLogging(`User logged out from the system`);
        setTimeout(() => {
          navigate("/auth");
          setUserData(null);
          setUserId(null);
          localStorage.removeItem("userId");
        }, 1000);
      }
    } catch (error) {
      navigate("/auth");
      setUserData(null);
      setUserId(null);
      localStorage.removeItem("userId");
    }
  };

  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        getUserData,
        userId,
        setUserId,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
