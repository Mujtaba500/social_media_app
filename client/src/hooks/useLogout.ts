import axiosInstance from "../axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/authContext";

const useLogout = () => {
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      localStorage.setItem("access_token", "");
      toast.success(response.data.message);
      setAuthUser(null);
    } catch (err: any) {
      console.log("status: ", err.response.status);
      console.log("Error: ", err.response.data.message);
      toast.error(err.response.data.message);
    }
  };

  return logout;
};

export default useLogout;
