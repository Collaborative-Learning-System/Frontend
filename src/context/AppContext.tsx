import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

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
}

export const AppContext = createContext<AppContextType>({
  userData: null,
  setUserData: () => {},
  getUserData: async () => { },
  userId: "",
  setUserId: () => { },
  logout: () => { },
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.withCredentials = true;

  const [userData, setUserData] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  console.log("userData:", userData )
  const getUserData = async () => {
    try {
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

  const logout = () => {
    setUserData(null);
    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <AppContext.Provider value={{ 
      userData, 
      setUserData, 
      getUserData, 
      userId, 
      setUserId,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};
