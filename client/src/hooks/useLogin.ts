import { useState } from "react";
import axiosInstance from "../axios";
import { LoginInputValues } from "../types";
import toast from "react-hot-toast";
import { refreshAccessTokenBg } from "../utils/refreshAccessToken";
import { useAuthContext } from "../context/authContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const { setAuthUser } = useAuthContext();

  const login = async (values: LoginInputValues) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", values);
      localStorage.setItem("access_token", response.data.token);
      toast.success(response.data.message);
      console.log(response.data);

      setAuthUser(response.data.data);

      const tokenExpiryInMinutes = response.data.accessTokenExpiry;

      refreshAccessTokenBg(tokenExpiryInMinutes);
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
