import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

interface AppContextType {
  userData: User | null;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  getUserData: () => Promise<void>;
}

interface User {
  userId: string;
  fullName: string;
  email: string;
}

export const AppContext = createContext<AppContextType>({
  userData: null,
  setUserData: () => {},
  getUserData: async () => {},
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.withCredentials = true;

  const [userData, setUserData] = useState<User | null>(null);
    const [userId, setUserId] = useState<string | null>(
      localStorage.getItem("userId")
    );

  const getUserData = async () => {
    try {
      // fetch user
      const { data } = await axios.get(
        `${backendUrl}/auth/get-user-data/${userId}`
      );
      if (data.success) {
        setUserData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserData();
    }
  }, [userId]);

  return (
    <AppContext.Provider value={{ userData, setUserData, getUserData }}>
      {children}
    </AppContext.Provider>
  );
};
