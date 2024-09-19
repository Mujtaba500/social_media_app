import { useEffect, useState } from "react";
import axiosInstance from "../axios";
import { User } from "../types";

const useGetSuggested = () => {
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedusers] = useState<User[]>([]);

  useEffect(() => {
    const getSuggested = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("users", {
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
    getSuggested();
  }, []);

  return { suggestedUsers, loading };
};

export default useGetSuggested;
