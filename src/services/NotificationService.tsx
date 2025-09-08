import type { ToastOptions } from "react-toastify";
import { toast } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};


const NotificationService = {
  
  showSuccess: (message: string, title: string = "Success") => {
    toast.success(message, {
      ...defaultOptions,
      toastId: title,
    });
  },

  showError: (message: string, title: string = "Error") => {
    toast.error(message, { ...defaultOptions, toastId: title });
  },
  showInfo: (message: string, title: string = "Info") => {
    toast.info(message, { ...defaultOptions, toastId: title });
  },
  showWarning: (message: string, title: string = "Warning") => {
    toast.warn(message, { ...defaultOptions, toastId: title });
  },
};

export default NotificationService;
