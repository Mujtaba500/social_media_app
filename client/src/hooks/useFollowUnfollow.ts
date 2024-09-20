import axiosInstance from "../axios";
import { useState } from "react";
import toast from "react-hot-toast";
import useGetSuggested from "./useGetSuggested";

const useFollowUnfollow = () => {
  const [loading, setLoading] = useState(false);

  const { getSuggestedUsers } = useGetSuggested();

  const followUnfollow = async (userId: string) => {
    try {
      setLoading(true);

      const response = await axiosInstance.put(
        `/user/follow/${userId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("access_token"),
          },
        }
      );
      toast.success(response.data.message);
      await getSuggestedUsers();
      return response.data.user;
    } catch (err: any) {
      console.log("status: ", err.response.status);
      console.log("Error: ", err.response.data.message);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { followUnfollow, loading };
};

export default useFollowUnfollow;
