import axios from "axios";

export const notifyUsers = async (users: string[], notification: string) => {
  const notifyData = {
    users: users,
    notification: notification,
    timestamp: new Date().toISOString(),
   // isRead: false,
  };
  try {
    if (notifyData.users.length === 0 || !notifyData.notification || !notifyData.timestamp)
      return;

    console.log("hitting notify users");
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/notification/send-notifications`,
      notifyData
      );
      console.log("coming here");
    if (response) {
      console.log("Notification response:", response.data);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
