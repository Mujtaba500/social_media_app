import axiosInstance from "../../axios";
import { useState } from "react";

const useGetProfile = () => {
  const [loading, setLoading] = useState(true);

  const getProfile = async (username: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/${username}`, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });
      return response.data.data;
    } catch (err: any) {
      console.log("status: ", err.response.status);
      console.log("Error: ", err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { getProfile, loading };
};

export default useGetProfile;
