import { useState } from "react";
import axiosInstance from "../axios";
import { LoginInputValues } from "../types";
import toast from "react-hot-toast";

const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async (values: LoginInputValues) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", values);
      console.log(response);
      toast.success(response.data.message);
    } catch (err: any) {
      console.log("status: ", err.response.status);
      console.log("Error: ", err.response.data.message);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useLogin;
