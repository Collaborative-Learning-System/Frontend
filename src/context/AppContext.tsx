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
  profilePicture?: string;
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
  const fetchProfilePicture = async (userIdToFetch: string) => {
    try {
      const response = await axios.get(
        `${backendUrl}/auth/profile-picture/${userIdToFetch}`
      );

      if (response.data.success && response.data.data.profilePicUrl) {
        return response.data.data.profilePicUrl;
      }
      return null;
    } catch (err) {
      // Silently handle errors - user might not have a profile picture yet
      console.log("No profile picture found or error fetching:", err);
      return null;
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/auth/get-user-data/${userId}`
      );
      if (data.success) {
        const userData = data.data;

        // Fetch profile picture if userId is available
        if (userData.userId) {
          const profilePicUrl = await fetchProfilePicture(userData.userId);
          if (profilePicUrl) {
            userData.profilePicture = profilePicUrl;
          }
        }

        setUserData(userData);
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
        toast.error("Something went wrong. Please log in again.");
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
      const response = await axios.post(`${backendUrl}/auth/logout/${userId}`);
      if (response.data.success) {
        handleLogging(`You logged out from your account`);
        
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
