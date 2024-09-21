import axiosInstance from "../../axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import notificationsState from "../../global/Notifications";

const useDeleteNotifications = () => {
  const [loading, setLoading] = useState(false);
  const setNotifications = useSetRecoilState(notificationsState);

  const deleteNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete("/notifications", {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });

      toast.success(response.data.message);
      setNotifications([]);
    } catch (err: any) {
      console.log(err);
      console.log("status: ", err.response?.status);
      console.log("Error: ", err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteNotifications };
};

export default useDeleteNotifications;
