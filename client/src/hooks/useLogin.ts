import { useState } from "react";
import axiosInstance from "../axios";
import { LoginInputValues } from "../types";
import toast from "react-hot-toast";
import refreshAccessToken from "../utils/refreshAccessToken";

const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async (values: LoginInputValues) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", values);
      localStorage.setItem("access_token", response.data.token);
      toast.success(response.data.message);

      const tokenExpiryInMinutes = response.data.accessTokenExpiry;

      refreshAccessToken(tokenExpiryInMinutes);
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
