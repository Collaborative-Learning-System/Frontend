import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: string;
  setUserData: React.Dispatch<React.SetStateAction<string>>;
  getUserData: () => Promise<void>;
}


export const AppContext = createContext<AppContextType>({
  backendUrl: "",
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userData: "",
  setUserData: () => {},
  getUserData: async () => {},
});


export const AppContextProvider = (props: any) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState("");

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/auth/get-user-data`);
      ``;
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/auth/get-auth-state`);
      data.success
        ? (setIsLoggedIn(true), getUserData())
        : toast.error(data.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  });

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> 4d17007b1843f5b52cf82eef3f52feb62d0c69d3
