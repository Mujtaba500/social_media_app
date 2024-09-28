import { useSetRecoilState } from "recoil";
import axiosInstance from "../../axios";
import { useState } from "react";
import notificationsState from "../../global/Notifications";
import { Notification } from "../../types";

const useGetNotifications = () => {
  const [loading, setLoading] = useState(false);
  const setNotifications =
    useSetRecoilState<Notification[]>(notificationsState);

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

  return { loading, getNotifications };
};

export default useGetNotifications;
