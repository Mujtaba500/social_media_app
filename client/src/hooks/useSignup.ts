import { useState } from "react";
import axiosInstance from "../axios";
import { SignupInputValues } from "../types";
import toast from "react-hot-toast";
import { refreshAccessTokenBg } from "../utils/refreshAccessToken";
import { useAuthContext } from "../context/authContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);

  const { setAuthUser } = useAuthContext();

  const signup = async (values: SignupInputValues) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/signup", values);
      localStorage.setItem("access_token", response.data.token);
      toast.success(response.data.message);

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

  return { signup, loading };
};

export default useSignup;
