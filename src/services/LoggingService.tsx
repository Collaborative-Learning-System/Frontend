import axios from "axios";

export const handleLogging = async (activity: string) => {
  const loggingData = {
    userId: localStorage.getItem("userId"),
    activity: activity,
    timestamp: new Date().toISOString(),
  };
  try {
    if (!loggingData.userId || !loggingData.activity || !loggingData.timestamp)
      return;
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/notification/log-activity`,
      loggingData
    );
    if (response) {
      console.log("Logging response:", response.data);
    }
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};
