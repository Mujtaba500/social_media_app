import axiosInstance from "../../axios";
import { useEffect, useState } from "react";
import { Notification } from "../../types";

const useGetNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/notifications", {
          headers: {
            Authorization: localStorage.getItem("access_token"),
          },
        });

        setNotifications(response.data.data);
      } catch (err: any) {
        console.log(err);
        console.log("status: ", err.response?.status);
        console.log("Error: ", err.response?.data.message);
      } finally {
        setLoading(false);
      }
    };
    getNotifications();
  }, []);

  return { loading, notifications };
};

export default useGetNotifications;
