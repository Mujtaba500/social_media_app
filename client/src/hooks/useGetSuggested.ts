import { useState } from "react";
import axiosInstance from "../axios";
import { useSetRecoilState } from "recoil";
import suggestedUsersState from "../global/SuggestedUsers";

const useGetSuggested = () => {
  const [loading, setLoading] = useState(false);
  const setSuggestedusers = useSetRecoilState(suggestedUsersState);

  const getSuggestedUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users", {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });
      setSuggestedusers(response.data.data);
    } catch (err: any) {
      console.log("status: ", err.response.status);
      console.log("Error: ", err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { getSuggestedUsers, loading };
};

export default useGetSuggested;
