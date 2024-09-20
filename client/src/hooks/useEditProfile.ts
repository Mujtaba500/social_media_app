import axiosInstance from "../axios";
import { useState } from "react";
import toast from "react-hot-toast";

const useEditProfile = () => {
  const [loading, setLoading] = useState(false);

  const editprofile = async (values: FormData) => {
    try {
      setLoading(true);

      const response = await axiosInstance.put("/user/update", values, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
      return response.data.data;
    } catch (err: any) {
      console.log("status: ", err.response.status);
      console.log("Error: ", err.response.data.message);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { editprofile, loading };
};

export default useEditProfile;
